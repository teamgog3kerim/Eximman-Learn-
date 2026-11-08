import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const SubscriptionView: React.FC = () => {
  const { setActiveNavTab } = useApp();
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-3xl space-y-6 py-4">
      <div className="academy-card p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[.14em] academy-accent">{t('Pricing information · demo')}</p>
        <h1 className="mt-2 font-serif-title text-3xl font-bold">{t('Plans listed in the imported project')}</h1>
        <p className="mt-3 text-sm leading-6 academy-muted">{t('The prices below are unverified reference information. This browser demo does not take payments, register paying students, verify transfers, or provide secure accounts.')}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-4 academy-line">
            <p className="text-sm font-bold">{t('Free trial · listed')}</p>
            <p className="mt-2 font-serif-title text-2xl font-bold">0 ETB</p>
            <p className="mt-2 text-xs academy-muted">{t('Trial access currently follows the chapter access rules shown in the curriculum.')}</p>
          </div>
          <div className="rounded-xl border p-4 academy-line">
            <p className="text-sm font-bold">{t('30-day plan · listed')}</p>
            <p className="mt-2 font-serif-title text-2xl font-bold">3,900 ETB</p>
            <p className="mt-2 text-xs academy-muted">{t('Imported project pricing; confirm directly with the academy before relying on it.')}</p>
          </div>
        </div>
        <div role="note" className="mt-5 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{t('Payment collection is disabled. Do not send money or upload payment receipts in this demo.')}</p>
        </div>
        <button type="button" onClick={() => setActiveNavTab('overview')} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#174f49] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#12413c]"><ArrowLeft className="h-4 w-4" />{t('Return to learning')}</button>
      </div>
    </section>
  );
};
