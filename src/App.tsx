/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { AppProvider, useApp } from './context/AppContext';
import { useLanguage } from './context/LanguageContext';
import { PublicLanding } from './components/PublicLanding';
import { Navbar } from './components/Navbar';
import { LearningDashboard } from './components/LearningDashboard';
import { CourseViewer } from './components/CourseViewer';
import { CostBreakdownSheet } from './components/CostBreakdownSheet';
import { LCCalculator } from './components/LCCalculator';
import { TaxAssessmentCalculator } from './components/TaxAssessmentCalculator';
import { QuizCenter } from './components/QuizCenter';
import { PaymentWorkspace } from './components/PaymentWorkspace';
import { ResourceLibrary } from './components/ResourceLibrary';
import { RecordsTracker } from './components/RecordsTracker';
import { CertificationView } from './components/CertificationView';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AlertTriangle, Info, Send } from 'lucide-react';

const toolTabs = ['landed_cost', 'lc_calculator', 'tax_calculator'];

const MainContent: React.FC = () => {
  const { t } = useLanguage();
  const {
    activeNavTab, isAdmin, hasFullAccess, hasTrialAccess, trialDaysRemaining,
    showPaywallModal, setShowPaywallModal, progressSaveError,
    progressSaveNotice, pendingProgressCount, progressSaving, retryProgressSave, discardPendingProgress
  } = useApp();
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    const warn = () => setStorageWarning(true);
    window.addEventListener('academy-storage-error', warn);
    return () => window.removeEventListener('academy-storage-error', warn);
  }, []);
  const isTool = toolTabs.includes(activeNavTab);
  const isSubscription = activeNavTab === 'subscription';
  const showAdmin = activeNavTab === 'admin' && isAdmin;

  return (
    <div className="academy-shell flex min-h-[100dvh] flex-col transition-colors">
      <Navbar />

      {storageWarning && (
        <div role="alert" className="border-b border-rose-300 bg-rose-50 px-4 py-2.5 text-xs leading-5 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100">
          <p className="mx-auto max-w-[1440px]"><strong>Browser storage is unavailable or full.</strong> Your latest progress may not persist after closing this page.</p>
        </div>
      )}

      <div className="no-print border-b border-[#ead7bb] bg-[#fff5e8] px-4 py-2.5 text-[#6b4c2b] dark:border-[#574633] dark:bg-[#392e22] dark:text-[#e9c99f]">
        <p className="mx-auto flex max-w-[1440px] items-start gap-2 text-[11px] leading-4 sm:items-center sm:text-xs">
          <Info className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
          <span><strong>Learning workspace.</strong> {hasFullAccess ? 'Your subscription is active.' : hasTrialAccess ? `Your free trial includes chapters 1 and 2, plus calculators. ${trialDaysRemaining} day${trialDaysRemaining === 1 ? '' : 's'} remaining.` : 'Your free trial has ended. Subscribe to continue with the full courses and calculators.'} Study progress is saved to your account. Payments are reviewed by the academy admin before subscription access begins.</span>
        </p>
      </div>
      {progressSaveError && (
        <div role="alert" className="border-b border-rose-300 bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p><strong>Progress was not saved.</strong> {progressSaveError} {pendingProgressCount > 0 && `${pendingProgressCount} update${pendingProgressCount === 1 ? '' : 's'} still need saving.`}</p>
            {pendingProgressCount > 0 && (
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={retryProgressSave} disabled={progressSaving} className="rounded-lg bg-rose-800 px-3 py-1.5 font-bold text-white hover:bg-rose-900 disabled:cursor-wait disabled:opacity-60">
                  {progressSaving ? 'Saving…' : 'Retry save'}
                </button>
                <button type="button" onClick={discardPendingProgress} disabled={progressSaving} className="rounded-lg border border-rose-400 px-3 py-1.5 font-semibold hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-rose-900/40">
                  Discard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {progressSaveNotice && (
        <div role="status" className="border-b border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs leading-5 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
          <p className="mx-auto max-w-[1440px]"><strong>Saved.</strong> {progressSaveNotice}</p>
        </div>
      )}

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        {isTool && (
          <div role="note" className="mb-5 flex gap-2.5 rounded-xl border border-[#e8d6be] bg-[#fff8ee] px-4 py-3 text-xs leading-5 text-[#705634] dark:border-[#574633] dark:bg-[#30291f] dark:text-[#ddc59f]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p><strong>Educational estimates only.</strong> Verify current regulations and exchange rates with relevant authorities, banks and qualified professionals before making decisions.</p>
          </div>
        )}
        {isSubscription && (
          <div role="note" className="mb-5 rounded-xl border border-[#e8d6be] bg-[#fff8ee] px-4 py-3 text-xs leading-5 text-[#705634] dark:border-[#574633] dark:bg-[#30291f] dark:text-[#ddc59f]">
            Pay only to the academy account shown below. Your transaction reference must be verified by the admin before access is approved.
          </div>
        )}
        {(activeNavTab as string) === 'overview' && <LearningDashboard />}
        {activeNavTab === 'curriculum' && <CourseViewer />}
        {activeNavTab === 'resources' && <ResourceLibrary />}
        {activeNavTab === 'progress' && <RecordsTracker />}
        {activeNavTab === 'certificate' && <CertificationView />}
        {activeNavTab === 'landed_cost' && <CostBreakdownSheet />}
        {activeNavTab === 'lc_calculator' && <LCCalculator />}
        {activeNavTab === 'tax_calculator' && <TaxAssessmentCalculator />}
        {activeNavTab === 'quiz_center' && <QuizCenter />}
        {activeNavTab === 'subscription' && <PaymentWorkspace />}
        {showAdmin && <PaymentWorkspace adminMode />}
        {activeNavTab === 'admin' && !isAdmin && <LearningDashboard />}
      </main>

      <SubscriptionModal
        isOpen={showPaywallModal}
        trialExpired={!isAdmin && !hasFullAccess && !hasTrialAccess}
        onClose={() => setShowPaywallModal(false)}
      />

      <footer className="no-print mt-8 border-t academy-line bg-[var(--paper)] py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-6 xl:px-8">
          <div>
            <p className="font-serif-title text-sm font-extrabold">Ethio Export-Import and Logistics Learning Academy</p>
            <p className="mt-1 academy-muted">A practical learning workspace for trade and logistics professionals.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 academy-muted">
            <span>Business pricing: 3,900 ETB / 30 days</span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <a
                href="https://t.me/eximmanlearn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#1d5f52] px-3.5 text-[11px] font-bold text-white transition hover:bg-[#153f39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d5f52]"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                {t('Join our channel')}
              </a>
              <span className="max-w-[300px] text-[10px] leading-4">{t('Business news, announcements, help and support from our team, and more.')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [profile, setProfile] = useState<import('./types').UserProfile | null>(null);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    let active = true;
    setProfile(null);
    setProfileError('');
    if (!isLoaded || !isSignedIn) return () => { active = false; };
    fetch('/api/me', { credentials: 'same-origin' })
      .then(async response => {
        if (!response.ok) throw new Error('We could not load your account. Please sign in again.');
        return response.json();
      })
      .then(data => { if (active) setProfile(data); })
      .catch(error => { if (active) setProfileError(error.message); });
    return () => { active = false; };
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded && isSignedIn) return <div className="flex min-h-screen items-center justify-center text-sm academy-muted">Loading your learning workspace…</div>;
  if (!isSignedIn) {
    return <PublicLanding />;
  }
  if (!profile) return <div className="flex min-h-screen items-center justify-center px-6 text-sm academy-muted">{profileError || 'Loading your account…'}</div>;
  return (
    <AppProvider profile={profile}>
      <MainContent />
    </AppProvider>
  );
}
