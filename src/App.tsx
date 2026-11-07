/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { Link } from 'wouter';
import { AppProvider, useApp } from './context/AppContext';
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
import { AlertTriangle, Info } from 'lucide-react';

const toolTabs = ['landed_cost', 'lc_calculator', 'tax_calculator'];

const MainContent: React.FC = () => {
  const {
    activeNavTab, isAdmin, showPaywallModal, setShowPaywallModal
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
          <span><strong>Learning workspace.</strong> Study progress is saved on this device. Telebirr payments are reviewed by the academy admin before subscription access begins.</span>
        </p>
      </div>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        {isTool && (
          <div role="note" className="mb-5 flex gap-2.5 rounded-xl border border-[#e8d6be] bg-[#fff8ee] px-4 py-3 text-xs leading-5 text-[#705634] dark:border-[#574633] dark:bg-[#30291f] dark:text-[#ddc59f]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p><strong>Educational estimates only.</strong> Verify current regulations and exchange rates with relevant authorities, banks and qualified professionals before making decisions.</p>
          </div>
        )}
        {isSubscription && (
          <div role="note" className="mb-5 rounded-xl border border-[#e8d6be] bg-[#fff8ee] px-4 py-3 text-xs leading-5 text-[#705634] dark:border-[#574633] dark:bg-[#30291f] dark:text-[#ddc59f]">
            Send payment only to the academy account shown below. Uploading a receipt does not grant access until the admin approves it.
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

      <SubscriptionModal isOpen={showPaywallModal} onClose={() => setShowPaywallModal(false)} />

      <footer className="no-print mt-8 border-t academy-line bg-[var(--paper)] py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-6 xl:px-8">
          <div>
            <p className="font-serif-title text-sm font-extrabold">Ethiopian Import Export & Logistics Academy</p>
            <p className="mt-1 academy-muted">A practical learning workspace for trade and logistics professionals.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 academy-muted">
            <span>Business pricing: 3,900 ETB / 30 days</span>
            <span className="hidden sm:inline">·</span>
            <span>Local demo only · no payments verified</span>
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
    return (
      <main className="academy-shell flex min-h-screen items-center justify-center px-5 py-12">
        <section className="w-full max-w-5xl overflow-hidden rounded-[28px] border academy-line academy-card shadow-xl">
          <div className="grid md:grid-cols-[1.2fr_.8fr]">
            <div className="bg-[#174f49] p-8 text-white sm:p-12">
              <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 font-bold text-[#efcf9e]">ET</span><span className="text-xs font-bold uppercase tracking-[.18em] text-white/75">Ethio-ImpEx Academy</span></div>
              <p className="mt-14 text-xs font-bold uppercase tracking-[.18em] text-[#efcf9e]">Trade learning workspace</p>
              <h1 className="mt-3 max-w-lg font-serif-title text-4xl font-extrabold tracking-tight sm:text-5xl">Learn trade. Move goods with confidence.</h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-white/80">Build practical knowledge of importing, exporting and logistics in Ethiopia—supported by structured lessons and trade tools.</p>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <h2 className="font-serif-title text-2xl font-bold">Continue your learning</h2>
              <p className="mt-2 text-sm leading-6 academy-muted">Create an account or sign in to access your curriculum, progress and subscription status.</p>
              {profileError && <p role="alert" className="mt-4 text-sm text-red-700">{profileError}</p>}
              <Link href="/sign-up" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#176b60] px-5 text-sm font-bold text-white transition hover:bg-[#14594f]">Create learner account</Link>
              <Link href="/sign-in" className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl border academy-line text-sm font-bold transition hover:bg-[#e6f1ed] dark:hover:bg-[#263a35]">Sign in with Google or email</Link>
              <p className="mt-6 text-center text-[11px] leading-5 academy-muted">Your account lets you resume your learning on another device.</p>
            </div>
          </div>
        </section>
      </main>
    );
  }
  if (!profile) return <div className="flex min-h-screen items-center justify-center px-6 text-sm academy-muted">{profileError || 'Loading your account…'}</div>;
  return (
    <AppProvider profile={profile}>
      <MainContent />
    </AppProvider>
  );
}
