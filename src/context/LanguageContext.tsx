import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { COURSE_MODULES } from '../data/courseData';
import amharicCourseTranslations from '../data/courseTranslations.am.json';
import { RESOURCE_LIBRARY } from '../data/resourceData';
import amharicResourceTranslations from '../data/resourceTranslations.am.json';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import amharicGlossaryTranslations from '../data/glossaryTranslations.am.json';

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
  'Trade is learned': 'ንግድን',
  'in details.': 'በዝርዝር ይማሩ።',
  'Practical learning for the people moving goods across borders. Understand the paperwork, banking, customs and logistics behind importing and exporting in Ethiopia.': 'በድንበር ተሻጋሪ የዕቃ ንቅናቄ ላይ ለሚሰሩ ሰዎች ተግባራዊ ትምህርት። በኢትዮጵያ የማስገባትና የመላክ ሂደት ውስጥ ያሉ ሰነዶችን፣ ባንክን፣ ጉምሩክን እና ሎጂስቲክስን ይረዱ።',
  'Ethiopian trade context': 'የኢትዮጵያ የንግድ አውድ',
  'Worked process examples': 'በተግባር የታዩ የሂደት ምሳሌዎች',
  'Your learning desk': 'የትምህርት ማዕከልዎ',
  'Trade knowledge, ': 'የንግድ እውቀትን ',
  'put to work.': 'በተግባር ይጠቀሙ።',
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
  'A working route, not a theory': 'ተግባራዊ መንገድ፣ ንድፈ ሐሳብ ብቻ አይደለም።',
  'From inland decisions to port-side movement.': 'ከውስጥ አገር የሚደረጉ ውሳኔዎች እስከ ወደብ የሚደርስ የዕቃ እንቅስቃሴ።',
  'The work behind the shipment': 'ከጭነቱ ጀርባ ያለው ሥራ',
  'Trade knowledge is a chain of decisions.': 'የንግድ እውቀት የውሳኔዎች ተከታታይ ነው።',
  'Practical learning for Ethiopian import-export and logistics.': 'ለኢትዮጵያ ኢምፖርት፣ ኤክስፖርት እና ሎጂስቲክስ ተግባራዊ ትምህርት።',
  'Learn by doing': 'በተግባር ይማሩ',
  'Practice with trade tools': 'የንግድ መሣሪያዎችን በተግባር ይለማመዱ',
  'Start with the decision. Follow it to delivery.': 'በውሳኔ ይጀምሩ፤ እስከ ማድረስ ድረስ ይከታተሉ።',
  'Useful whether you’re planning your first shipment or handling the next one.': 'የመጀመሪያ ጭነትዎን ቢያቅዱም ሆነ ቀጣዩን ቢያስተናግዱም፣ ይህ ትምህርት ይጠቅማል።',
  'Make the process less opaque.': 'ሂደቱን ግልጽ ያድርጉ።',
  'Understand the full journey—not just one form.': 'አንድ ቅጽን ብቻ ሳይሆን ሙሉውን ሂደት ይረዱ።',
  'Tools for building practical understanding.': 'ተግባራዊ ግንዛቤን የሚያጎለብቱ መሣሪያዎች።',
  'Practice, then verify': 'በተግባር ይለማመዱ፣ ከዚያ ያረጋግጡ።',
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
  'Document Repository & Regulatory Compliance Toolkit': 'የሰነድ ማህደር እና የቁጥጥር ተገዢነት መሣሪያዎች',
  'Ethiopian Trade & Logistics Resource Library': 'የኢትዮጵያ ንግድ እና ሎጂስቲክስ መርጃ ማዕከል',
  'Browse sample descriptions and excerpts saved with this demo. It does not include the official source documents, verified download files, or live regulatory updates. Check current rules with the issuing authorities.': 'በዚህ ማሳያ ውስጥ ያሉ የናሙና መግለጫዎችንና ቅንጭቦችን ይመልከቱ። ኦፊሴላዊ የመነሻ ሰነዶችን፣ የተረጋገጡ የማውረጃ ፋይሎችን ወይም የቀጥታ የደንብ ዝመናዎችን አያካትትም። የአሁኑን ደንቦች ከሰጪ ተቋማት ያረጋግጡ።',
  'Regulatory Documents & Directives': 'የቁጥጥር ሰነዶች እና መመሪያዎች',
  'Logistics & Trade Glossary': 'የሎጂስቲክስ እና ንግድ መዝገበ ቃላት',
  '30+ Terms': 'ከ30 በላይ ቃላት',
  'Key Provisions Covered:': 'የተካተቱ ዋና ዋና ድንጋጌዎች፦',
  'Read Preview': 'ቅድመ እይታ ያንብቡ',
  'Download sample summary': 'የናሙና ማጠቃለያ ያውርዱ',
  'Launch Checklist Generator': 'የማረጋገጫ ዝርዝር መፍጠሪያን ክፈት',
  'Learner account': 'የተማሪ መለያ',
  'Subscription & payment': 'ምዝገባ እና ክፍያ',
  '30 days of full course access · 3,900 ETB · verified manually by the academy admin.': 'ሙሉ የኮርስ መዳረሻ ለ30 ቀናት · 3,900 ETB · በአካዳሚው አስተዳዳሪ በእጅ ይረጋገጣል።',
  'Your subscription expires': 'የምዝገባዎ ጊዜ የሚያበቃው',
  '1. Choose how to pay': '1. የክፍያ ዘዴ ይምረጡ',
  'Send exactly 3,900 ETB, then submit the transaction reference. The admin will verify it and approve 30 days of access.': 'በትክክል 3,900 ETB ይላኩ፤ ከዚያ የግብይት ማጣቀሻውን ያስገቡ። አስተዳዳሪው ካረጋገጠው በኋላ የ30 ቀን መዳረሻ ይፈቅዳል።',
  'Payment method': 'የክፍያ ዘዴ',
  'Commercial Bank of Ethiopia (CBE)': 'የኢትዮጵያ ንግድ ባንክ (CBE)',
  'CBE account number': 'የCBE ሂሳብ ቁጥር',
  'Copy CBE account number': 'የCBE ሂሳብ ቁጥርን ቅዳ',
  'CBE account number copied': 'የCBE ሂሳብ ቁጥር ተቀድቷል',
  'Telebirr number': 'የTelebirr ቁጥር',
  'Copy Telebirr number': 'የTelebirr ቁጥርን ቅዳ',
  'Telebirr number copied': 'የTelebirr ቁጥር ተቀድቷል',
  'Copied': 'ተቀድቷል',
  'Copy': 'ቅዳ',
  'The admin has not set the Telebirr recipient yet. Choose CBE or check back later.': 'አስተዳዳሪው የTelebirr ተቀባይ መለያ አላስገባም። CBE ይምረጡ ወይም ቆይተው ይመለሱ።',
  '2. Submit the transaction reference': '2. የግብይት ማጣቀሻውን ያስገቡ',
  'Enter the reference from your Telebirr or CBE payment confirmation. No screenshot is needed.': 'በTelebirr ወይም CBE የክፍያ ማረጋገጫ ላይ ያለውን ማጣቀሻ ያስገቡ። የስክሪንሾት ፎቶ አያስፈልግም።',
  'Transaction reference': 'የግብይት ማጣቀሻ',
  'Your access starts only after the admin verifies the transaction and approves it.': 'አስተዳዳሪው ግብይቱን ካረጋገጠና ካጸደቀ በኋላ ብቻ መዳረሻዎ ይጀምራል።',
  'Submitting…': 'በማስገባት ላይ…',
  'Submit for admin review': 'ለአስተዳዳሪ ግምገማ ያስገቡ',
  'Your requests': 'ያቀረቧቸው ጥያቄዎች',
  'No requests submitted yet.': 'እስካሁን ምንም ጥያቄ አላቀረቡም።',
  'Pricing information · demo': 'የዋጋ መረጃ · ማሳያ',
  'Plans listed in the imported project': 'በፕሮጀክቱ ውስጥ የተዘረዘሩ ዕቅዶች',
  'Free trial · listed': 'ነፃ ሙከራ · የተዘረዘረ',
  '30-day plan · listed': 'የ30 ቀን ዕቅድ · የተዘረዘረ',
  'Return to learning': 'ወደ ትምህርቱ ተመለስ',
  'Continue your learning': 'ትምህርትዎን ይቀጥሉ',
  'Unlock the full curriculum': 'ሙሉውን ሥርዓተ ትምህርት ይክፈቱ',
  'Proceed to subscription': 'ወደ ምዝገባ ይቀጥሉ',
  'Learners & subscription requests': 'ተማሪዎች እና የምዝገባ ጥያቄዎች',
  'Only the verified main admin account can change payment recipients or approve access from transaction references.': 'የተረጋገጠው ዋና አስተዳዳሪ ብቻ የክፍያ ተቀባይን መቀየር ወይም በግብይት ማጣቀሻ መዳረሻን ማጽደቅ ይችላል።',
  'Telebirr account name': 'የTelebirr ሂሳብ ስም',
  'Telebirr number': 'የTelebirr ቁጥር',
  'Payment requests': 'የክፍያ ጥያቄዎች',
  'Learner accounts': 'የተማሪ መለያዎች',
  'Learner': 'ተማሪ',
  'Subscription': 'ምዝገባ',
  'Expires': 'ጊዜው ያበቃል',
  'Academy administration': 'የአካዳሚ አስተዳደር',
  'Learners & subscription requests': 'ተማሪዎች እና የምዝገባ ጥያቄዎች',
  'Subscription & payment': 'ምዝገባ እና ክፍያ',
  'Payment requests': 'የክፍያ ጥያቄዎች',
  'No payment requests yet.': 'እስካሁን የክፍያ ጥያቄ የለም።',
  'Choose how to pay': 'የክፍያ ዘዴ ይምረጡ',
  'Submit the transaction reference': 'የግብይት ማጣቀሻውን ያስገቡ',
  'Approve · 30 days': 'አጽድቅ · 30 ቀናት',
  'Reject': 'ውድቅ አድርግ',
  'Copied!': 'ተቀድቷል!',
  'Copy Text': 'ጽሑፉን ቅዳ',
  'Document Repository & Regulatory Compliance Toolkit': 'የሰነድ ማህደር እና የቁጥጥር ተገዢነት መሣሪያዎች',
  'Ethiopian Trade & Logistics Resource Library': 'የኢትዮጵያ ንግድ እና ሎጂስቲክስ መርጃ ማዕከል',
  'Showing': 'እየታየ ነው',
  'of': 'ከ',
  'documents': 'ሰነዶች',
  'Key Provisions Covered:': 'የተካተቱ ዋና ዋና ድንጋጌዎች፦',
  'Read Preview': 'ቅድመ እይታ ያንብቡ',
  'Download sample summary': 'የናሙና ማጠቃለያ ያውርዱ',
  'Glossary': 'መዝገበ ቃላት',
  'Reference Encyclopedia': 'የማጣቀሻ ኢንሳይክሎፒዲያ',
  'Print Glossary': 'መዝገበ ቃላቱን ያትሙ',
  'Key Definitions': 'ዋና ትርጓሜዎች',
  'Specialized Domains': 'ልዩ ዘርፎች',
  'Dual-language (English & Amharic terminology)': 'በሁለት ቋንቋ (እንግሊዝኛ እና አማርኛ) ቃላት',
  'Term & Acronym': 'ቃል እና ምህፃረ ቃል',
  'Amharic Equivalent': 'የአማርኛ አቻ',
  'Category': 'ምድብ',
  'Short Definition': 'አጭር ትርጓሜ',
  'Chapter': 'ምዕራፍ',
  'Current Plan': 'የአሁኑ ዕቅድ',
  'Administrator Control Dashboard': 'የአስተዳዳሪ መቆጣጠሪያ ገጽ',
  'Total Enrolled': 'የተመዘገቡ ተማሪዎች ጠቅላላ',
  'Active & Trial Students': 'ንቁ እና የሙከራ ጊዜ ተማሪዎች',
  'Subscription Approvals & Student Management': 'የምዝገባ ማጽደቂያ እና የተማሪ አስተዳደር',
  'Local demonstration only. Account approvals and access changes affect this browser only; no payment is verified and this is not a secure admin system.': 'ይህ የአካባቢያዊ ማሳያ ብቻ ነው። የመለያ ማጽደቅና የመዳረሻ ለውጦች በዚህ አሳሽ ላይ ብቻ ይተገበራሉ፤ ምንም ክፍያ አይረጋገጥም፣ ይህም ደህንነቱ የተጠበቀ የአስተዳደር ሥርዓት አይደለም።',
  'Pending Telebirr Approvals': 'በመጠባበቅ ላይ ያሉ የTelebirr ማጽደቂያዎች',
  'Requires your approval': 'የእርስዎን ማጽደቅ ይፈልጋል',
  'All requests processed': 'ሁሉም ጥያቄዎች ተስተናግደዋል',
  'Active Paid (30 Days)': 'ንቁ የክፍያ ምዝገባ (30 ቀናት)',
  'Total Telebirr Revenue': 'ጠቅላላ የTelebirr ገቢ',
  'Full Academy Access': 'የአካዳሚው ሙሉ መዳረሻ',
  'Account-synced learning progress': 'ከመለያው ጋር የተመሳሰለ የትምህርት እድገት',
  'No email saved': 'ኢሜይል አልተቀመጠም',
  'Print progress summary': 'የእድገት ማጠቃለያ ያትሙ',
  'View Executive Certificate': 'የአስፈፃሚ ሰርተፊኬቱን ይመልከቱ',
  'Certificate Status': 'የሰርተፊኬት ሁኔታ',
  'Chapters Finished': 'የተጠናቀቁ ምዕራፎች',
  'Quizzes Passed': 'ያለፉ ፈተናዎች',
  'Financial Tools': 'የፋይናንስ መሣሪያዎች',
  'Calculators': 'ማስያዎች',
  'Diploma Readiness': 'የዲፕሎማ ዝግጁነት',
  'Demo course-completion record': 'የኮርስ ማጠናቀቂያ ማሳያ መዝገብ',
  'Executive Certification in Ethiopian Foreign Trade': 'በኢትዮጵያ የውጭ ንግድ የአስፈፃሚ ሰርተፊኬት',
  'Continue your learning': 'ትምህርትዎን ይቀጥሉ',
  'Unlock the full curriculum': 'ሙሉውን ሥርዓተ ትምህርት ይክፈቱ',
  'Free trial complete': 'ነፃ ሙከራው ተጠናቋል',
  '30-day learner subscription': 'የ30 ቀን የተማሪ ምዝገባ',
  'Proceed to subscription': 'ወደ ምዝገባ ይቀጥሉ',
  'Close': 'ዝጋ',
  'Your 3-day trial has ended. To continue the remaining courses and use the trade calculators, subscribe for 3,900 ETB. Pay with Telebirr or CBE and submit your transaction reference for admin review.': 'የ3 ቀን ሙከራዎ ተጠናቋል። ቀሪዎቹን ኮርሶች ለመቀጠልና የንግድ ማስያዎችን ለመጠቀም በ3,900 ETB ይመዝገቡ። በTelebirr ወይም CBE ይክፈሉና ለአስተዳዳሪ ግምገማ የግብይት ማጣቀሻዎን ያስገቡ።',
  'Pay 3,900 ETB with Telebirr or CBE, then submit your transaction reference. The academy admin will verify it and approve 30 days of access.': '3,900 ETB በTelebirr ወይም CBE ይክፈሉ፤ ከዚያ የግብይት ማጣቀሻዎን ያስገቡ። የአካዳሚው አስተዳዳሪ ካረጋገጠው በኋላ የ30 ቀን መዳረሻ ያጸድቃል።',
  'Plans listed in the imported project': 'በፕሮጀክቱ ውስጥ የተዘረዘሩ ዕቅዶች',
  'The prices below are unverified reference information. This browser demo does not take payments, register paying students, verify transfers, or provide secure accounts.': 'ከታች ያሉት ዋጋዎች ያልተረጋገጡ የማጣቀሻ መረጃዎች ናቸው። ይህ የአሳሽ ማሳያ ክፍያ አይቀበልም፣ ከፋይ ተማሪዎችን አይመዘግብም፣ ዝውውሮችን አያረጋግጥም፣ ደህንነቱ የተጠበቀ መለያም አይሰጥም።',
  'Trial access currently follows the chapter access rules shown in the curriculum.': 'የሙከራ መዳረሻው በአሁኑ ጊዜ በሥርዓተ ትምህርቱ ውስጥ የታዩትን የምዕራፍ መዳረሻ ደንቦች ይከተላል።',
  'Imported project pricing; confirm directly with the academy before relying on it.': 'ከፕሮጀክቱ የተገኘ የዋጋ መረጃ ነው፤ ከመጠቀምዎ በፊት በቀጥታ ከአካዳሚው ያረጋግጡ።',
  'Payment collection is disabled. Do not send money or upload payment receipts in this demo.': 'የክፍያ መቀበያ ተዘግቷል። በዚህ ማሳያ ገንዘብ አይላኩ ወይም የክፍያ ደረሰኝ አይጫኑ።',
  'Subscription Approvals & Student Management': 'የምዝገባ ማጽደቂያ እና የተማሪ አስተዳደር',
  'Demo course-completion record': 'የኮርስ ማጠናቀቂያ ማሳያ መዝገብ',
  'Progress is saved to your account. This is not an accredited qualification or independently verifiable credential.': 'እድገትዎ በመለያዎ ውስጥ ይቀመጣል። ይህ እውቅና ያለው ብቃት ወይም በተናጠል ሊረጋገጥ የሚችል ማረጋገጫ አይደለም።',
  'Copy certificate ID': 'የሰርተፊኬት መለያ ቁጥርን ቅዳ',
  'No certificate issued': 'ሰርተፊኬት አልተሰጠም',
  'Print course record': 'የኮርስ መዝገቡን ያትሙ',
  'Course complete.': 'ኮርሱ ተጠናቋል።',
  'Generate course record': 'የኮርስ መዝገብ ይፍጠሩ',
  'Recipient Name on Diploma:': 'በዲፕሎማው ላይ የሚታይ የተቀባይ ስም፦',
  'Logistics & Foreign Trade Glossary': 'የሎጂስቲክስ እና የውጭ ንግድ መዝገበ ቃላት',
  'Verified Ethiopian Trade Terms': 'የተረጋገጡ የኢትዮጵያ ንግድ ቃላት',
  'Standardized dictionary of Ethiopian maritime transit, commercial banking, customs valuation, and export regulatory terminology. Clarifies local statutory nuances from NBE directives, Customs Proclamation No. 859/2014, and ESLSE shipping operations.': 'የኢትዮጵያ የባሕር ትራንዚት፣ የንግድ ባንክ፣ የጉምሩክ የዋጋ ግምት እና የወጪ ንግድ ደንብ ቃላት መደበኛ መዝገበ ቃል ነው። ከNBE መመሪያዎች፣ ከጉምሩክ አዋጅ ቁጥር 859/2014 እና ከESLSE የማጓጓዣ ሥራዎች ጋር የተያያዙ የአካባቢያዊ ሕጋዊ ዝርዝሮችን ያብራራል።',
  'All Categories': 'ሁሉም ምድቦች',
  'All Resources': 'ሁሉም መርጃዎች',
  'Regulations & Directives': 'ደንቦች እና መመሪያዎች',
  'Tariffs & Customs Taxes': 'ታሪፎች እና የጉምሩክ ታክሶች',
  'Excel Models & Templates': 'የExcel ሞዴሎች እና አብነቶች',
  'Checklists & Protocols': 'የማረጋገጫ ዝርዝሮች እና ፕሮቶኮሎች',
  'Corridor & Export SOPs': 'የኮሪደር እና የወጪ ንግድ መደበኛ ሥርዓቶች',
  'Enrolled': 'የተመዘገበ',
  'Program Administrator': 'የፕሮግራም አስተዳዳሪ',
  'Paid 30-Day Subscription (Active)': 'የተከፈለ የ30 ቀን ምዝገባ (ንቁ)',
  'Payment Pending Approval (3,900 ETB)': 'ክፍያው ማጽደቅን በመጠባበቅ ላይ (3,900 ETB)',
  'Free Trial (Module 1, Ch 1 & 2)': 'ነፃ ሙከራ (ሞጁል 1፣ ምዕራፍ 1 እና 2)',
  'Valid until': 'የሚያገለግለው እስከ',
  'Academy Course Progress': 'የአካዳሚ ኮርስ እድገት',
  'Chapters Completed': 'የተጠናቀቁ ምዕራፎች',
  'Chapters Finished': 'የተጠናቀቁ ምዕራፎች',
  'remaining to graduate': 'ለማጠናቀቅ የቀሩ',
  'tests': 'ፈተናዎች',
  'Avg mastery score:': 'አማካይ የብቃት ውጤት፦',
  'Landed Cost, LC Debits & Customs Tax': 'የደረሰኝ ወጪ፣ የLC ዴቢት እና የጉምሩክ ታክስ',
  'Qualified for Issue': 'ለመሰጠት ብቁ ነው',
  'lessons left': 'ትምህርቶች ቀርተዋል',
  'Local course-completion record · not a verified qualification': 'የአካባቢያዊ ኮርስ ማጠናቀቂያ መዝገብ · የተረጋገጠ ብቃት አይደለም',
  'Curriculum Module Breakdown': 'የሥርዓተ ትምህርት ሞጁሎች ዝርዝር',
  'Module': 'ሞጁል',
  'This print preview is for demonstration only. Complete all course lessons to enable an account-saved course record.': 'ይህ የማተሚያ ቅድመ እይታ ለማሳያ ብቻ ነው። በመለያ ውስጥ የሚቀመጥ የኮርስ መዝገብ ለማንቃት ሁሉንም የኮርስ ትምህርቶች ያጠናቅቁ።',
  'Go to Tracker': 'ወደ እድገት መከታተያ ይሂዱ',
  'Your progress record is saved to your account. It is not an accredited certificate and has no online verification.': 'የእድገት መዝገብዎ በመለያዎ ውስጥ ተቀምጧል። እውቅና ያለው ሰርተፊኬት አይደለም፤ በመስመር ላይም ሊረጋገጥ አይችልም።',
  'All lessons completed.': 'ሁሉም ትምህርቶች ተጠናቀዋል።',
  'You can generate an account-saved course-completion record. It is not an accredited credential.': 'በመለያ ውስጥ የሚቀመጥ የኮርስ ማጠናቀቂያ መዝገብ መፍጠር ይችላሉ። እውቅና ያለው ማረጋገጫ አይደለም።',
  'Save': 'አስቀምጥ',
  'Edit': 'አርትዕ',
  'DEMONSTRATION · BROWSER-STORED RECORD': 'ማሳያ · በአሳሽ ውስጥ የተቀመጠ መዝገብ',
  'Ethiopia Import, Export & Logistics Academy': 'የኢትዮጵያ አስመጪ፣ ላኪ እና ሎጂስቲክስ አካዳሚ',
  'Center for Continuing Trade Finance, Customs Valuation & Corridor Logistics Mastery': 'የቀጣይ የንግድ ፋይናንስ፣ የጉምሩክ ዋጋ ግምት እና የኮሪደር ሎጂስቲክስ ማስተርስ ማዕከል',
  'This is to certify that': 'ይህ የሚያረጋግጠው',
  'has satisfactorily completed the rigorous professional training curriculum, real-world case studies, and advanced financial modeling examinations to earn the credential of:': 'ጠንካራውን የሙያ ሥልጠና ሥርዓተ ትምህርት፣ ተግባራዊ የጉዳይ ጥናቶች እና የላቁ የፋይናንስ ሞዴሊንግ ፈተናዎችን በአጥጋቢ ሁኔታ አጠናቋል፤ በዚህም የሚከተለውን ማረጋገጫ ያገኛል፦',
  'Course Completion · Ethiopian Import, Export & Logistics': 'የኮርስ ማጠናቀቂያ · የኢትዮጵያ አስመጪ፣ ላኪ እና ሎጂስቲክስ',
  'Topics covered in the curriculum:': 'በሥርዓተ ትምህርቱ የተካተቱ ርዕሶች፦',
  'NBE Forex Directives & Market-Determined Hedging': 'የNBE የውጭ ምንዛሬ መመሪያዎች እና በገበያ የሚወሰን የምንዛሬ አደጋ መከላከያ',
  'Ethiopian Single Window (trade.esw.et) e-SAD Declarations': 'የኢትዮጵያ አንድ መስኮት (trade.esw.et) የe-SAD መግለጫዎች',
  'Letter of Credit (LC) Margins, Commissions & Settlement': 'የክሬዲት ደብዳቤ (LC) ማርጂን፣ ኮሚሽን እና ክፍያ ማስተካከያ',
  'Djibouti & Regional Corridors, Demurrage & Dry Ports': 'የጅቡቲ እና የክልል ኮሪደሮች፣ የዘግይቶ ቆይታ ክፍያ እና ደረቅ ወደቦች',
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

