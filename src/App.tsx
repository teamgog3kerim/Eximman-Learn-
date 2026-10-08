/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
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
import { Shield, Sparkles, BookOpen, Clock, HeartHandshake } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    currentUser,
    hasFullAccess,
    showPaywallModal,
    setShowPaywallModal
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeNavTab === 'curriculum' && <CourseViewer />}
        {activeNavTab === 'resources' && <ResourceLibrary />}
        {activeNavTab === 'progress' && <RecordsTracker />}
        {activeNavTab === 'certificate' && <CertificationView />}
        {activeNavTab === 'landed_cost' && <CostBreakdownSheet />}
        {activeNavTab === 'lc_calculator' && <LCCalculator />}
        {activeNavTab === 'tax_calculator' && <TaxAssessmentCalculator />}
        {activeNavTab === 'quiz_center' && <QuizCenter />}
        {activeNavTab === 'subscription' && <SubscriptionView />}
        {activeNavTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modal for payment / subscription */}
      <SubscriptionModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8 text-xs text-neutral-500 dark:text-neutral-400 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Ethiopian Import Export & Logistics Academy
            </span>
            <span>·</span>
            <span>Program Lead: Abdulkerim (0967684490)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Fee: 3,900 ETB / 30 Days</span>
            <span>·</span>
            <span>Telebirr to 0967684490 (Abdulkerim)</span>
            <span>·</span>
            <span>Djibouti-Addis Logistics Corridor Framework</span>
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
