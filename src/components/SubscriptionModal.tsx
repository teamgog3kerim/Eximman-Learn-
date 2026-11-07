import React from 'react';
import { CreditCard, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { setActiveNavTab } = useApp();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="payment-title" className="w-full max-w-md space-y-4 rounded-2xl border academy-line academy-paper p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] academy-accent">30-day learner subscription</p>
            <h2 id="payment-title" className="mt-1 font-serif-title text-2xl font-bold">Unlock the full curriculum</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"><X className="h-5 w-5" /></button>
        </div>
        <div role="note" className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <CreditCard className="mt-1 h-4 w-4 shrink-0" />
          <p>Pay 3,900 ETB with Telebirr and submit your receipt. The academy admin will review the payment and enable access for 30 days after approval.</p>
        </div>
        <button type="button" onClick={() => { onClose(); setActiveNavTab('subscription'); }} className="min-h-11 w-full rounded-xl bg-[#174f49] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#12413c]">Continue to payment instructions</button>
      </section>
    </div>
  );
};