function localizeTree(value: unknown, path: string, translations: Record<string, string>): unknown {
  if (typeof value === 'string') {
    const field = path.slice(path.lastIndexOf('.') + 1);
    if (['id', 'moduleId', 'imageUrl', 'diagramType', 'type', 'category'].includes(field)) return value;
    return translations[path] || value;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => localizeTree(item, `${path}[${index}]`, translations));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [
      key,
      localizeTree(child, `${path}.${key}`, translations),
    ]));
  }
  return value;
}

export function getLocalizedCourseModules(language: AppLanguage) {
  return language === 'am'
    ? COURSE_MODULES.map(module => localizeTree(module, module.id, amharicCourseTranslations) as typeof module)
    : COURSE_MODULES;
}

export function useLocalizedCourseModules() {
  const { language } = useLanguage();
  return useMemo(() => getLocalizedCourseModules(language), [language]);
}

export function useLocalizedResourceLibrary() {
  const { language } = useLanguage();
  return useMemo(() => language === 'am'
    ? RESOURCE_LIBRARY.map(document => localizeTree(document, document.id, amharicResourceTranslations) as typeof document)
    : RESOURCE_LIBRARY, [language]);
}

export function useLocalizedGlossaryTerms() {
  const { language } = useLanguage();
  return useMemo(() => language === 'am'
    ? GLOSSARY_TERMS.map(term => localizeTree(term, term.id, amharicGlossaryTranslations) as typeof term)
    : GLOSSARY_TERMS, [language]);
}
