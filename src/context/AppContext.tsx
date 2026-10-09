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
}

const STORAGE_KEY_USERS = 'ethio_impex_users_v3';
const STORAGE_KEY_CURRENT_USER = 'ethio_impex_curr_user_v3';
const STORAGE_KEY_THEME = 'ethio_impex_theme';
const STORAGE_KEY_QUIZ_SCORES = 'ethio_impex_quiz_scores_v3';
const STORAGE_KEY_USER_QUIZZES = 'ethio_impex_user_quizzes_v1';
type QuizScores = Record<string, { score: number; maxScore: number; date: string }>;
const ALL_CHAPTERS = COURSE_MODULES.flatMap(module => module.chapters);
const CHAPTER_IDS = new Set(ALL_CHAPTERS.map(chapter => chapter.id));
const saveLocal = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    window.dispatchEvent(new Event('academy-storage-error'));
  }
};

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) return stored;
    } catch (e) {
      console.error(e);
    }
    return 'user-01';
  });

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

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || SEED_USERS[0];
  const quizScores = userQuizScores[currentUser.id] || {};
  const isAdmin = currentUser.role === 'admin';

  const isSubscriptionValid = () => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.subscriptionStatus !== 'active_paid') return false;
    if (!currentUser.expiresAt) return false;
    return new Date(currentUser.expiresAt).getTime() > Date.now();
  };

  const hasFullAccess = isAdmin || isSubscriptionValid();

  // Progress logic
  const completedChapters = [...new Set(currentUser.completedChapters || [])].filter(id => CHAPTER_IDS.has(id));
  const completedChaptersCount = completedChapters.length;
  const progressPercentage = Math.round((completedChaptersCount / ALL_CHAPTERS.length) * 100);

  const isChapterCompleted = (chapterId: string) => {
    return completedChapters.includes(chapterId);
  };

  const toggleChapterComplete = (chapterId: string) => {
    const chapter = ALL_CHAPTERS.find(ch => ch.id === chapterId);
    if (!chapter || (!hasFullAccess && !chapter.isFreeTrialAccessible)) return;
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUser.id) {
          const currentList = u.completedChapters || [];
          const exists = currentList.includes(chapterId);
          const updated = exists
            ? currentList.filter(id => id !== chapterId)
            : [...currentList, chapterId];

          return {
            ...u,
            completedChapters: updated
          };
        }
        return u;
      })
    );
  };

  const recordQuizScore = (chapterId: string, score: number, maxScore: number) => {
    const chapter = ALL_CHAPTERS.find(ch => ch.id === chapterId);
    if (!chapter || (!hasFullAccess && !chapter.isFreeTrialAccessible) ||
      !Number.isInteger(score) || maxScore !== chapter.quiz.length || maxScore < 1 ||
      score < 0 || score > maxScore) return;
    const today = new Date().toISOString().split('T')[0];
    setUserQuizScores(prev => ({
      ...prev,
      [currentUser.id]: {
        ...prev[currentUser.id],
        [chapterId]: { score, maxScore, date: today }
      }
    }));

    // Auto-mark chapter as complete if passed with 60%+ score
    if (score / maxScore >= 0.6) {
      if (!isChapterCompleted(chapterId)) {
        toggleChapterComplete(chapterId);
      }
    }
  };

  const issueCertificate = () => {
    if (completedChaptersCount !== ALL_CHAPTERS.length) return;
    const certCode = `ET-IMPEX-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUserId) {
          return {
            ...u,
            certificateId: u.certificateId || certCode,
            certificateIssuedAt: u.certificateIssuedAt || now
          };
        }
        return u;
      })
    );
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
        recordQuizScore
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
