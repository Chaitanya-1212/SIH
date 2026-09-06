import React, { useState } from 'react';
import { AppLogo } from './AppLogo';
import { AppScreen, Language } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n/translations';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  isOnline?: boolean;
  onToggleOnline?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  title,
  showBack = false,
  onBack,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const {
    syncQueue,
    setShowSyncDrawer,
    language,
    setLanguage,
  } = useAppStore();

  const t = getTranslation(language);

  const languageOptions: { code: Language; label: string; subLabel: string }[] = [
    { code: 'mr', label: 'मराठी', subLabel: 'Marathi' },
    { code: 'hi', label: 'हिन्दी', subLabel: 'Hindi' },
    { code: 'en', label: 'English', subLabel: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#f9f9ff]/95 backdrop-blur-md border-b border-[#e0e8fd] px-3.5 py-2 transition-all">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2 min-w-0">
          {showBack && (
            <button
              onClick={onBack}
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-[#00434c] hover:bg-[#e8eeff] transition-colors"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-left focus:outline-none"
          >
            <AppLogo size={30} />
            <div className="flex flex-col min-w-0">
              {title ? (
                <span className="text-[16px] font-bold text-[#00434c] tracking-tight leading-tight truncate">
                  {title}
                </span>
              ) : (
                <>
                  <span className="text-[15px] font-bold text-[#00434c] tracking-tight leading-tight">
                    {t.appName}
                  </span>
                  <span className="text-[10px] font-semibold text-[#3a6472] leading-none">
                    {t.ashaAnmTitle}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Language selector chip and dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowProfileMenu(false);
              }}
              className="px-2.5 py-1 bg-white border border-teal-200 text-[#00434c] rounded-lg text-xs font-bold hover:bg-teal-50 transition-colors flex items-center space-x-1 shadow-2xs"
              title={t.selectLanguage}
            >
              <span className="material-symbols-outlined text-[15px] text-teal-700">translate</span>
              <span>{language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'English'}</span>
              <span className="material-symbols-outlined text-[13px] text-slate-400">expand_more</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.selectLanguage}
                </div>
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      language === opt.code
                        ? 'bg-teal-50 text-[#00434c] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      <span className="text-[10px] text-slate-400">{opt.subLabel}</span>
                    </div>
                    {language === opt.code && (
                      <span className="material-symbols-outlined text-[16px] text-[#00434c]">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile icon */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowLangMenu(false);
              }}
              className="w-8 h-8 rounded-full bg-[#00434c] text-white flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity"
              aria-label="Worker Profile"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#00434c] text-white flex items-center justify-center font-bold">
                    MK
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#00434c] truncate">मीना कदम (Meena Kadam)</p>
                    <p className="text-xs text-slate-500">ASHA Worker #MH-ASHA-042</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Sub-Center Khairi • PHC Belora</p>
                  </div>
                </div>

                <div className="pt-2 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSyncDrawer(true);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#00434c]">sync</span>
                    <span>{t.syncStatus} ({syncQueue.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('patients');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#00434c]">group</span>
                    <span>{t.allBeneficiaries}</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('login');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
