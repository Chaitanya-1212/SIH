import React from 'react';
import { AppScreen } from '../types';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../i18n/translations';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  pendingFollowUps?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  pendingFollowUps = 4,
}) => {
  const { language } = useAppStore();
  const t = getTranslation(language);

  if (currentScreen === 'login') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e0e8fd] py-1.5 px-3">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentScreen === 'home' ? 'text-[#00434c]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[11px] font-bold mt-0.5 leading-tight">{t.navHome}</span>
        </button>

        {/* Patients */}
        <button
          onClick={() => onNavigate('patients')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentScreen === 'patients' ? 'text-[#00434c]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'patients' ? "'FILL' 1" : "'FILL' 0" }}
          >
            group
          </span>
          <span className="text-[11px] font-bold mt-0.5 leading-tight">{t.navPatients}</span>
        </button>

        {/* Follow-ups */}
        <button
          onClick={() => onNavigate('referral')}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentScreen === 'referral' ? 'text-[#00434c]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: currentScreen === 'referral' ? "'FILL' 1" : "'FILL' 0" }}
            >
              calendar_month
            </span>
            {pendingFollowUps > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {pendingFollowUps}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold mt-0.5 leading-tight">{t.navFollowUps}</span>
        </button>

        {/* Vitals */}
        <button
          onClick={() => onNavigate('vitals')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentScreen === 'vitals' || currentScreen === 'assessment' ? 'text-[#00434c]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'vitals' || currentScreen === 'assessment' ? "'FILL' 1" : "'FILL' 0" }}
          >
            grid_view
          </span>
          <span className="text-[11px] font-bold mt-0.5 leading-tight">{t.navVitals}</span>
        </button>
      </div>
    </nav>
  );
};
