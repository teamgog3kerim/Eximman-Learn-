import React from 'react';
import { CreditCard, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trialExpired?: boolean;
}

export const SubscriptionModal: React.FC<Props> = ({ isOpen, onClose, trialExpired = false }) => {
  const { setActiveNavTab } = useApp();
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="payment-title" className="w-full max-w-md space-y-4 rounded-2xl border academy-line academy-paper p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] academy-accent">{t(trialExpired ? 'Free trial complete' : '30-day learner subscription')}</p>
            <h2 id="payment-title" className="mt-1 font-serif-title text-2xl font-bold">{t(trialExpired ? 'Continue your learning' : 'Unlock the full curriculum')}</h2>
          </div>
          {!trialExpired && <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"><X className="h-5 w-5" /></button>}
        </div>
        <div role="note" className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <CreditCard className="mt-1 h-4 w-4 shrink-0" />
          <p>{t(trialExpired ? 'Your 3-day trial has ended. To continue the remaining courses and use the trade calculators, subscribe for 3,900 ETB. Pay with Telebirr or CBE and submit your transaction reference for admin review.' : 'Pay 3,900 ETB with Telebirr or CBE, then submit your transaction reference. The academy admin will verify it and approve 30 days of access.')}</p>
        </div>
        <button type="button" onClick={() => { onClose(); setActiveNavTab('subscription'); }} className="min-h-11 w-full rounded-xl bg-[#174f49] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#12413c]">{t('Proceed to subscription')}</button>
      </section>
    </div>
  );
};
