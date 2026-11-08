import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { COURSE_MODULES } from '../data/courseData';
import amharicCourseTranslations from '../data/courseTranslations.am.json';

export type AppLanguage = 'en' | 'am';

const LANGUAGE_STORAGE_KEY = 'ethio_academy_language_v1';
const AMHARIC_UI: Record<string, string> = {
  'Learning': 'ትምህርት',
  'Trade tools': 'የንግድ መሣሪያዎች',
  'Reference': 'ማጣቀሻ',
  'Overview': 'አጠቃላይ እይታ',
  'Curriculum': 'ሥርዓተ ትምህርት',
  'Quizzes': 'ፈተናዎች',
  'Progress': 'እድገት',
  'Certificate': 'ሰርተፊኬት',
  'Landed cost': 'የዕቃ የመጨረሻ ወጪ',
  'L/C calculator': 'የL/C ማስያ',
  'Customs tax': 'የጉምሩክ ታክስ',
  'Resources': 'መርጃዎች',
  'Admin': 'አስተዳደር',
  'Administration': 'አስተዳደር',
  'Admin dashboard': 'የአስተዳዳሪ ገጽ',
  'Account': 'መለያ',
  'Pricing & subscription · demo': 'ዋጋ እና ምዝገባ',
  'Current': 'አሁን',
  'Main navigation': 'ዋና ምናሌ',
  'Mobile navigation': 'የሞባይል ምናሌ',
  'Close navigation': 'ምናሌውን ዝጋ',
  'Open navigation': 'ምናሌውን ክፈት',
  'Switch to dark theme': 'ወደ ጨለማ ገጽታ ቀይር',
  'Switch to light theme': 'ወደ ብርሃን ገጽታ ቀይር',
  'Back to overview': 'ወደ አጠቃላይ እይታ ተመለስ',
  'Start with an account': 'በመለያ ይጀምሩ',
  'Build your foundation': 'መሠረትዎን ይገንቡ',
  'Explore the curriculum': 'ሥርዓተ ትምህርቱን ይመልከቱ',
  'What you’ll learn': 'ምን እንደሚማሩ',
  'How it works': 'አሠራሩ',
  'Membership': 'አባልነት',
  'Sign in': 'ይግቡ',
  'Create account': 'መለያ ይፍጠሩ',
  'Create an account': 'መለያ ይፍጠሩ',
  'Already have an account?': 'አስቀድመው መለያ አለዎት?',
  'New to the academy?': 'ለአካዳሚው አዲስ ነዎት?',
  'Sign in instead': 'በምትኩ ይግቡ',
  'Create your learner account': 'የተማሪ መለያዎን ይፍጠሩ',
  'Inside the curriculum': 'በሥርዓተ ትምህርቱ ውስጥ',
  'Course Syllabus': 'የኮርስ ሲላበስ',
  'Chapter': 'ምዕራፍ',
  'Lessons': 'ትምህርቶች',
  'Lesson': 'ትምህርት',
  'Search': 'ፈልግ',
  'Search by keyword...': 'በቁልፍ ቃል ፈልግ...',
  'Language': 'ቋንቋ',
  'English': 'English',
  'Amharic': 'አማርኛ',
  'English selected': 'English selected',
  'Amharic selected': 'አማርኛ ተመርጧል',
  'Ethiopia-specific trade practice': 'ለኢትዮጵያ የተዘጋጀ የንግድ ልምምድ',
  'Trade is learned': 'ንግድ የሚማሩት',
  'in details.': 'በዝርዝር ነው።',
  'Practical learning for the people moving goods across borders. Understand the paperwork, banking, customs and logistics behind importing and exporting in Ethiopia.': 'በድንበር ተሻጋሪ የዕቃ ንቅናቄ ላይ ለሚሰሩ ሰዎች ተግባራዊ ትምህርት። በኢትዮጵያ የማስገባትና የመላክ ሂደት ውስጥ ያሉ ሰነዶችን፣ ባንክን፣ ጉምሩክን እና ሎጂስቲክስን ይረዱ።',
  'Ethiopian trade context': 'የኢትዮጵያ የንግድ አውድ',
  'Worked process examples': 'በተግባር የታዩ የሂደት ምሳሌዎች',
  'Your learning desk': 'የትምህርት ማዕከልዎ',
  'Trade knowledge, ': 'የንግድ እውቀት፣ ',
  'put to work.': 'በተግባር ይዋሉ።',
  'Continue learning': 'ትምህርቱን ይቀጥሉ',
  'Course progress': 'የኮርስ እድገት',
  ' of ': ' ከ ',
  ' lessons': ' ትምህርቶች',
  'Lessons completed': 'የተጠናቀቁ ትምህርቶች',
  'Quiz attempts saved': 'የተቀመጡ የፈተና ሙከራዎች',
  'Learning pathway': 'የትምህርት መንገድ',
  ' modules · ': ' ሞጁሎች · ',
  'Structured curriculum': 'የተደራጀ ሥርዓተ ትምህርት',
  'Pick up where practice begins': 'ልምምዱ ከሚጀምርበት ይቀጥሉ',
  'All lessons': 'ሁሉም ትምህርቶች',
  'Up next': 'ቀጣይ',
  'Review module': 'ሞጁሉን ይገምግሙ',
  'Browse module': 'ሞጁሉን ይመልከቱ',
  'Knowledge Assessment Center': 'የእውቀት ምዘና ማዕከል',
  'Interactive Practice': 'ተግባራዊ ልምምድ',
  'All Modules': 'ሁሉም ሞጁሎች',
  'Paid Chapter': 'በክፍያ የሚከፈት ምዕራፍ',
  'Go to Study Notes': 'ወደ የጥናት ማስታወሻዎች ይሂዱ',
  'Retake this quiz': 'ይህን ፈተና እንደገና ይውሰዱ',
  'Records Tracker': 'የመዝገብ መከታተያ',
  'Certification': 'ሰርተፊኬት',
  'Export Checklist Tool': 'የኤክስፖርት ማረጋገጫ ዝርዝር',
  'Full Academy Access': 'የአካዳሚው ሙሉ መዳረሻ',
  'Study Guide & Rules': 'የጥናት መመሪያ እና ደንቦች',
  'Visual Process Diagram': 'የሂደት ምስላዊ ንድፍ',
  'Real Ethiopian Case Study': 'የኢትዮጵያ ተግባራዊ ጉዳይ ጥናት',
  'Document Checklist Generator': 'የሰነድ ማረጋገጫ ዝርዝር መፍጠሪያ',
  'Lesson navigation': 'የትምህርት ምናሌ',
  'Chapters 3 through 16': 'ከ3ኛ እስከ 16ኛ ምዕራፍ',
  'Launch Checklist Generator': 'የማረጋገጫ ዝርዝር መፍጠሪያን ክፈት',
  'Proceed to Next Chapter': 'ወደ ቀጣዩ ምዕራፍ ይቀጥሉ',
  'Select language': 'ቋንቋ ይምረጡ',
  'Ethiopian Import & Export Practice Questionnaires': 'የኢትዮጵያ ኢምፖርትና ኤክስፖርት ልምምድ ፈተናዎች',
  'Test your mastery of NBE directives, LC settlement calculations, customs cascade tax tiers, and Djibouti corridor logistics with real exam-grade scenarios.': 'የNBE መመሪያዎችን፣ የL/C ማቋቋሚያ ስሌቶችን፣ የጉምሩክ ተከታታይ የታክስ ደረጃዎችን እና የጅቡቲ ኮሪደር ሎጂስቲክስን በእውነተኛ የፈተና ምሳሌዎች ይፈትሹ።',
  'Learning snapshot': 'የትምህርት አጠቃላይ ሁኔታ',
  'Module': 'ሞጁል',
  'A working route, not a theory': 'ተግባራዊ መንገድ፣ ቲዎሪ ብቻ አይደለም',
  'From inland decisions to port-side movement.': 'ከውስጥ አገር ውሳኔዎች እስከ ወደብ እንቅስቃሴ።',
  'Trade route / 01': 'የንግድ መስመር / 01',
  'origin': 'መነሻ',
  'dry port': 'ደረቅ ወደብ',
  'gateway': 'መግቢያ በር',
  'Prepare': 'አዘጋጅ',
  'Clear': 'አጽዳ',
  'Move': 'አንቀሳቅስ',
  'Ethiopian trade context': 'የኢትዮጵያ የንግድ አውድ',
  'Worked process examples': 'በተግባር የታዩ የሂደት ምሳሌዎች',
  'Make trade knowledge part of your toolkit.': 'የንግድ እውቀትን የሥራ መሣሪያዎ ያድርጉ።',
  'Pick up where your work left off.': 'ሥራዎን ካቆሙበት ይቀጥሉ።',
  'Set up an account, then explore practical learning on Ethiopian trade rules, import banking, logistics, customs and export procedures.': 'መለያ ይፍጠሩ፤ ከዚያም ስለ ኢትዮጵያ የንግድ ደንቦች፣ የኢምፖርት ባንክ አገልግሎት፣ ሎጂስቲክስ፣ ጉምሩክ እና የኤክስፖርት ሂደቶች ተግባራዊ ትምህርት ይመልከቱ።',
  'Sign in to return to your learning workspace and continue with your saved progress.': 'ወደ ትምህርት ቦታዎ ለመመለስ ይግቡ፤ የተቀመጠውን እድገትዎንም ይቀጥሉ።',
  'Inside the curriculum': 'በሥርዓተ ትምህርቱ ውስጥ',
  'Single Window & trade rules': 'ነጠላ መስኮት እና የንግድ ደንቦች',
  'L/C and import banking': 'L/C እና የኢምፖርት ባንክ አገልግሎት',
  'Customs & landed cost': 'ጉምሩክ እና የዕቃ የመጨረሻ ወጪ',
  'Export & Forex retention': 'ኤክስፖርት እና የውጭ ምንዛሬ ማቆያ',
  'Membership: 3,900 ETB / 30 days. Account creation does not change the subscription or payment process.': 'አባልነት፦ 3,900 ETB / 30 ቀናት። መለያ መፍጠር የምዝገባ ወይም የክፍያ ሂደቱን አይቀይርም።',
  'Welcome back': 'እንኳን ደህና መጡ',
  'Sign in to the academy': 'ወደ አካዳሚው ይግቡ',
  'Use the same account you used to join.': 'ሲመዘገቡ የተጠቀሙትን መለያ ይጠቀሙ።',
  'Use an email or an available sign-in provider to continue.': 'ለመቀጠል ኢሜይል ወይም ያለውን የመግቢያ አማራጭ ይጠቀሙ።',
  'Create account': 'መለያ ይፍጠሩ',
  'Start your learning profile': 'የትምህርት መገለጫዎን ይጀምሩ',
};

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'am' ? 'am' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = useCallback((next: AppLanguage) => {
    setLanguageState(next);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Keep the in-memory selection available when browser storage is disabled.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'am' ? 'am' : 'en';
  }, [language]);

  const t = useCallback((text: string) => language === 'am' ? AMHARIC_UI[text] || text : text, [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

function localizeTree(value: unknown, path: string): unknown {
  if (typeof value === 'string') {
    const field = path.slice(path.lastIndexOf('.') + 1);
    if (['id', 'moduleId', 'imageUrl', 'diagramType', 'type'].includes(field)) return value;
    return (amharicCourseTranslations as Record<string, string>)[path] || value;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => localizeTree(item, `${path}[${index}]`));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [
      key,
      localizeTree(child, `${path}.${key}`),
    ]));
  }
  return value;
}

export function getLocalizedCourseModules(language: AppLanguage) {
  return language === 'am'
    ? COURSE_MODULES.map(module => localizeTree(module, module.id) as typeof module)
    : COURSE_MODULES;
}

export function useLocalizedCourseModules() {
  const { language } = useLanguage();
  return useMemo(() => getLocalizedCourseModules(language), [language]);
}
