import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { NavTabType } from '../context/AppContext';
import {
  Award, BookOpen, Calculator, Check, ChevronDown, Coins, CreditCard, FileCheck2,
  FileSpreadsheet, FileText, LayoutDashboard, Menu, Moon, Shield, Sun, X
} from 'lucide-react';

type NavItem = { id: 'overview' | 'curriculum' | 'quiz_center' | 'progress' | 'certificate' | 'landed_cost' | 'lc_calculator' | 'tax_calculator' | 'resources' | 'subscription' | 'admin'; label: string; icon: React.ElementType };

const sections: { label: string; items: NavItem[] }[] = [
  { label: 'Learning', items: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'quiz_center', label: 'Quizzes', icon: Check },
    { id: 'progress', label: 'Progress', icon: FileCheck2 },
    { id: 'certificate', label: 'Certificate', icon: Award },
  ] },
  { label: 'Trade tools', items: [
    { id: 'landed_cost', label: 'Landed cost', icon: FileSpreadsheet },
    { id: 'lc_calculator', label: 'L/C calculator', icon: Calculator },
    { id: 'tax_calculator', label: 'Customs tax', icon: Coins },
  ] },
  { label: 'Reference', items: [{ id: 'resources', label: 'Resources', icon: FileText }] },
];

export const Navbar: React.FC = () => {
  const {
    activeNavTab, setActiveNavTab, theme, toggleTheme, currentUser,
    users, switchUser, loginAsAdmin, isAdmin
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userDropdownOpen) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setUserDropdownOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [userDropdownOpen]);

  const navigate = (tab: NavItem['id']) => {
    setActiveNavTab(tab as NavTabType);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const renderNavItem = (item: NavItem, mobile = false) => {
    const Icon = item.icon;
    const active = activeNavTab === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => navigate(item.id)}
        aria-current={active ? 'page' : undefined}
        className={`group flex items-center gap-2 rounded-lg text-left transition-colors ${
          mobile ? 'w-full px-3 py-2.5 text-sm' : 'whitespace-nowrap px-2.5 py-2 text-[11px]'
        } ${active ? 'bg-[#e6f1ed] font-bold text-[#145c52] dark:bg-[#263a35] dark:text-[#b5dfd2]' : 'font-semibold text-[#596760] hover:bg-[#eef1ec] hover:text-[#202b29] dark:text-[#b1bdb5] dark:hover:bg-[#26312d] dark:hover:text-white'}`}
      >
        <Icon className={`${mobile ? 'h-4 w-4' : 'h-3.5 w-3.5'} shrink-0 ${active ? 'text-[#176b60] dark:text-[#8bc9b8]' : ''}`} />
        <span>{item.label}</span>
        {active && mobile && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[#176b60] dark:text-[#8bc9b8]">Current</span>}
      </button>
    );
  };

  return (
    <header className="no-print relative z-40 border-b academy-line bg-[var(--paper)]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 xl:px-8">
        <div className="flex min-h-[68px] items-center justify-between gap-4">
          <button onClick={() => navigate('overview')} className="group flex min-w-0 items-center gap-3 text-left" aria-label="Academy overview">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#174f49] text-[#efcf9e] shadow-sm transition-transform group-hover:-rotate-3">
              <span className="font-serif-title text-sm font-extrabold tracking-[-.06em]">ET</span>
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif-title text-[15px] font-extrabold tracking-[-.035em] sm:text-base">Ethio-ImpEx Academy</span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[.15em] academy-muted">Trade learning workspace</span>
            </span>
          </button>

          <nav aria-label="Main navigation" className="hidden min-[1180px]:flex min-w-0 items-center gap-2">
            {sections.map(section => (
              <div key={section.label} className="flex items-center gap-0.5 border-r pr-2 academy-line last:border-0 last:pr-0">
                <span className="mr-1 hidden 2xl:block text-[9px] font-bold uppercase tracking-[.12em] academy-muted">{section.label}</span>
                {section.items.map(item => renderNavItem(item))}
              </div>
            ))}
            {isAdmin && renderNavItem({ id: 'admin', label: 'Admin · demo', icon: Shield })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(value => !value)}
                aria-expanded={userDropdownOpen}
                aria-haspopup="menu"
                className="flex min-h-10 items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition hover:bg-[#f1f4ef] dark:hover:bg-[#26312d] sm:px-2.5 academy-line"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dce9e2] text-[11px] font-bold text-[#205f53] dark:bg-[#344c43] dark:text-[#c8e6d8]">{currentUser.fullName.charAt(0)}</span>
                <span className="hidden max-w-28 sm:block">
                  <span className="block truncate text-[11px] font-bold">{currentUser.fullName.split(' ').slice(0, 2).join(' ')}</span>
                  <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[.1em] academy-accent">Demo account</span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 academy-muted" />
              </button>
              {userDropdownOpen && (
                <div role="menu" className="absolute right-0 top-full mt-2 w-[min(330px,calc(100vw-24px))] rounded-2xl border academy-line academy-paper p-2 shadow-[0_18px_45px_rgba(21,39,32,.18)]">
                  <div className="border-b px-3 py-2.5 academy-line">
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] academy-accent">Demo account controls</p>
                    <p className="mt-1 truncate text-xs font-semibold">{currentUser.fullName}</p>
                    <p className="mt-1 text-[10px] leading-4 academy-muted">Sample identities only. This workspace does not use secure authentication.</p>
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1">
                    {users.filter(user => user.role !== 'admin' || isAdmin).map(user => (
                      <button key={user.id} role="menuitem" onClick={() => { switchUser(user.id); setUserDropdownOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[#eff3ee] dark:hover:bg-[#26312d]">
                        <span><span className="block text-xs font-semibold">{user.fullName}</span><span className="mt-0.5 block text-[10px] capitalize academy-muted">{user.role === 'admin' ? 'Administrator · demo' : user.subscriptionStatus.replaceAll('_', ' ')}</span></span>
                        {user.id === currentUser.id && <Check className="h-4 w-4 text-[#176b60]" />}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-1 border-t pt-2 academy-line">
                    {!isAdmin && <button role="menuitem" onClick={() => { loginAsAdmin(); setUserDropdownOpen(false); }} className="rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#176b60] hover:bg-[#e6f1ed] dark:text-[#b5dfd2] dark:hover:bg-[#263a35]">Switch to administrator demo</button>}
                    <button role="menuitem" onClick={() => navigate('subscription')} className="rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-[#eff3ee] dark:hover:bg-[#26312d]">Pricing & subscription · demo</button>
                  </div>
                </div>
              )}
            </div>
            <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} className="flex h-10 w-10 items-center justify-center rounded-xl text-[#68766f] transition hover:bg-[#eef1ec] dark:text-[#b7c1ba] dark:hover:bg-[#26312d]">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-[#e6b57d]" />}
            </button>
            <button type="button" onClick={() => setMobileMenuOpen(value => !value)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'} className="flex h-10 w-10 items-center justify-center rounded-xl text-[#596760] hover:bg-[#eef1ec] dark:text-[#d5ddd7] dark:hover:bg-[#26312d] min-[1180px]:hidden">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav aria-label="Mobile navigation" className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t py-4 academy-line min-[1180px]:hidden">
            <div className="grid gap-5 sm:grid-cols-2">
              {sections.map(section => (
                <div key={section.label}>
                  <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[.15em] academy-muted">{section.label}</p>
                  <div className="space-y-0.5">{section.items.map(item => renderNavItem(item, true))}</div>
                </div>
              ))}
              {isAdmin && <section><p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[.15em] academy-muted">Administration</p>{renderNavItem({ id: 'admin', label: 'Admin dashboard · demo', icon: Shield }, true)}</section>}
              <section>
                <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[.15em] academy-muted">Account</p>
                {renderNavItem({ id: 'subscription', label: 'Pricing & subscription · demo', icon: CreditCard }, true)}
              </section>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
