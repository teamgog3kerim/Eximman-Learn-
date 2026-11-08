import React from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TelegramChannelCTAProps {
  tone?: 'public' | 'workspace';
}

export const TelegramChannelCTA: React.FC<TelegramChannelCTAProps> = ({ tone = 'workspace' }) => {
  const { t } = useLanguage();
  const isPublic = tone === 'public';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className={`text-[10px] font-bold uppercase tracking-[.14em] ${isPublic ? 'text-[#a45e2f]' : 'academy-brand'}`}>
          {t('Community updates')}
        </p>
        <p className={`mt-1 max-w-[360px] text-[11px] leading-5 ${isPublic ? 'text-[#68746b]' : 'academy-muted'}`}>
          {t('Business news, announcements, help and support from our team, and more.')}
        </p>
      </div>
      <a
        href="https://t.me/eximmanlearn"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#1d5f52] px-4 text-[11px] font-bold text-white transition hover:bg-[#153f39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d5f52] sm:self-center"
      >
        <Send className="h-3.5 w-3.5" aria-hidden="true" />
        {t('Join our channel')}
      </a>
    </div>
  );
};
