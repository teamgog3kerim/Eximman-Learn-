import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type LanguageSelectorProps = { compact?: boolean };

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <label className={`inline-flex items-center gap-1.5 ${compact ? '' : 'rounded-xl border border-[#d9d8cc] bg-[#fbf8f0] px-2.5 py-2'}`}>
      <Languages className="h-4 w-4 shrink-0 text-[#1d5f52]" aria-hidden="true" />
      <span className="sr-only">{t('Language')}</span>
      <select
        aria-label={t('Language')}
        value={language}
        onChange={event => setLanguage(event.target.value as 'en' | 'am')}
        className={`bg-transparent text-xs font-semibold text-[#315148] outline-none ${compact ? 'max-w-[96px]' : 'max-w-[120px]'}`}
      >
        <option value="en">English</option>
        <option value="am">አማርኛ</option>
      </select>
    </label>
  );
}
