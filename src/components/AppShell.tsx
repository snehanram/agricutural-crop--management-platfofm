import { useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Bug,
  CloudSun,
  Droplets,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Menu,
  Sprout,
  Tractor,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Farmer, LanguageCode } from '../types';
import { LanguageSelector } from './LanguageSelector';

export type NavSection =
  | 'dashboard'
  | 'guide'
  | 'nearby'
  | 'weather'
  | 'farms'
  | 'crops'
  | 'irrigation'
  | 'fertilizers'
  | 'pests'
  | 'harvests'
  | 'reports';

interface AppShellProps {
  farmer: Farmer;
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onLogout: () => void;
  onBackToWebsite?: () => void;
  onPersistLanguage: (lang: LanguageCode) => void;
  activeAlertCount: number;
  children: ReactNode;
}

export function AppShell({
  farmer,
  activeSection,
  onNavigate,
  onLogout,
  onBackToWebsite,
  onPersistLanguage,
  activeAlertCount,
  children,
}: AppShellProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const navItems: Array<{ id: NavSection; label: string; icon: typeof LayoutDashboard; badge?: number }> = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'guide', label: t('nav.guide'), icon: BookOpen },
    { id: 'nearby', label: t('nav.nearby'), icon: MapPin },
    {
      id: 'weather',
      label: t('nav.weather'),
      icon: CloudSun,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
    },
    { id: 'farms', label: t('nav.farms'), icon: Map },
    { id: 'crops', label: t('nav.crops'), icon: Sprout },
    { id: 'irrigation', label: t('nav.irrigation'), icon: Droplets },
    { id: 'fertilizers', label: t('nav.fertilizers'), icon: FlaskConical },
    { id: 'pests', label: t('nav.pests'), icon: Bug },
    { id: 'harvests', label: t('nav.harvests'), icon: Tractor },
    { id: 'reports', label: t('nav.reports'), icon: BarChart3 },
  ];

  const activeItem = navItems.find((n) => n.id === activeSection) || navItems[0];

  const handleSelect = (id: NavSection) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-[#14221B] flex flex-col lg:flex-row">
      {/* Desktop Sidebar (256px) */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-[#E2E7E0] lg:bg-white lg:sticky lg:top-0 lg:h-screen">
        <div className="flex items-center gap-3 border-b border-[#E2E7E0] px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#15803D] text-white">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-[#14221B] whitespace-nowrap">
            {t('brand')}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full min-h-[42px] flex items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#ECFDF3] text-[#14532D] font-semibold'
                    : 'text-[#42544B] hover:bg-[#F3F6F1] hover:text-[#14221B]'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#15803D]' : 'text-[#66786E]'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="font-mono tabular-nums text-xs font-semibold text-[#B45309]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#E2E7E0] p-4 space-y-3">
          <div className="flex items-center gap-3">
            {!avatarError ? (
              <img
                src="/src/assets/images/farmer_avatar_1795006979710.jpg"
                alt={farmer.full_name}
                referrerPolicy="no-referrer"
                onError={() => setAvatarError(true)}
                className="h-9 w-9 shrink-0 rounded-full object-cover border border-[#D7DED4]"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ECFDF3] text-xs font-semibold text-[#15803D]">
                {farmer.full_name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#14221B]">{farmer.full_name}</p>
              <p className="truncate text-xs text-[#52635A]">
                {farmer.location || farmer.email || farmer.phone}
              </p>
            </div>
          </div>
          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              className="w-full min-h-[38px] flex items-center justify-center gap-2 rounded-lg border border-[#CBE2D0] bg-[#F2F9F4] px-3 py-2 text-xs font-semibold text-[#14532D] hover:bg-[#E4F4E8] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t('website.backToSite')}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="w-full min-h-[40px] flex items-center justify-center gap-2 rounded-lg border border-[#D7DED4] bg-white px-3 py-2 text-xs font-semibold text-[#42544B] hover:bg-[#F3F6F1] hover:text-[#14221B] transition-colors cursor-pointer whitespace-nowrap"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Bar Contract: Breadcrumb on left, concise single-line actions on right */}
        <header className="sticky top-0 z-30 border-b border-[#E2E7E0] bg-white px-4 py-3 sm:px-6 no-print">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="lg:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg border border-[#D7DED4] text-[#14221B] hover:bg-[#F3F6F1]"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-sm min-w-0">
                <span className="hidden sm:inline text-[#52635A] whitespace-nowrap">{t('brand')}</span>
                <span className="hidden sm:inline text-[#C2CCC0]" aria-hidden="true">/</span>
                <span className="font-display font-semibold text-[#14221B] truncate">
                  {activeItem.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {onBackToWebsite && (
                <button
                  type="button"
                  onClick={onBackToWebsite}
                  className="min-h-[38px] hidden md:inline-flex items-center gap-1.5 rounded-lg border border-[#D7DED4] bg-white px-3 py-1.5 text-xs font-semibold text-[#14221B] hover:bg-[#F3F6F1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t('website.backToSite')}</span>
                </button>
              )}
              <LanguageSelector compact onPersistLanguage={onPersistLanguage} />
              <button
                type="button"
                onClick={() => handleSelect('weather')}
                className={`min-h-[38px] hidden sm:inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeAlertCount > 0
                    ? 'border-[#FCD34D] bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7]'
                    : 'border-[#D7DED4] bg-white text-[#42544B] hover:bg-[#F3F6F1]'
                }`}
              >
                <CloudSun className="h-4 w-4 shrink-0" />
                <span>
                  {activeAlertCount > 0
                    ? `${activeAlertCount} ${t('nav.weather')}`
                    : t('nav.weather')}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-[#E2E7E0] flex flex-col">
              <div className="flex items-center justify-between border-b border-[#E2E7E0] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#15803D] text-white">
                    <Sprout className="h-4 w-4" />
                  </div>
                  <span className="font-display text-base font-bold text-[#14221B]">{t('brand')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg text-[#52635A] hover:bg-[#F3F6F1]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className={`w-full min-h-[44px] flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                        active
                          ? 'bg-[#ECFDF3] text-[#14532D] font-semibold'
                          : 'text-[#42544B] hover:bg-[#F3F6F1]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </span>
                      {item.badge !== undefined && (
                        <span className="font-mono tabular-nums text-xs font-semibold text-[#B45309]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
              <div className="border-t border-[#E2E7E0] p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[#14221B] truncate">{farmer.full_name}</p>
                  <p className="text-xs text-[#52635A] truncate">
                    {farmer.location || farmer.email || farmer.phone}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <LanguageSelector compact onPersistLanguage={onPersistLanguage} />
                </div>
                {onBackToWebsite && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onBackToWebsite();
                    }}
                    className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 rounded-lg border border-[#CBE2D0] bg-[#F2F9F4] px-3 py-2 text-sm font-semibold text-[#14532D]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{t('website.backToSite')}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border border-[#D7DED4] px-3 py-2 text-sm font-semibold text-[#42544B]"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Viewport Container */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1280px]">{children}</div>
        </main>
      </div>

      {/* Compact Mobile Bottom Quick Bar (<= 56px tall, well within 15% mobile viewport cap) */}
      <nav
        aria-label="Quick navigation"
        className="fixed bottom-0 inset-x-0 z-30 flex lg:hidden border-t border-[#E2E7E0] bg-white h-14 no-print"
      >
        {[
          { id: 'dashboard' as NavSection, label: t('nav.dashboard'), icon: LayoutDashboard },
          { id: 'guide' as NavSection, label: t('nav.guide'), icon: BookOpen },
          { id: 'nearby' as NavSection, label: t('nav.nearby'), icon: MapPin },
          { id: 'weather' as NavSection, label: t('nav.weather'), icon: CloudSun },
          { id: 'crops' as NavSection, label: t('nav.crops'), icon: Sprout },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                active ? 'text-[#15803D] font-semibold' : 'text-[#52635A]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate max-w-[68px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
