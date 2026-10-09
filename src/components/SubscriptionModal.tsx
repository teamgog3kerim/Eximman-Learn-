import React from 'react';
import { Info, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="payment-demo-title" className="w-full max-w-md space-y-4 rounded-2xl border academy-line academy-paper p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] academy-accent">Demo mode</p>
            <h2 id="payment-demo-title" className="mt-1 font-serif-title text-2xl font-bold">Payments aren’t enabled</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"><X className="h-5 w-5" /></button>
        </div>
        <div role="note" className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <Info className="mt-1 h-4 w-4 shrink-0" />
          <p>This project has no secure registration or payment integration. No payments, transaction IDs or receipts can be submitted or verified here.</p>
        </div>
        <button type="button" onClick={onClose} className="min-h-11 w-full rounded-xl bg-[#174f49] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#12413c]">Back to learning</button>
      </section>
    </div>
  );
};
