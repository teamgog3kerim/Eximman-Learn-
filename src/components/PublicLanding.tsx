import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, ChevronRight, FileCheck2, Landmark, Menu, Route, Ship, X } from 'lucide-react';
import { useLanguage, useLocalizedCourseModules } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

const topicIcons = [Landmark, FileCheck2, Ship, Route, BookOpen, BadgeCheck];

function Brand() {
  return (
    <Link href="/" aria-label="Ethio Export-Import and Logistics Academy home" className="flex items-center gap-3">
      <img src="/logo.svg" alt="" className="h-10 w-10 rounded-xl" />
      <span className="leading-tight">
        <span className="block text-[13px] font-bold tracking-tight text-[#193a34]">Ethio Export-Import and Logistics</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[.16em] text-[#6d766d]">LEARNING ACADEMY</span>
      </span>
    </Link>
  );
}

function CorridorIllustration() {
  return (
    <div className="relative min-h-[330px] overflow-hidden rounded-[26px] border border-white/15 bg-[#163e38] p-5 text-[#f4efdf] sm:min-h-[375px] sm:p-7" aria-label="Illustration of the Addis Ababa to Djibouti trade corridor">
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'linear-gradient(rgba(236,227,205,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(236,227,205,.16) 1px, transparent 1px)', backgroundSize: '35px 35px' }} />
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-[#d8a665]/20" />
      <div className="absolute -right-5 -top-9 h-48 w-48 rounded-full border border-[#d8a665]/20" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 480 370" fill="none" aria-hidden="true">
        <path d="M92 272 C138 244 165 229 197 206 C233 179 272 185 304 147 C330 117 352 102 393 74" stroke="#d5a368" strokeWidth="2" strokeDasharray="5 8" />
        <path d="M92 272 C138 244 165 229 197 206 C233 179 272 185 304 147 C330 117 352 102 393 74" stroke="#d5a368" strokeWidth="10" opacity=".08" />
        <circle cx="92" cy="272" r="7" fill="#e0a45f" /><circle cx="197" cy="206" r="5" fill="#e0a45f" /><circle cx="304" cy="147" r="5" fill="#e0a45f" /><circle cx="393" cy="74" r="7" fill="#e0a45f" />
        <path d="M373 60h39v22h-39z" stroke="#e0a45f" opacity=".8" /><path d="M380 54v6m9-6v6m9-6v6m-18 22 8 9 9-9" stroke="#e0a45f" opacity=".8" />
      </svg>
      <div className="relative z-10 flex h-full min-h-[285px] flex-col justify-between sm:min-h-[325px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono-numbers text-[10px] uppercase tracking-[.2em] text-[#e8bb83]">A working route, not a theory</p>
            <p className="mt-2 max-w-[220px] font-serif-title text-2xl leading-tight sm:text-3xl">From inland decisions to port-side movement.</p>
          </div>
          <span className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] uppercase tracking-[.14em] text-white/70">Trade route / 01</span>
        </div>
        <div className="relative z-10 flex justify-between gap-2 text-[10px] uppercase tracking-[.12em] text-white/80 sm:text-[11px]">
          <span className="max-w-[95px]"><i className="mb-2 block h-2 w-2 rounded-full bg-[#e0a45f]" />Addis Ababa<br /><b className="font-normal text-white/45">origin</b></span>
          <span className="max-w-[95px] self-center text-center">Mojo<br /><b className="font-normal text-white/45">dry port</b></span>
          <span className="max-w-[95px] self-end text-right"><i className="mb-2 ml-auto block h-2 w-2 rounded-full bg-[#e0a45f]" />Djibouti<br /><b className="font-normal text-white/45">gateway</b></span>
        </div>
      </div>
    </div>
  );
}

