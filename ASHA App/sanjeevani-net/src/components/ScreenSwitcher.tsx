import React from 'react';
import { AppScreen } from '../types';

interface ScreenSwitcherProps {
  currentScreen: AppScreen;
  onSelectScreen: (screen: AppScreen) => void;
}

export const ScreenSwitcher: React.FC<ScreenSwitcherProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const screens: { id: AppScreen; label: string; subLabel: string; icon: string }[] = [
    { id: 'login', label: 'Login Screen', subLabel: 'लॉगिन', icon: 'login' },
    { id: 'beneficiary', label: 'Beneficiary', subLabel: 'विवरण', icon: 'person' },
    { id: 'vitals', label: 'Record Vitals', subLabel: 'वाइटल्स', icon: 'vital_signs' },
    { id: 'assessment', label: 'CDSS Assess', subLabel: 'मूल्यांकन', icon: 'health_and_safety' },
    { id: 'referral', label: 'Track Referral', subLabel: 'रेफरल', icon: 'local_shipping' },
    { id: 'patients', label: 'Patients List', subLabel: 'मरीज़', icon: 'list_alt' },
  ];

  return (
    <aside aria-label="Screen preview switcher" className="bg-[#002f35] text-white py-1.5 px-2 border-b border-[#0a5c67] shadow-inner">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-[#8fd1de] font-semibold">
          <span className="material-symbols-outlined text-[15px] animate-pulse">visibility</span>
          <span className="hidden sm:inline">Screen Mode:</span>
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
          {screens.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScreen(s.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all flex items-center space-x-1 ${
                  isActive
                    ? 'bg-[#12b388] text-white shadow-sm font-bold scale-105'
                    : 'bg-[#00434c] text-[#abedfa] hover:bg-[#0a5c67]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">{s.icon}</span>
                <span>{s.subLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
