import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ArrowUpRight, Award, BookOpen, Calculator, ChevronDown, ClipboardCheck } from 'lucide-react';
import { useLanguage, useLocalizedCourseModules } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

type PublicAuthShellProps = {
  mode: 'sign-up' | 'sign-in';
  children: React.ReactNode;
};

export function PublicAuthShell({ mode, children }: PublicAuthShellProps) {
  const { t } = useLanguage();
  const modules = useLocalizedCourseModules();
  const signUp = mode === 'sign-up';
  return (
    <main className="academy-shell min-h-[100dvh]">
      <header className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="h-10 w-10 rounded-xl" />
          <span><span className="block text-[13px] font-bold text-[#193a34]">Ethio Export-Import and Logistics</span><span className="block text-[10px] font-semibold uppercase tracking-[.16em] text-[#6d766d]">LEARNING ACADEMY</span></span>
        </Link>
        <div className="flex items-center gap-3"><LanguageSelector compact /><Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#52665c] transition hover:text-[#a45e2f]"><ArrowLeft className="h-4 w-4" /> {t('Back to overview')}</Link></div>
      </header>
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pb-14 pt-5 sm:px-8 sm:pb-20 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:gap-16 lg:px-12">
        <section className="relative overflow-hidden rounded-[26px] bg-[#1a433b] p-7 text-[#f8f3e8] sm:p-10 lg:min-h-[540px] lg:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#e2b57b]/20" />
          <div className="relative">
            <p className="font-mono-numbers text-[10px] uppercase tracking-[.2em] text-[#e7b579]">Ethio Export-Import and Logistics Learning Academy</p>
            <h1 className="mt-6 max-w-lg font-serif-title text-4xl leading-[1.04] tracking-[-.04em] sm:text-5xl">{t(signUp ? 'Make trade knowledge part of your toolkit.' : 'Pick up where your work left off.')}</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">{t(signUp ? 'Set up an account, then explore practical learning on Ethiopian trade rules, import banking, logistics, customs and export procedures.' : 'Sign in to return to your learning workspace and continue with your saved progress.')}</p>
            <div className="mt-9 border-t border-white/15 pt-6">
              <p className="font-mono-numbers text-[10px] uppercase tracking-[.16em] text-[#e7b579]">{t('Inside the curriculum')}</p>
              <ul className="mt-4 grid gap-3 text-xs text-white/85 sm:grid-cols-2">
                <li className="flex gap-2"><span className="text-[#e7b579]">01</span> {t('Single Window & trade rules')}</li>
                <li className="flex gap-2"><span className="text-[#e7b579]">02</span> {t('L/C and import banking')}</li>
                <li className="flex gap-2"><span className="text-[#e7b579]">03</span> {t('Customs & landed cost')}</li>
                <li className="flex gap-2"><span className="text-[#e7b579]">04</span> {t('Export & Forex retention')}</li>
              </ul>
            </div>
            <p className="mt-8 text-[11px] leading-5 text-white/55">Membership: 3,900 ETB / 30 days. Account creation does not change the subscription or payment process.</p>
          </div>
        </section>
        <section id="account" className="mx-auto w-full max-w-[480px] scroll-mt-6">
          <div className="mb-5">
            <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.18em] text-[#a45e2f]">{signUp ? 'Create account' : 'Welcome back'}</p>
            <h2 className="mt-2 font-serif-title text-3xl text-[#193a34]">{signUp ? 'Start your learning profile' : 'Sign in to the academy'}</h2>
            <p className="mt-2 text-sm leading-6 text-[#69766e]">{signUp ? 'Use an email or an available sign-in provider to continue.' : 'Use the same account you used to join.'}</p>
          </div>
          <div className="rounded-[24px] border border-[#d9d8cc] bg-[#fbf8f0] p-4 shadow-[0_12px_38px_rgba(36,52,43,.07)] sm:p-6">
            {children}
            <div className="mt-5 border-t border-[#e3e0d6] pt-4 text-center">
              <p className="text-xs text-[#758078]">{signUp ? 'Already have an account?' : 'New to the academy?'}</p>
              <Link href={signUp ? '/sign-in' : '/sign-up'} className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#1d5f52] hover:text-[#a45e2f]">
                {signUp ? 'Sign in instead' : 'Create an account'} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {signUp && (
        <>
          <section id="curriculum-preview" className="mx-auto max-w-[1240px] scroll-mt-8 px-5 pb-14 sm:px-8 lg:px-12">
            <div className="grid gap-6 border-t border-[#d9d8cc] pt-10 sm:grid-cols-[.8fr_1.2fr] sm:gap-12">
              <div>
                <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.18em] text-[#a45e2f]">Explore the learning</p>
                <h2 className="mt-3 max-w-md font-serif-title text-3xl leading-tight tracking-[-.035em] text-[#193a34] sm:text-4xl">Understand the full journey—not just one form.</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-[#68746b]">Open a track to see what the academy covers, from preparing a trade file to clearing and moving goods.</p>
                <a href="#account" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1d5f52] transition hover:text-[#a45e2f]">
                  Create your learner account <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <div className="space-y-2">
                {modules.map((module, index) => (
                  <details key={module.id} className="group rounded-2xl border border-[#d9d8cc] bg-[#fbf8f0] transition-colors open:border-[#a9b9a8] open:bg-white">
                    <summary className="flex cursor-pointer list-none items-center gap-4 rounded-2xl px-4 py-4 outline-none transition hover:bg-[#f4f2e9] focus-visible:ring-2 focus-visible:ring-[#b8753f] sm:px-5 [&::-webkit-details-marker]:hidden">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8eee5] font-mono-numbers text-xs font-semibold text-[#1d5f52]">{String(index + 1).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold leading-5 text-[#243e35]">{module.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#758078]">{module.subtitle}</span>
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-[#a45e2f] transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-[#e5e2d8] px-4 pb-5 pt-4 sm:px-5 sm:pl-[4.75rem]">
                      <p className="text-xs leading-5 text-[#667269]">{module.description}</p>
                      <p className="mt-4 font-mono-numbers text-[9px] font-semibold uppercase tracking-[.16em] text-[#a45e2f]">Inside this track</p>
                      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                        {module.chapters.slice(0, 4).map(chapter => (
                          <li key={chapter.id} className="flex items-start gap-2 text-xs leading-5 text-[#43564b]">
                            <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8b9a87]" />
                            {chapter.title}
                          </li>
                        ))}
                      </ul>
                      {module.chapters.length > 4 && <p className="mt-3 text-[11px] text-[#7a8179]">Plus {module.chapters.length - 4} additional chapters.</p>}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section id="learning-tools" className="border-y border-[#d9d8cc] bg-[#e9e6da]">
            <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 lg:px-12">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.18em] text-[#a45e2f]">Learn, practice, apply</p>
                  <h2 className="mt-2 font-serif-title text-2xl font-bold text-[#193a34] sm:text-3xl">Tools for building practical understanding.</h2>
                </div>
                <p className="max-w-md text-xs leading-5 text-[#68746b]">Membership is 3,900 ETB for 30 days. Payment is reviewed by the academy admin before access starts.</p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: BookOpen, title: 'Structured lessons', text: 'Study import, export and logistics topics step by step.' },
                  { icon: ClipboardCheck, title: 'Knowledge checks', text: 'Use quizzes to review key concepts as you learn.' },
                  { icon: Calculator, title: 'Trade calculators', text: 'Explore landed-cost, L/C and tax estimate tools.' },
                  { icon: Award, title: 'Progress & certificates', text: 'Track your study and access completion certificates.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl border border-[#d8d6ca] bg-[#fbf8f0] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(36,52,43,.07)]">
                    <Icon className="h-5 w-5 text-[#a45e2f]" />
                    <h3 className="mt-4 text-sm font-bold text-[#243e35]">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#68746b]">{text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[10px] leading-5 text-[#7a8179]">Learning materials and calculator outputs are educational. Confirm current regulations, rates and requirements with relevant authorities and qualified professionals.</p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
