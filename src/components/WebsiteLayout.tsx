import { useState, type ReactNode } from 'react';
import { ArrowRight, Menu, Sprout, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Farmer, LanguageCode } from '../types';
import { LanguageSelector } from './LanguageSelector';

export type WebsitePage = 'home' | 'doctor' | 'guide' | 'nearby' | 'weather';

interface WebsiteLayoutProps {
  activePage: WebsitePage;
  onNavigatePage: (page: WebsitePage) => void;
  onOpenAuth: () => void;
  onStartDemo: () => void;
  onOpenPortal: () => void;
  farmer: Farmer | null;
  demoLoading?: boolean;
  onPersistLanguage?: (lang: LanguageCode) => void;
  children: ReactNode;
}

export function WebsiteLayout({
  activePage,
  onNavigatePage,
  onOpenAuth,
  onStartDemo,
  onOpenPortal,
  farmer,
  demoLoading = false,
  onPersistLanguage,
  children,
}: WebsiteLayoutProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: Array<{ id: WebsitePage; label: string }> = [
    { id: 'home', label: t('website.navHome') },
    { id: 'doctor', label: t('website.navPlantDoctor') },
    { id: 'guide', label: t('website.navGuide') },
    { id: 'nearby', label: t('website.navNearby') },
    { id: 'weather', label: t('website.navWeather') },
  ];

  const handleSelectPage = (page: WebsitePage) => {
    onNavigatePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7] text-[#14221B]">
      {/* Editorial Top Navigation Bar (3 Clean Zones) */}
      <header className="sticky top-0 z-40 h-16 border-b border-[#E2E7E0] bg-white/95 backdrop-blur-sm no-print">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleSelectPage('home')}
            className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#15803D] text-white">
              <Sprout className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-[#14221B]">
              {t('brand')}
            </span>
          </button>

          {/* Zone 2: Horizontal Website Navigation Links */}
          <nav
            aria-label="Website navigation"
            className="hidden lg:flex items-center gap-7"
          >
            {navLinks.map((link) => {
              const active = activePage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSelectPage(link.id)}
                  className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'text-[#14221B] font-semibold'
                      : 'text-[#52635A] hover:text-[#14221B]'
                  }`}
                >
                  <span>{link.label}</span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#15803D]"
                    />
                  )}
                </button>
              );
            })}

            <button
              type="button"
              disabled={demoLoading}
              onClick={farmer ? onOpenPortal : onStartDemo}
              className="py-2 text-sm font-medium text-[#52635A] hover:text-[#15803D] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              {farmer ? t('website.navMyFarm') : t('website.navDemo')}
            </button>
          </nav>

          {/* Zone 3: Language Globe Selector + Single Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSelector compact onPersistLanguage={onPersistLanguage} />

            {farmer ? (
              <button
                type="button"
                onClick={onOpenPortal}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#15803D] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>{t('website.navMyFarm')}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-lg bg-[#15803D] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>{t('website.navSignIn')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle website menu"
              className="lg:hidden min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded-lg border border-[#D7DED4] bg-white text-[#14221B] hover:bg-[#F3F6F1] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2E7E0] bg-white px-4 py-4 space-y-2 no-print">
          {navLinks.map((link) => {
            const active = activePage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleSelectPage(link.id)}
                className={`w-full min-h-[42px] flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-left cursor-pointer ${
                  active
                    ? 'bg-[#ECFDF3] text-[#14532D] font-semibold'
                    : 'text-[#42544B] hover:bg-[#F3F6F1]'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-[#EEF2EC] flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              disabled={demoLoading}
              onClick={() => {
                setMobileMenuOpen(false);
                if (farmer) {
                  onOpenPortal();
                } else {
                  onStartDemo();
                }
              }}
              className="w-full min-h-[42px] inline-flex items-center justify-center rounded-lg border border-[#15803D] bg-[#F2F9F4] px-4 py-2 text-sm font-semibold text-[#14532D] cursor-pointer"
            >
              {farmer ? t('website.navMyFarm') : t('website.navDemo')}
            </button>
            {!farmer && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full min-h-[42px] inline-flex items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white cursor-pointer"
              >
                {t('website.navSignIn')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E2E7E0] bg-white mt-16 no-print">
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-md">
              <div className="inline-flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#15803D] text-white">
                  <Sprout className="h-4 w-4" />
                </span>
                <span className="font-display text-base font-bold text-[#14221B]">
                  {t('brand')}
                </span>
              </div>
              <p className="text-sm text-[#52635A] leading-relaxed">
                {t('website.footerTagline')}
              </p>
            </div>

            <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#42544B]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSelectPage(link.id)}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={farmer ? onOpenPortal : onStartDemo}
                className="hover:text-[#15803D] transition-colors cursor-pointer"
              >
                {farmer ? t('website.navMyFarm') : t('website.navDemo')}
              </button>
              {!farmer && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="hover:text-[#15803D] transition-colors cursor-pointer"
                >
                  {t('website.navSignIn')}
                </button>
              )}
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-[#EEF2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#66786E]">
            <span>{t('website.footerCopyright')}</span>
            <span>{t('website.heroEyebrow')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
