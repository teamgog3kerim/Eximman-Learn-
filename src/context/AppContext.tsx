import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SubscriptionStatus } from '../types';

export type NavTabType =
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
  registerUser: (data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    isPaid: boolean;
    telebirrTxId?: string;
    paymentScreenshot?: string;
  }) => UserProfile;
  submitPayment: (telebirrTxId: string, paymentScreenshot?: string) => void;
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

const ALL_16_CHAPTER_IDS = [
  'ch-1', 'ch-2', 'ch-3', 'ch-4', 'ch-5', 'ch-6',
  'ch-7', 'ch-8', 'ch-9', 'ch-10', 'ch-11', 'ch-12',
  'ch-13', 'ch-14', 'ch-15', 'ch-16'
];

const SEED_USERS: UserProfile[] = [
  {
    id: 'admin-01',
    fullName: 'Abdulkerim (Program Director & Lead Specialist)',
    phoneNumber: '0967684490',
    email: 'abdulkerim@ethio-impex.com',
    role: 'admin',
    subscriptionStatus: 'active_paid',
    registeredAt: '2026-09-01T08:00:00.000Z',
    expiresAt: '2028-12-31T23:59:59.000Z',
    paymentAmount: 3900,
    approvedAt: '2026-09-01T08:00:00.000Z',
    notes: 'Program Director & Telebirr 0967684490 Recipient',
    completedChapters: ALL_16_CHAPTER_IDS,
    certificateId: 'ET-IMPEX-2026-MASTER-001',
    certificateIssuedAt: '2026-09-05T12:00:00.000Z'
  },
  {
    id: 'user-01',
    fullName: 'Dawit Bekele',
    phoneNumber: '0911223344',
    email: 'dawit.trade@gmail.com',
    role: 'user',
    subscriptionStatus: 'free_trial',
    registeredAt: '2026-10-06T10:15:00.000Z',
    expiresAt: null,
    paymentAmount: 0,
    notes: 'Testing free trial (Module 1, Ch 1 & 2)',
    completedChapters: ['ch-1']
  },
  {
    id: 'user-02',
    fullName: 'Hiwot Tesfaye',
    phoneNumber: '0922334455',
    email: 'hiwot.logistics@gmail.com',
    role: 'user',
    subscriptionStatus: 'pending_approval',
    registeredAt: '2026-10-07T14:30:00.000Z',
    expiresAt: null,
    telebirrTxId: 'TB-9823419082',
    paymentAmount: 3900,
    notes: 'Paid 3,900 ETB to 0967684490 (Abdulkerim). Awaiting approval.',
    completedChapters: ['ch-1', 'ch-2']
  },
  {
    id: 'user-03',
    fullName: 'Solomon Girma',
    phoneNumber: '0933445566',
    email: 'solomon.coffee.export@gmail.com',
    role: 'user',
    subscriptionStatus: 'active_paid',
    registeredAt: '2026-09-20T09:00:00.000Z',
    expiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    telebirrTxId: 'TB-7744119932',
    paymentAmount: 3900,
    approvedAt: '2026-09-20T09:30:00.000Z',
    notes: 'Active subscriber (All 16 Chapters Completed · Certified)',
    completedChapters: ALL_16_CHAPTER_IDS,
    certificateId: 'ET-IMPEX-2026-8841',
    certificateIssuedAt: '2026-10-04T16:30:00.000Z'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) return JSON.parse(stored);
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
    return 'user-01'; // Default to free trial student
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

  const [activeNavTab, setActiveNavTab] = useState<NavTabType>('curriculum');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch-1');
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);

  const [quizScores, setQuizScores] = useState<Record<string, { score: number; maxScore: number; date: string }>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_QUIZ_SCORES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      'ch-1': { score: 3, maxScore: 3, date: '2026-10-06' }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUIZ_SCORES, JSON.stringify(quizScores));
  }, [quizScores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
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
  const isAdmin = currentUser.role === 'admin';

  const isSubscriptionValid = () => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.subscriptionStatus !== 'active_paid') return false;
    if (!currentUser.expiresAt) return false;
    return new Date(currentUser.expiresAt).getTime() > Date.now();
  };

  const hasFullAccess = isAdmin || isSubscriptionValid();

  // Progress logic
  const completedChapters = currentUser.completedChapters || [];
  const completedChaptersCount = completedChapters.length;
  const progressPercentage = Math.round((completedChaptersCount / 16) * 100);

  const isChapterCompleted = (chapterId: string) => {
    return completedChapters.includes(chapterId);
  };

  const toggleChapterComplete = (chapterId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUserId) {
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
    const today = new Date().toISOString().split('T')[0];
    setQuizScores(prev => ({
      ...prev,
      [chapterId]: { score, maxScore, date: today }
    }));

    // Auto-mark chapter as complete if passed with 60%+ score
    if (score / maxScore >= 0.6) {
      if (!isChapterCompleted(chapterId)) {
        toggleChapterComplete(chapterId);
      }
    }
  };

  const issueCertificate = () => {
    const certCode = `ET-IMPEX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
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

  const registerUser = (data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    isPaid: boolean;
    telebirrTxId?: string;
    paymentScreenshot?: string;
  }): UserProfile => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      role: 'user',
      subscriptionStatus: data.isPaid ? 'pending_approval' : 'free_trial',
      registeredAt: new Date().toISOString(),
      expiresAt: null,
      telebirrTxId: data.telebirrTxId,
      paymentScreenshot: data.paymentScreenshot,
      paymentAmount: data.isPaid ? 3900 : 0,
      notes: data.isPaid ? 'Registered with Telebirr 3,900 ETB proof' : 'Registered on Free Trial',
      completedChapters: []
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const submitPayment = (telebirrTxId: string, paymentScreenshot?: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === currentUserId) {
          return {
            ...u,
            subscriptionStatus: 'pending_approval',
            telebirrTxId,
            paymentScreenshot: paymentScreenshot || u.paymentScreenshot,
            paymentAmount: 3900,
            notes: `Submitted payment 3,900 ETB to 0967684490 (Abdulkerim) at ${new Date().toLocaleDateString()}`
          };
        }
        return u;
      })
    );
  };

  const adminApproveUser = (userId: string, days: number = 30) => {
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
    setCurrentUserId(userId);
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
        registerUser,
        submitPayment,
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
