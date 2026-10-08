import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Calculator,
  FileSpreadsheet,
  Coins,
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  CreditCard,
  UserCheck,
  ChevronDown,
  Sparkles,
  FileText,
  FileCheck,
  Award
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    theme,
    toggleTheme,
    currentUser,
    users,
    switchUser,
    loginAsAdmin,
    setShowPaywallModal
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'curriculum', label: 'Curriculum (16 Ch)', icon: BookOpen },
    { id: 'resources', label: 'Resources & Glossary', icon: FileText },
    { id: 'progress', label: 'Records Tracker', icon: FileCheck },
    { id: 'certificate', label: 'Certification', icon: Award },
    { id: 'landed_cost', label: 'Cost Build-Up', icon: FileSpreadsheet },
    { id: 'lc_calculator', label: 'LC Tool', icon: Calculator },
    { id: 'tax_calculator', label: 'Customs Tax', icon: Coins },
    { id: 'quiz_center', label: 'Quizzes', icon: Sparkles },
    { id: 'subscription', label: 'Pricing (3,900 ETB)', icon: CreditCard },
    { id: 'admin', label: 'Admin Portal', icon: Shield }
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveNavTab('curriculum')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-serif-title text-base font-bold text-amber-300">ET</span>
              </div>
              <div>
                <span className="font-serif-title font-bold text-base md:text-lg tracking-tight text-neutral-900 dark:text-neutral-50 block leading-tight">
                  Ethio-ImpEx Academy
                </span>
                <span className="text-[10px] font-sans font-medium text-amber-700 dark:text-amber-400 block -mt-0.5">
                  Import, Export & Logistics Mastery
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeNavTab === item.id;
              const isAdminTab = item.id === 'admin';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNavTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-2xs'
                      : isAdminTab
                      ? 'text-amber-800 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: User Switcher & Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-left transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 max-w-[120px]">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-neutral-400 leading-none">
                    {currentUser.role === 'admin'
                      ? 'Admin (Abdulkerim)'
                      : currentUser.subscriptionStatus === 'active_paid'
                      ? 'Paid Subscriber'
                      : currentUser.subscriptionStatus === 'pending_approval'
                      ? 'Pending Approval'
                      : 'Free Trial'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Switch User Role / Perspective
                    </span>
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                      {currentUser.fullName} ({currentUser.email})
                    </div>
                  </div>

                  <div className="py-1 space-y-1">
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{u.fullName}</div>
                          <div className="text-[10px] text-neutral-400">
                            {u.role === 'admin' ? 'Administrator' : u.subscriptionStatus}
                          </div>
                        </div>
                        {u.id === currentUser.id && (
                          <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between">
                    <button
                      onClick={() => {
                        loginAsAdmin();
                        setUserDropdownOpen(false);
                      }}
                      className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline px-2 py-1"
                    >
                      Login as Admin (Abdulkerim)
                    </button>
                    <button
                      onClick={() => {
                        setShowPaywallModal(true);
                        setUserDropdownOpen(false);
                      }}
                      className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 px-2 py-1"
                    >
                      Pay Telebirr
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Toggle color theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl xl:hidden text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeNavTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNavTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
