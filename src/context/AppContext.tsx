import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { COURSE_MODULES } from '../data/courseData';

export type NavTabType =
  | 'overview'
  | 'curriculum'
  | 'lc_calculator'
  | 'landed_cost'
  | 'tax_calculator'
  | 'quiz_center'
  | 'resources'
  | 'progress'
  | 'certificate'
  | 'subscription'
  | 'admin';

interface AppContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  adminApproveUser: (userId: string, days?: number) => void;
  adminRejectUser: (userId: string, reason?: string) => void;
  adminExtendUser: (userId: string, days?: number) => void;
  switchUser: (userId: string) => void;
  loginAsAdmin: () => void;
  isAdmin: boolean;
  hasFullAccess: boolean;
  activeNavTab: NavTabType;
  setActiveNavTab: (tab: NavTabType) => void;
  selectedChapterId: string;
  setSelectedChapterId: (id: string) => void;
  showPaywallModal: boolean;
  setShowPaywallModal: (show: boolean) => void;
  // Progress and Certificate
  toggleChapterComplete: (chapterId: string) => void;
  isChapterCompleted: (chapterId: string) => boolean;
  completedChaptersCount: number;
  progressPercentage: number;
  issueCertificate: () => void;
  quizScores: Record<string, { score: number; maxScore: number; date: string }>;
  recordQuizScore: (chapterId: string, score: number, maxScore: number) => void;
  progressSaveError: string;
}

const STORAGE_KEY_USERS = 'ethio_impex_users_v3';
const STORAGE_KEY_CURRENT_USER = 'ethio_impex_curr_user_v3';
const STORAGE_KEY_THEME = 'ethio_impex_theme';
const STORAGE_KEY_QUIZ_SCORES = 'ethio_impex_quiz_scores_v3';
const STORAGE_KEY_USER_QUIZZES = 'ethio_impex_user_quizzes_v1';
type QuizScores = Record<string, { score: number; maxScore: number; date: string }>;
type LearnerProgress = {
  completedChapters: string[];
  quizScores: QuizScores;
  certificateId: string | null;
  certificateIssuedAt: string | null;
};
const ALL_CHAPTERS = COURSE_MODULES.flatMap(module => module.chapters);
const CHAPTER_IDS = new Set(ALL_CHAPTERS.map(chapter => chapter.id));
const EMPTY_PROGRESS: LearnerProgress = {
  completedChapters: [],
  quizScores: {},
  certificateId: null,
  certificateIssuedAt: null,
};
const saveLocal = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    window.dispatchEvent(new Event('academy-storage-error'));
  }
};

function readLegacyProgress(userId: string): LearnerProgress | null {
  try {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]');
    const localUser = Array.isArray(users) ? users.find(user => user?.id === userId) : undefined;
    const scopedQuizzes = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_QUIZZES) || '{}');
    const quizScores = scopedQuizzes?.[userId];
    const completedChapters = Array.isArray(localUser?.completedChapters)
      ? localUser.completedChapters.filter((id: unknown): id is string => typeof id === 'string' && CHAPTER_IDS.has(id))
      : [];
    const validQuizScores = quizScores && typeof quizScores === 'object' && !Array.isArray(quizScores)
      ? quizScores
      : {};
    const allComplete = Array.isArray(localUser?.completedChapters) &&
      ALL_CHAPTERS.every(chapter => localUser.completedChapters.includes(chapter.id));
    const certificateId = allComplete && typeof localUser?.certificateId === 'string'
      ? localUser.certificateId
      : null;
    const certificateIssuedAt = certificateId && typeof localUser?.certificateIssuedAt === 'string'
      ? localUser.certificateIssuedAt
      : null;
    if (!completedChapters.length && !Object.keys(validQuizScores).length && !certificateIssuedAt) return null;
    return {
      completedChapters,
      quizScores: validQuizScores,
      certificateId: certificateIssuedAt ? certificateId : null,
      certificateIssuedAt,
    };
  } catch {
    // Old browser data is optional; it must never prevent account progress from loading.
    return EMPTY_PROGRESS;
  }
}