export function PublicLanding() {
  const { t } = useLanguage();
  const modules = useLocalizedCourseModules();
  const [activeModule, setActiveModule] = useState(0);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedModule = modules[activeModule] ?? modules[0];
  const chapters = selectedModule?.chapters ?? [];

  return (
    <main className="academy-shell min-h-[100dvh] overflow-hidden">
      <header className="relative z-20 mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          <a href="#curriculum" className="text-sm font-semibold text-[#465b53] transition hover:text-[#a45e2f]">{t('What you’ll learn')}</a>
          <a href="#approach" className="text-sm font-semibold text-[#465b53] transition hover:text-[#a45e2f]">{t('How it works')}</a>
          <a href="#membership" className="text-sm font-semibold text-[#465b53] transition hover:text-[#a45e2f]">{t('Membership')}</a>
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <LanguageSelector compact />
          <Link href="/sign-in" className="text-sm font-bold text-[#1f4a40] transition hover:text-[#a45e2f]">{t('Sign in')}</Link>
          <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-full bg-[#1d5f52] px-5 py-3 text-sm font-bold text-[#fbf8f0] transition hover:-translate-y-0.5 hover:bg-[#153f39]">
            {t('Create account')} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <button type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl border border-[#d4d7ca] p-2.5 text-[#1d4b41] md:hidden">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      {menuOpen && <nav aria-label="Mobile navigation" className="relative z-20 mx-5 mb-3 grid gap-1 rounded-2xl border border-[#d9d8cc] bg-[#fbf8f0] p-3 shadow-lg md:hidden">
        <a onClick={() => setMenuOpen(false)} href="#curriculum" className="rounded-xl px-3 py-3 text-sm font-semibold">{t('What you’ll learn')}</a>
        <a onClick={() => setMenuOpen(false)} href="#approach" className="rounded-xl px-3 py-3 text-sm font-semibold">{t('How it works')}</a>
        <a onClick={() => setMenuOpen(false)} href="#membership" className="rounded-xl px-3 py-3 text-sm font-semibold">{t('Membership')}</a>
        <div className="px-3 py-2"><LanguageSelector /></div>
        <div className="flex gap-2 border-t border-[#e2dfd4] pt-3">
          <Link href="/sign-in" className="flex-1 rounded-xl px-3 py-3 text-center text-sm font-bold text-[#1d5f52]">{t('Sign in')}</Link>
          <Link href="/sign-up" className="flex-1 rounded-xl bg-[#1d5f52] px-3 py-3 text-center text-sm font-bold text-white">{t('Create account')}</Link>
        </div>
      </nav>}

      <section className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-12 lg:px-12 lg:pb-24">
        <div className="landing-rise relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9c8aa] bg-[#f8f0e1] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.17em] text-[#815a33]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b76e36]" /> {t('Ethiopia-specific trade practice')}
          </div>
          <h1 className="max-w-[740px] font-serif-title text-[clamp(3.25rem,7.4vw,6.4rem)] leading-[.94] tracking-[-.055em] text-[#193a34]">
            {t('Trade is learned')}<br /><span className="italic text-[#a45e2f]">{t('in details.')}</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-base leading-7 text-[#5c6b63] sm:text-lg sm:leading-8">
            {t('Practical learning for the people moving goods across borders. Understand the paperwork, banking, customs and logistics behind importing and exporting in Ethiopia.')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/sign-up" className="group inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#1d5f52] px-7 text-sm font-bold text-[#fbf8f0] shadow-[0_8px_20px_rgba(29,95,82,.16)] transition hover:-translate-y-0.5 hover:bg-[#153f39]">
              {t('Start with an account')} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#curriculum" className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-[#315d51] transition hover:bg-[#e8e9dd]">
              {t('Explore the curriculum')} <ArrowDown className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#788078]">A paid learning membership · 3,900 ETB / 30 days</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#d9d8cc] pt-5 text-[11px] font-semibold text-[#66736a]">
            <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#a45e2f]" /> Ethiopian trade context</span>
            <span className="inline-flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-[#a45e2f]" /> Worked process examples</span>
          </div>
        </div>
        <div className="landing-rise landing-delay-2 relative">
          <CorridorIllustration />
          <div className="absolute -bottom-5 left-4 right-4 z-10 grid grid-cols-3 divide-x divide-[#d9d8cc] rounded-2xl border border-[#dedbcf] bg-[#fbf8f0] px-2 py-4 shadow-[0_16px_40px_rgba(34,51,43,.10)] sm:left-9 sm:right-9 sm:px-4 sm:py-5">
            <div className="px-2 text-center sm:px-4"><span className="font-mono-numbers text-xs font-semibold text-[#9b6236]">01</span><p className="mt-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#44584f] sm:text-[11px]">Prepare</p></div>
            <div className="px-2 text-center sm:px-4"><span className="font-mono-numbers text-xs font-semibold text-[#9b6236]">02</span><p className="mt-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#44584f] sm:text-[11px]">Clear</p></div>
            <div className="px-2 text-center sm:px-4"><span className="font-mono-numbers text-xs font-semibold text-[#9b6236]">03</span><p className="mt-1 text-[10px] font-bold uppercase tracking-[.08em] text-[#44584f] sm:text-[11px]">Move</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d9d8cc] bg-[#e9e6da]">
        <div className="mx-auto grid max-w-[1320px] gap-7 px-5 py-8 sm:px-8 md:grid-cols-[.65fr_1.35fr] md:items-center lg:px-12">
          <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.2em] text-[#966239]">The work behind the shipment</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <p className="text-sm leading-6 text-[#4f6158]"><b className="text-[#1d4038]">Rules & records</b><br />Trade licenses, ESW declarations, and compliance steps.</p>
            <p className="text-sm leading-6 text-[#4f6158]"><b className="text-[#1d4038]">Money & timing</b><br />L/C workflows, forex exposure, and payment stages.</p>
            <p className="text-sm leading-6 text-[#4f6158]"><b className="text-[#1d4038]">Goods & movement</b><br />Customs assessment, dry ports, and corridor logistics.</p>
          </div>
        </div>
      </section>

      <section id="curriculum" className="scroll-mt-10 mx-auto max-w-[1320px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
          <div className="landing-rise">
            <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.2em] text-[#a45e2f]">A curriculum shaped around the job</p>
            <h2 className="mt-5 max-w-lg font-serif-title text-4xl leading-[1.02] tracking-[-.04em] text-[#193a34] sm:text-5xl">Start with the decision. Follow it to delivery.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#647169]">Explore the real subject areas in the academy curriculum. Select a learning track to preview its chapters.</p>
            <Link href="/sign-up" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1d5f52] hover:text-[#a45e2f]">
              Create your learner account <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#d9d8cc] bg-[#fbf8f0] shadow-[0_10px_35px_rgba(32,50,42,.05)]">
            <div className="flex items-center justify-between border-b border-[#e1dfd5] px-5 py-4 sm:px-7">
              <span className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.17em] text-[#798078]">Learning tracks</span>
              <span className="text-[10px] text-[#798078]">{String(activeModule + 1).padStart(2, '0')} / {String(modules.length).padStart(2, '0')}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[.78fr_1.22fr]">
              <div className="border-b border-[#e1dfd5] p-3 lg:border-b-0 lg:border-r">
                {modules.map((module, index) => {
                  const Icon = topicIcons[index % topicIcons.length];
                  const active = index === activeModule;
                  return <button key={module.id} type="button" onClick={() => { setActiveModule(index); setExpandedChapter(0); }} aria-pressed={active} className={`group flex w-full items-start gap-2.5 rounded-xl px-2.5 py-3 text-left transition sm:items-center sm:gap-3 sm:px-3 sm:py-3.5 ${active ? 'bg-[#e8eee5] text-[#1b5549]' : 'text-[#68736c] hover:bg-[#f1eee5] hover:text-[#1d4038]'}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-[#1d5f52] text-white' : 'bg-[#eeece2] text-[#92734f]'}`}><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block break-words text-[12px] font-bold leading-4 sm:text-xs">{module.title}</span><span className="mt-1 block line-clamp-2 whitespace-normal break-words text-[10px] leading-4 text-current/70">{module.subtitle}</span></span>
                    <ChevronRight className={`mt-1 h-4 w-4 shrink-0 transition-transform sm:mt-0 ${active ? 'translate-x-0.5' : 'opacity-50'}`} />
                  </button>;
                })}
              </div>
              <div className="min-h-[320px] p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.16em] text-[#a45e2f]">Track {String(activeModule + 1).padStart(2, '0')}</p>
                    <h3 className="mt-2 font-serif-title text-2xl leading-tight text-[#1d4038] sm:text-3xl">{selectedModule?.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#6a756e]">{selectedModule?.description}</p>
                  </div>
                  <BookOpen className="mt-1 hidden h-5 w-5 shrink-0 text-[#a45e2f] sm:block" />
                </div>
                <div className="mt-6 divide-y divide-[#e7e3d8] border-y border-[#e7e3d8]">
                  {chapters.slice(0, 4).map((chapter, index) => (
                    <div key={chapter.id}>
                      <button type="button" aria-expanded={expandedChapter === index} onClick={() => setExpandedChapter(expandedChapter === index ? null : index)} className="flex w-full items-center justify-between gap-4 py-3.5 text-left">
                        <span className="flex items-start gap-3"><span className="mt-0.5 font-mono-numbers text-[10px] text-[#a45e2f]">{String(index + 1).padStart(2, '0')}</span><span className="text-xs font-bold leading-5 text-[#304b40]">{chapter.title}</span></span>
                        <ChevronRight className={`h-4 w-4 shrink-0 text-[#9a7c57] transition-transform ${expandedChapter === index ? 'rotate-90' : ''}`} />
                      </button>
                      {expandedChapter === index && <p className="pb-4 pl-8 pr-5 text-xs leading-5 text-[#6b766e]">{chapter.description}</p>}
                    </div>
                  ))}
                  {chapters.length > 4 && <p className="py-3 text-[10px] text-[#81857b]">Plus {chapters.length - 4} more chapters in this track.</p>}
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="font-mono-numbers text-[10px] text-[#85867c]">{chapters.length} chapters in this track</span>
                  <Link href="/sign-up" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5f52] hover:text-[#a45e2f]">Explore as a learner <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="scroll-mt-8 relative overflow-hidden bg-[#1a433b] text-[#f8f3e8]">
        <div className="landing-grain pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-[1320px] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-12">
          <div>
            <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.2em] text-[#e7b579]">Learn the sequence, then the judgment</p>
            <h2 className="mt-5 max-w-lg font-serif-title text-4xl leading-[1.03] tracking-[-.04em] sm:text-5xl">Trade knowledge is a chain of decisions.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">Follow the handoffs between a trader, bank, regulator, customs desk and logistics partner—so the documents and the movement make sense together.</p>
            <Link href="/sign-up" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#e7b579] px-5 py-3 text-sm font-bold text-[#203d35] transition hover:-translate-y-0.5 hover:bg-[#f0c792]">Build your foundation <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['01', 'Prepare the file', 'Licensing, HS codes, proforma details and the Ethiopian Single Window.'],
              ['02', 'Plan the banking', 'L/C opening, margin, charges and settlement timing.'],
              ['03', 'Assess the entry', 'Customs valuation, taxes and landed-cost components.'],
              ['04', 'Move or export', 'Djibouti corridor, dry ports, export procedures and Forex retention.'],
            ].map(([n, title, text]) => <div key={n} className="rounded-2xl border border-white/15 bg-white/[.045] p-5 transition hover:bg-white/[.08]">
              <span className="font-mono-numbers text-[10px] text-[#e7b579]">{n} / FIELD NOTE</span>
              <h3 className="mt-5 font-serif-title text-xl">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-white/65">{text}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_.82fr] lg:items-center lg:gap-20 lg:px-12">
        <div>
          <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.2em] text-[#a45e2f]">Built for the people doing the work</p>
          <h2 className="mt-5 max-w-xl font-serif-title text-4xl leading-[1.02] tracking-[-.04em] text-[#193a34] sm:text-5xl">Useful whether you’re planning your first shipment or handling the next one.</h2>
        </div>
        <div className="space-y-5 border-l-2 border-[#d2aa7b] pl-5 sm:pl-7">
          <p className="text-sm leading-7 text-[#596a61]"><b className="text-[#1f4138]">Entrepreneurs</b> get a clearer picture of the steps and institutions behind cross-border trade.</p>
          <p className="text-sm leading-7 text-[#596a61]"><b className="text-[#1f4138]">Importers and exporters</b> can revisit workflows, documentation and cost concepts at their own pace.</p>
          <p className="text-sm leading-7 text-[#596a61]"><b className="text-[#1f4138]">Working professionals</b> can strengthen practical understanding of banking, compliance and logistics handoffs.</p>
        </div>
      </section>

      <section id="membership" className="scroll-mt-8 mx-5 mb-16 overflow-hidden rounded-[28px] bg-[#e7e4d8] sm:mx-8 lg:mx-auto lg:mb-24 lg:max-w-[1230px]">
        <div className="grid gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14">
          <div>
            <p className="font-mono-numbers text-[10px] font-semibold uppercase tracking-[.2em] text-[#a45e2f]">Your next step</p>
            <h2 className="mt-4 font-serif-title text-3xl leading-tight tracking-[-.03em] text-[#193a34] sm:text-4xl">Make the process less opaque.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#68746b]">Create an account to enter the academy. Membership is 3,900 ETB for 30 days; payment and access follow the existing subscription process.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/sign-up" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d5f52] px-6 text-sm font-bold text-[#fbf8f0] transition hover:bg-[#153f39]">Create learner account <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/sign-in" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#c7c9bc] px-6 text-sm font-bold text-[#31574c] transition hover:bg-[#f5f1e6]">Returning learner? Sign in</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d9d8cc]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Brand />
          <p className="text-xs leading-5 text-[#788078]">Practical learning for Ethiopian import-export and logistics.</p>
          <div className="flex items-center gap-5 text-xs font-semibold text-[#52665c]"><Link href="/sign-in" className="hover:text-[#a45e2f]">Sign in</Link><Link href="/sign-up" className="hover:text-[#a45e2f]">Create account</Link></div>
        </div>
      </footer>
    </main>
  );
}
