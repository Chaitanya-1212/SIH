import React, { useState } from 'react';
import { AppLogo } from './AppLogo';
import { AppScreen } from '../types';
import { useAppStore } from '../store/useAppStore';

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
  const {
    netInfo,
    syncQueue,
    isSyncing,
    setShowSyncDrawer,
    setShowTechStackModal,
    language,
    setLanguage,
  } = useAppStore();

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
            onClick={() => onNavigate('beneficiary')}
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
                    संजीवन-नेट
                  </span>
                  <span className="text-[10px] font-semibold text-[#3a6472] leading-none">
                    ASHA / ANM • NRHM
                  </span>
                </>
              )}
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {/* Language selector chip */}
          <button
            type="button"
            onClick={() => {
              const nextLang = language === 'hi' ? 'mr' : language === 'mr' ? 'en' : 'hi';
              setLanguage(nextLang);
            }}
            className="px-2 py-1 bg-white border border-teal-200 text-[#00434c] rounded-lg text-[11px] font-bold hover:bg-teal-50 transition-colors"
            title="Bhashini Language Switcher"
          >
            {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'EN'}
          </button>

          {/* Synced status badge - opens Store-and-Forward drawer */}
          <button
            type="button"
            onClick={() => setShowSyncDrawer(true)}
            title="WatermelonDB SQLite Store-and-Forward Sync"
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors border ${
              syncQueue.length > 0
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-[#e0f2f1] text-[#00462f] border-[#80cbc4]/40 hover:bg-[#c8e6c9]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                !netInfo.isConnected
                  ? 'bg-rose-500'
                  : syncQueue.length > 0
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-[#00c853]'
              }`}
            />
            <span className="material-symbols-outlined text-[14px]">
              {isSyncing ? 'sync' : syncQueue.length > 0 ? 'cloud_upload' : 'cloud_done'}
            </span>
            <span className="text-[11px] font-mono font-bold">
              {syncQueue.length > 0 ? `${syncQueue.length}` : 'Sync'}
            </span>
          </button>

          {/* Profile icon */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
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
                      setShowTechStackModal(true);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-[#00434c] bg-teal-50 hover:bg-teal-100 font-bold flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-teal-700">layers</span>
                    <span>Architecture &amp; Tech Stack</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('patients');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#00434c]">group</span>
                    <span>All Beneficiaries (मरीज़ सूची)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('login');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Logout (लॉगआउट)</span>
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