const SEED_USERS: UserProfile[] = [
  {
    id: 'admin-01',
    fullName: 'Demo Administrator',
    phoneNumber: '',
    email: 'admin@example.invalid',
    role: 'admin',
    subscriptionStatus: 'free_trial',
    registeredAt: '2026-01-01T00:00:00.000Z',
    expiresAt: null,
    paymentAmount: 0,
    completedChapters: []
  },
  {
    id: 'user-01',
    fullName: 'Demo Learner',
    phoneNumber: '',
    email: 'learner@example.invalid',
    role: 'user',
    subscriptionStatus: 'free_trial',
    registeredAt: '2026-01-01T00:00:00.000Z',
    expiresAt: null,
    paymentAmount: 0,
    completedChapters: []
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode; profile: UserProfile }> = ({ children, profile }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length && parsed.every(user =>
          typeof user.id === 'string' && typeof user.fullName === 'string' &&
          ['user', 'admin'].includes(user.role) &&
          (!user.completedChapters || Array.isArray(user.completedChapters))
        )) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return SEED_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(profile.id);
  const [progress, setProgress] = useState<LearnerProgress | null>(null);
  const [progressOwnerId, setProgressOwnerId] = useState<string | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressLoadError, setProgressLoadError] = useState('');
  const [progressSaveError, setProgressSaveError] = useState('');
  const [progressRetry, setProgressRetry] = useState(0);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_THEME);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) {
      console.error(e);
    }
    return 'light';
  });

  const [activeNavTab, setActiveNavTab] = useState<NavTabType>('overview');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-1');
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);

  const [userQuizScores, setUserQuizScores] = useState<Record<string, QuizScores>>(() => {
    try {
      const scoped = localStorage.getItem(STORAGE_KEY_USER_QUIZZES);
      if (scoped) {
        const parsed = JSON.parse(scoped);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
      }
      const stored = localStorage.getItem(STORAGE_KEY_QUIZ_SCORES);
      if (stored) return { 'user-01': JSON.parse(stored) };
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  useEffect(() => {
    saveLocal(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    saveLocal(STORAGE_KEY_CURRENT_USER, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    saveLocal(STORAGE_KEY_USER_QUIZZES, JSON.stringify(userQuizScores));
  }, [userQuizScores]);

  useEffect(() => {
    let active = true;
    setProgress(null);
    setProgressLoading(true);
    setProgressLoadError('');

    const loadProgress = async () => {
      try {
        const response = await fetch('/api/progress', { credentials: 'same-origin' });
        if (!response.ok) throw new Error('Could not load your saved learning progress.');
        const result = await response.json();
        let loaded: LearnerProgress | null = result.progress;
        if (!loaded) {
          const legacyProgress = readLegacyProgress(profile.id);
          if (legacyProgress) {
            const importResponse = await fetch('/api/progress', {
              method: 'PUT',
              credentials: 'same-origin',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(legacyProgress),
            });
            if (!importResponse.ok) throw new Error('Could not save this device’s learning progress to your account.');
            loaded = (await importResponse.json()).progress;
          }
        }
        if (active) {
          setProgress(loaded);
          setProgressOwnerId(profile.id);
          if (loaded) setUserQuizScores(previous => ({ ...previous, [profile.id]: loaded.quizScores }));
        }
      } catch (error) {
        if (active) setProgressLoadError(error instanceof Error ? error.message : 'Could not load your saved learning progress.');
      } finally {
        if (active) setProgressLoading(false);
      }
    };

    void loadProgress();
    return () => { active = false; };
  }, [profile.id, progressRetry]);

  useEffect(() => {
    if (!progress) return;
    setUsers(previous => {
      const existing = previous.find(user => user.id === profile.id);
      const updated = {
        ...(existing || profile),
        ...profile,
        completedChapters: progress.completedChapters,
        certificateId: progress.certificateId || undefined,
        certificateIssuedAt: progress.certificateIssuedAt || undefined,
      };
      return existing
        ? previous.map(user => user.id === profile.id ? updated : user)
        : [updated, ...previous];
    });
  }, [progress, profile.id]);

  useEffect(() => {
    saveLocal(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    setCurrentUserId(profile.id);
    setUsers(previous => {
      const saved = previous.find(user => user.id === profile.id);
      const next = { ...(saved || profile), ...profile, completedChapters: saved?.completedChapters || profile.completedChapters };
      return saved ? previous.map(user => user.id === profile.id ? next : user) : [next, ...previous];
    });
  }, [profile.id, profile.email, profile.fullName, profile.role, profile.subscriptionStatus, profile.expiresAt]);
  const currentUser = {
    ...(users.find(u => u.id === profile.id) || profile),
    ...profile,
    completedChapters: progress?.completedChapters || [],
    certificateId: progress?.certificateId || undefined,
    certificateIssuedAt: progress?.certificateIssuedAt || undefined,
  };
  const quizScores = progress?.quizScores || {};
  const isAdmin = currentUser.role === 'admin';

  const isSubscriptionValid = () => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.subscriptionStatus !== 'active_paid') return false;
    if (!currentUser.expiresAt) return false;
    return new Date(currentUser.expiresAt).getTime() > Date.now();
  };

  const hasFullAccess = isAdmin || isSubscriptionValid();

  // Progress logic
  const completedChapters = [...new Set(progress?.completedChapters || [])].filter(id => CHAPTER_IDS.has(id));
  const completedChaptersCount = completedChapters.length;
  const progressPercentage = Math.round((completedChaptersCount / ALL_CHAPTERS.length) * 100);

  const isChapterCompleted = (chapterId: string) => {
    return completedChapters.includes(chapterId);
  };

  const saveProgressAction = async (action: Record<string, unknown>) => {
    setProgressSaveError('');
    try {
      if (!progress) {
        const initializeResponse = await fetch('/api/progress', {
          method: 'PUT',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(EMPTY_PROGRESS),
        });
        if (!initializeResponse.ok) throw new Error('Your saved progress could not be initialized.');
        setProgress((await initializeResponse.json()).progress);
      }
      const response = await fetch('/api/progress', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your progress could not be saved.');
      setProgress(result.progress);
      setUserQuizScores(previous => ({ ...previous, [profile.id]: result.progress.quizScores }));
    } catch (error) {
      setProgressSaveError(error instanceof Error ? error.message : 'Your progress could not be saved.');
    }
  };

  const toggleChapterComplete = async (chapterId: string) => {
    const chapter = ALL_CHAPTERS.find(ch => ch.id === chapterId);
    if (!chapter || (!hasFullAccess && !chapter.isFreeTrialAccessible)) return;
    await saveProgressAction({
      action: 'chapter',
      chapterId,
      completed: !completedChapters.includes(chapterId),
    });
  };

  const recordQuizScore = async (chapterId: string, score: number, maxScore: number) => {
    const chapter = ALL_CHAPTERS.find(ch => ch.id === chapterId);
    if (!chapter || (!hasFullAccess && !chapter.isFreeTrialAccessible) ||
      !Number.isInteger(score) || maxScore !== chapter.quiz.length || maxScore < 1 ||
      score < 0 || score > maxScore) return;
    await saveProgressAction({ action: 'quiz', chapterId, score });
  };

  const issueCertificate = async () => {
    if (completedChaptersCount !== ALL_CHAPTERS.length) return;
    await saveProgressAction({ action: 'certificate' });
  };

  const adminApproveUser = (userId: string, days: number = 30) => {
    if (!isAdmin || !Number.isInteger(days) || days < 1) return;
    const now = new Date();
    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            subscriptionStatus: 'active_paid',
            approvedAt: now.toISOString(),
            expiresAt: expiry.toISOString(),
            notes: `Approved by admin for ${days} days until ${expiry.toLocaleDateString()}`
          };
        }
        return u;
      })
    );
  };

  const adminRejectUser = (userId: string, reason?: string) => {
    if (!isAdmin) return;
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            subscriptionStatus: 'rejected',
            notes: reason || 'Payment could not be verified'
          };
        }
        return u;
      })
    );
  };

  const adminExtendUser = (userId: string, days: number = 30) => {
    if (!isAdmin || !Number.isInteger(days) || days < 1) return;
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const currentExpiry = u.expiresAt ? new Date(u.expiresAt).getTime() : Date.now();
          const baseTime = Math.max(currentExpiry, Date.now());
          const newExpiry = new Date(baseTime + days * 24 * 60 * 60 * 1000);
          return {
            ...u,
            subscriptionStatus: 'active_paid',
            expiresAt: newExpiry.toISOString(),
            notes: `Extended +${days} days until ${newExpiry.toLocaleDateString()}`
          };
        }
        return u;
      })
    );
  };

  const switchUser = (userId: string) => {
    if (!users.some(user => user.id === userId)) return;
    setCurrentUserId(userId);
    setActiveNavTab('overview');
  };

  const loginAsAdmin = () => {
    setCurrentUserId('admin-01');
    setActiveNavTab('admin');
  };

  if (progressLoading || (!progressLoadError && progressOwnerId !== profile.id)) {
    return <div className="flex min-h-screen items-center justify-center text-sm academy-muted">Loading your saved learning progress…</div>;
  }
  if (progressLoadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-sm academy-muted">
        <p role="alert">{progressLoadError}</p>
        <button type="button" onClick={() => setProgressRetry(value => value + 1)} className="rounded-xl bg-[#176b60] px-5 py-3 font-bold text-white">
          Try again
        </button>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        theme,
        toggleTheme,
        adminApproveUser,
        adminRejectUser,
        adminExtendUser,
        switchUser,
        loginAsAdmin,
        isAdmin,
        hasFullAccess,
        activeNavTab,
        setActiveNavTab,
        selectedChapterId,
        setSelectedChapterId,
        showPaywallModal,
        setShowPaywallModal,
        toggleChapterComplete,
        isChapterCompleted,
        completedChaptersCount,
        progressPercentage,
        issueCertificate,
        quizScores,
        recordQuizScore,
        progressSaveError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
