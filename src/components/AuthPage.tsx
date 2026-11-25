import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CloudSun,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, setAuthToken } from '../lib/api';
import type { AuthProvidersStatus, DemoLocationOption, Farmer } from '../types';
import { LanguageSelector } from './LanguageSelector';

interface AuthPageProps {
  onAuthenticated: (farmer: Farmer, options?: { demoLocation?: DemoLocationOption }) => void;
  onBackToWebsite?: () => void;
}

type AuthMethod = 'phone' | 'email';
type PhoneSubMode = 'register' | 'login';
type EmailSubMode = 'login' | 'register';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

export function AuthPage({ onAuthenticated, onBackToWebsite }: AuthPageProps) {
  const { t, i18n } = useTranslation();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [phoneMode, setPhoneMode] = useState<PhoneSubMode>('register');
  const [emailMode, setEmailMode] = useState<EmailSubMode>('login');

  // Phone state
  const [phoneOnly, setPhoneOnly] = useState('');
  const [phoneName, setPhoneName] = useState('');

  // Email & password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const [providers, setProviders] = useState<AuthProvidersStatus | null>(null);
  const [directProvider, setDirectProvider] = useState<'google' | 'apple' | null>(null);
  const [directEmail, setDirectEmail] = useState('');
  const [directName, setDirectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [heroError, setHeroError] = useState(false);

  const currentLang = i18n.language?.trim() || 'en';

  useEffect(() => {
    api
      .getAuthProviders()
      .then((res) => setProviders(res))
      .catch(() => {
        // Provider status optional; individual actions handle fallback errors
      });
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (
        !origin.endsWith('.run.app') &&
        !origin.includes('localhost') &&
        origin !== window.location.origin
      ) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.token && event.data?.farmer) {
        setAuthToken(String(event.data.token));
        setLoading(false);
        setError('');
        setDirectProvider(null);
        onAuthenticated(event.data.farmer as Farmer);
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setLoading(false);
        setError(String(event.data?.error || 'Sign-in failed'));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAuthenticated]);

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setError('');

    const isConfigured =
      provider === 'google' ? providers?.google.configured : providers?.apple.configured;

    if (!isConfigured) {
      setDirectProvider((prev) => (prev === provider ? null : provider));
      setDirectEmail('');
      setDirectName('');
      return;
    }

    setDirectProvider(null);
    setLoading(true);
    try {
      const res =
        provider === 'google'
          ? await api.getGoogleAuthUrl(currentLang)
          : await api.getAppleAuthUrl(currentLang);

      const popup = window.open(
        res.url,
        'krishifield_oauth_popup',
        'width=540,height=660,menubar=no,toolbar=no,status=no'
      );

      if (!popup) {
        setError(t('auth.popupBlocked'));
        setLoading(false);
        return;
      }

      const timer = window.setInterval(() => {
        if (popup.closed) {
          window.clearInterval(timer);
          setLoading(false);
        }
      }, 450);
    } catch (err) {
      setLoading(false);
      setDirectProvider(provider);
      if (err instanceof Error && !err.message.includes('requires')) {
        setError(err.message);
      }
    }
  };

  const handleDirectProviderSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!directProvider) return;
    setError('');
    setLoading(true);
    try {
      const res = await api.oauthDirectLogin({
        provider: directProvider,
        email: directEmail,
        full_name: directName.trim() || undefined,
        preferred_language: currentLang,
      });
      setAuthToken(res.token);
      onAuthenticated(res.farmer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setDirectProvider(null);

    if (phoneMode === 'register' && phoneName.trim().length < 2) {
      setError(t('auth.phoneFullNameRequired'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.loginWithPhone({
        mode: phoneMode,
        phone: phoneOnly,
        full_name: phoneMode === 'register' ? phoneName.trim() : undefined,
        preferred_language: currentLang,
      });
      setAuthToken(res.token);
      onAuthenticated(res.farmer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Phone sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setDirectProvider(null);
    setLoading(true);
    try {
      if (emailMode === 'login') {
        const res = await api.login(email, password);
        setAuthToken(res.token);
        onAuthenticated(res.farmer);
      } else {
        const res = await api.register({
          full_name: fullName,
          email,
          phone,
          password,
          preferred_language: currentLang,
          location,
        });
        setAuthToken(res.token);
        onAuthenticated(res.farmer);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setDirectProvider(null);
    setLoading(true);
    try {
      const res = await api.demoLogin(currentLang);
      setAuthToken(res.token);
      onAuthenticated(res.farmer, { demoLocation: res.demoLocation });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign into demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#14221B] flex flex-col">
      {/* Top Bar */}
      <header className="w-full border-b border-[#E2E7E0] bg-white px-6 py-3.5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {onBackToWebsite && (
              <button
                type="button"
                onClick={onBackToWebsite}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D7DED4] bg-[#F8F9F7] px-3 py-1.5 text-xs font-semibold text-[#14221B] hover:border-[#15803D] hover:bg-[#ECFDF3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t('website.backToSite')}</span>
              </button>
            )}
            <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#15803D] text-white">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-[#14221B]">
                {t('brand')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline text-xs font-medium text-[#52635A] whitespace-nowrap">
              {t('auth.chooseLanguage')}:
            </span>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Split Workspace */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-8 sm:px-6 lg:py-12">
        <div className="grid w-full grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-[#E2E7E0] bg-white lg:grid-cols-12">
          {/* Left Visual Editorial Column */}
          <div className="relative flex flex-col justify-between bg-[#14221B] text-white lg:col-span-6 min-h-[300px] lg:min-h-[640px]">
            {!heroError ? (
              <img
                src="/src/assets/images/login_farm_hero_1795006979011.jpg"
                alt="Irrigated agricultural terraced fields at sunrise"
                referrerPolicy="no-referrer"
                onError={() => setHeroError(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#14532D] via-[#1B4332] to-[#0B1F16]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A13]/95 via-[#0D1A13]/55 to-[#0D1A13]/30" />

            <div className="relative z-10 p-6 sm:p-8">
              <p className="text-xs font-medium tracking-wide text-[#D8E7DC]">
                {t('brandSubtitle')}
              </p>
            </div>

            <div className="relative z-10 p-6 sm:p-8 space-y-5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-white [text-wrap:balance]">
                {t('auth.welcomeTitle')}
              </h1>
              <p className="text-sm leading-relaxed text-[#E3ECE5] max-w-lg">
                {t('auth.welcomeDesc')}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4 text-xs text-[#E3ECE5]">
                <div className="flex items-start gap-2">
                  <CloudSun className="h-4 w-4 shrink-0 text-[#86EFAC] mt-0.5" />
                  <span>{t('auth.featureWeather')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-[#86EFAC] mt-0.5" />
                  <span>{t('auth.featureRecords')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Authentication Column */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-6">
            <div className="mx-auto w-full max-w-md space-y-5">
              {/* Quick Social / Device Account Logins: Google & Apple / Mac */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void handleOAuthLogin('google')}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-3 rounded-xl border border-[#CBD5CC] bg-white px-4 py-2.5 text-sm font-semibold text-[#14221B] hover:bg-[#F8F9F7] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <GoogleIcon />
                  <span>{t('auth.googleBtn')}</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void handleOAuthLogin('apple')}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-3 rounded-xl border border-[#14221B] bg-[#14221B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1F3328] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  <AppleIcon />
                  <span>{t('auth.appleBtn')}</span>
                </button>
              </div>

              {/* Quick Google / Apple Account Form when OAuth Secrets are not set */}
              {directProvider && (
                <form
                  onSubmit={handleDirectProviderSubmit}
                  className="rounded-xl border border-[#CBE2D0] bg-[#F2F9F4] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-bold text-[#14221B]">
                      {directProvider === 'google'
                        ? t('auth.directGoogleTitle')
                        : t('auth.directAppleTitle')}
                    </p>
                    <button
                      type="button"
                      onClick={() => setDirectProvider(null)}
                      className="text-xs font-semibold text-[#52635A] hover:text-[#14221B] cursor-pointer"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                  <input
                    type="email"
                    required
                    value={directEmail}
                    onChange={(e) => setDirectEmail(e.target.value)}
                    placeholder={
                      directProvider === 'google'
                        ? t('auth.directGooglePlaceholder')
                        : t('auth.directApplePlaceholder')
                    }
                    className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={directName}
                    onChange={(e) => setDirectName(e.target.value)}
                    placeholder={t('auth.directNamePlaceholder')}
                    className="w-full min-h-[42px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <span>{t('auth.directContinueBtn')}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative flex items-center py-0.5">
                <div className="flex-grow border-t border-[#E2E7E0]" />
                <span className="mx-3 shrink-0 text-xs font-medium text-[#52635A]">
                  {t('auth.orDivider')}
                </span>
                <div className="flex-grow border-t border-[#E2E7E0]" />
              </div>

              {/* Method Switcher: Phone Number Only vs Email & Password */}
              <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-[#E2E7E0] bg-[#F3F6F1] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setError('');
                    setDirectProvider(null);
                  }}
                  className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-white text-[#14221B] shadow-xs'
                      : 'text-[#52635A] hover:text-[#14221B]'
                  }`}
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#15803D]" />
                  <span>{t('auth.phoneOnlyTab')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setError('');
                    setDirectProvider(null);
                  }}
                  className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-white text-[#14221B] shadow-xs'
                      : 'text-[#52635A] hover:text-[#14221B]'
                  }`}
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#15803D]" />
                  <span>{t('auth.emailTab')}</span>
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]"
                >
                  {error}
                </div>
              )}

              {/* Option 1: Phone Number (Create Account / Sign In) */}
              {authMethod === 'phone' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneMode('register');
                        setError('');
                      }}
                      className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        phoneMode === 'register'
                          ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                          : 'border-[#E2E7E0] bg-white text-[#52635A] hover:text-[#14221B]'
                      }`}
                    >
                      {t('auth.phoneRegisterTab')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneMode('login');
                        setError('');
                      }}
                      className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        phoneMode === 'login'
                          ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                          : 'border-[#E2E7E0] bg-white text-[#52635A] hover:text-[#14221B]'
                      }`}
                    >
                      {t('auth.phoneLoginTab')}
                    </button>
                  </div>

                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    {phoneMode === 'register' && (
                      <div>
                        <label className="block text-sm font-semibold text-[#14221B] mb-1.5">
                          {t('auth.phoneOnlyNameLabel')}
                        </label>
                        <input
                          type="text"
                          required
                          minLength={2}
                          value={phoneName}
                          onChange={(e) => setPhoneName(e.target.value)}
                          placeholder={t('auth.namePlaceholder')}
                          className="w-full min-h-[46px] rounded-xl border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-[#14221B] mb-1.5">
                        {t('auth.phoneOnlyLabel')}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneOnly}
                        onChange={(e) => setPhoneOnly(e.target.value)}
                        placeholder={t('auth.phoneOnlyPlaceholder')}
                        className="w-full min-h-[50px] rounded-xl border-2 border-[#D7DED4] bg-white px-4 py-2.5 font-mono text-base font-semibold text-[#14221B] focus:border-[#15803D] focus:outline-none"
                      />
                    </div>

                    <p className="text-xs text-[#52635A] leading-relaxed">
                      {phoneMode === 'register' ? t('auth.phoneRegisterHint') : t('auth.phoneLoginHint')}
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>
                        {phoneMode === 'register' ? t('auth.phoneRegisterBtn') : t('auth.phoneOnlyBtn')}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>
                  </form>
                </div>
              )}

              {/* Option 2: Email & Password (Sign In / Create Account) */}
              {authMethod === 'email' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode('login');
                        setError('');
                      }}
                      className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        emailMode === 'login'
                          ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                          : 'border-[#E2E7E0] bg-white text-[#52635A] hover:text-[#14221B]'
                      }`}
                    >
                      {t('auth.loginTab')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailMode('register');
                        setError('');
                      }}
                      className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        emailMode === 'register'
                          ? 'border-[#15803D] bg-[#ECFDF3] text-[#14532D]'
                          : 'border-[#E2E7E0] bg-white text-[#52635A] hover:text-[#14221B]'
                      }`}
                    >
                      {t('auth.registerTab')}
                    </button>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                    {emailMode === 'register' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-[#14221B] mb-1">
                            {t('auth.fullName')}
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={t('auth.namePlaceholder')}
                            className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-[#14221B] mb-1">
                              {t('auth.phone')}
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98480 00000"
                              className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#14221B] mb-1">
                              {t('auth.location')}
                            </label>
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="Guntur, AP"
                              className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-[#14221B] mb-1">
                        {t('auth.email')}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="farmer@example.com"
                        className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#14221B] mb-1">
                        {t('auth.password')}
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full min-h-[44px] rounded-lg border border-[#D7DED4] bg-white px-3.5 py-2 text-sm text-[#14221B] focus:border-[#15803D] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#15803D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>{emailMode === 'login' ? t('auth.signInBtn') : t('auth.registerBtn')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* Divider + Demo Farm Button */}
              <div className="border-t border-[#E2E7E0] pt-4 space-y-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDemoLogin}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#15803D] bg-[#F2F9F4] px-4 py-2 text-sm font-semibold text-[#14532D] hover:bg-[#E4F4E8] transition-colors cursor-pointer"
                >
                  <Sprout className="h-4 w-4 shrink-0" />
                  <span>{t('auth.demoBtn')}</span>
                </button>
                <p className="text-xs text-[#52635A] text-center leading-relaxed">
                  {t('auth.demoHint')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
