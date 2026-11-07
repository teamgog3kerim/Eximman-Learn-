import { createRoot } from 'react-dom/client';
import { ClerkProvider, SignIn, SignUp } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import App from './App';
import './index.css';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#176b60', colorForeground: '#202b29', colorMutedForeground: '#697873',
    colorDanger: '#b42318', colorBackground: '#fffefa', colorInput: '#fffefa',
    colorInputForeground: '#202b29', colorNeutral: '#202b29',
    fontFamily: 'DM Sans, system-ui, sans-serif', borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#fffefa] rounded-2xl w-[440px] max-w-full overflow-hidden dark:bg-[#1e2926]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#202b29] dark:text-[#edf1eb]',
    headerSubtitle: 'text-[#697873] dark:text-[#a0ada7]',
    socialButtonsBlockButtonText: 'text-[#202b29] dark:text-[#edf1eb]',
    formFieldLabel: 'text-[#202b29] dark:text-[#edf1eb]',
    footerActionLink: 'text-[#176b60]',
    footerActionText: 'text-[#697873]',
    dividerText: 'text-[#697873]',
    identityPreviewEditButton: 'text-[#176b60]',
    formFieldSuccessText: 'text-[#176b60]',
    alertText: 'text-[#202b29]',
    logoBox: 'rounded-lg overflow-hidden',
    logoImage: 'rounded-lg',
    socialButtonsBlockButton: 'border-[#e3e8e2] dark:border-[#34413c]',
    formButtonPrimary: 'bg-[#176b60] hover:bg-[#14594f]',
    formFieldInput: 'border-[#e3e8e2] focus:border-[#176b60] dark:border-[#34413c]',
    footerAction: 'text-[#697873]',
    dividerLine: 'bg-[#e3e8e2]',
    alert: 'rounded-xl',
    otpCodeFieldInput: 'border-[#e3e8e2]',
    formFieldRow: 'gap-1',
    main: 'gap-5',
  },
};

function stripBase(path: string) {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

function ClerkRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={path => setLocation(stripBase(path))}
      routerReplace={path => setLocation(stripBase(path))}
      appearance={clerkAppearance}
    >
      <Switch>
        <Route path="/sign-in/*?">
          <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#f6f5ef] px-4 py-10 dark:bg-[#171c1a]">
            <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
            <p className="max-w-md text-center text-xs leading-5 text-[#697873]">If sign-in methods do not appear, enable Google under Replit’s Users & Auth settings.</p>
          </div>
        </Route>
        <Route path="/sign-up/*?">
          <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#f6f5ef] px-4 py-10 dark:bg-[#171c1a]">
            <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
            <p className="max-w-md text-center text-xs leading-5 text-[#697873]">Enable Google under Replit’s Users & Auth settings for Google account sign-in.</p>
          </div>
        </Route>
        <Route path="/" component={App} />
        <Route component={App} />
      </Switch>
    </ClerkProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <WouterRouter base={basePath}><ClerkRoutes /></WouterRouter>,
);
