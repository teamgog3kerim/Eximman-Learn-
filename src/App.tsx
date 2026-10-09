/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LearningDashboard } from './components/LearningDashboard';
import { CourseViewer } from './components/CourseViewer';
import { CostBreakdownSheet } from './components/CostBreakdownSheet';
import { LCCalculator } from './components/LCCalculator';
import { TaxAssessmentCalculator } from './components/TaxAssessmentCalculator';
import { QuizCenter } from './components/QuizCenter';
import { SubscriptionView } from './components/SubscriptionView';
import { AdminDashboard } from './components/AdminDashboard';
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
          <span><strong>Demo workspace.</strong> Sample accounts and learning progress stay in this browser; no payments are processed or verified. Do not send money based on this demo.</span>
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
            Pricing information is retained as business content. Subscription and payment actions are demo-only; no payment is verified or processed here.
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
        {activeNavTab === 'subscription' && <SubscriptionView />}
        {showAdmin && <AdminDashboard />}
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
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
