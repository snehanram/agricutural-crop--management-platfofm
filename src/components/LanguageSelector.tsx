import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ALPHABETICAL_LANGUAGES, getLanguageOption } from '../data/languages';
import type { LanguageCode } from '../types';

interface LanguageSelectorProps {
  onPersistLanguage?: (lang: LanguageCode) => void;
  compact?: boolean;
}

export function LanguageSelector({ onPersistLanguage, compact = false }: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeOption = getLanguageOption(i18n.language);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 30);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const filteredLanguages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALPHABETICAL_LANGUAGES;
    return ALPHABETICAL_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (code: LanguageCode) => {
    void i18n.changeLanguage(code);
    localStorage.setItem('krishifield_lang', code);
    if (onPersistLanguage) {
      onPersistLanguage(code);
    }
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('langSelector.selectLanguage')}
        className={`inline-flex items-center justify-between gap-2 rounded-lg border border-[#D7DED4] bg-[#F3F6F1] hover:bg-[#E9EFE6] text-[#14221B] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#15803D] ${
          compact ? 'min-h-[38px] px-3 py-1.5 text-xs font-semibold' : 'min-h-[40px] px-3.5 py-2 text-xs sm:text-sm font-semibold'
        }`}
      >
        <Globe className="h-4 w-4 text-[#15803D] shrink-0" />
        <span className="truncate max-w-[140px]">
          {activeOption.nativeName === activeOption.name
            ? activeOption.name
            : `${activeOption.nativeName} · ${activeOption.name}`}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#52635A] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Languages sorted alphabetically"
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-[#D7DED4] bg-white shadow-lg z-50 overflow-hidden"
        >
          <div className="border-b border-[#E2E7E0] p-2.5 bg-[#F8F9F7]">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-[#52635A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('langSelector.searchPlaceholder')}
                className="w-full min-h-[36px] rounded-lg border border-[#D7DED4] bg-white pl-8 pr-3 py-1 text-xs text-[#14221B] focus:border-[#15803D] focus:outline-none"
              />
            </div>
            <p className="mt-1.5 px-1 text-[11px] font-medium text-[#52635A]">
              {t('langSelector.alphabeticalCount', { count: filteredLanguages.length })}
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5EF]">
            {filteredLanguages.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-[#52635A]">
                {t('langSelector.noMatch')}
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isActive = activeOption.code.toLowerCase() === lang.code.toLowerCase();
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(lang.code);
                    }}
                    className={`w-full min-h-[40px] flex items-center justify-between gap-2 px-3.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#ECFDF3] text-[#14532D] font-semibold'
                        : 'text-[#14221B] hover:bg-[#F3F6F1]'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-[#14221B] truncate">{lang.name}</span>
                      {lang.nativeName !== lang.name && (
                        <span className="text-[#52635A] truncate">({lang.nativeName})</span>
                      )}
                    </span>
                    {isActive && <Check className="h-4 w-4 text-[#15803D] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
