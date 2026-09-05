import React from 'react';
import { AppScreen } from '../types';

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
  if (currentScreen === 'login') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e0e8fd] py-1.5 px-3">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {/* Home */}
        <button
          onClick={() => onNavigate('beneficiary')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            currentScreen === 'beneficiary' ? 'text-[#00434c]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'beneficiary' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[11px] font-bold mt-0.5 leading-tight">Home</span>
          <span className="text-[10px] text-slate-400 -mt-0.5 leading-tight">गृह</span>
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
          <span className="text-[11px] font-bold mt-0.5 leading-tight">Patients</span>
          <span className="text-[10px] text-slate-400 -mt-0.5 leading-tight">मरीज़</span>
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
          <span className="text-[11px] font-bold mt-0.5 leading-tight">Follow-ups</span>
          <span className="text-[10px] text-slate-400 -mt-0.5 leading-tight">फॉलो-अप</span>
        </button>

        {/* More */}
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
          <span className="text-[11px] font-bold mt-0.5 leading-tight">ANC Care</span>
          <span className="text-[10px] text-slate-400 -mt-0.5 leading-tight">जांच</span>
        </button>
      </div>
    </nav>
  );
};
