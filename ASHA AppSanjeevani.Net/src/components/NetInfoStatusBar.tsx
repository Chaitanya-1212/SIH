import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const NetInfoStatusBar: React.FC = () => {
  const { netInfo, setNetworkTier, language } = useAppStore();

  return (
    <div className="bg-[#002f35] text-white px-3 py-1 flex items-center justify-between text-xs border-b border-teal-800 select-none">
      {/* Left: Network mode selector */}
      <div className="flex items-center space-x-2">
        <span className="text-[11px] text-teal-200 font-bold flex items-center space-x-1">
          <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
          <span>{language === 'mr' ? 'नेटवर्क:' : language === 'hi' ? 'नेटवर्क:' : 'Network:'}</span>
        </span>

        <div className="flex items-center bg-black/30 rounded-lg p-0.5 border border-teal-900/60 text-[10px]">
          <button
            type="button"
            onClick={() => setNetworkTier('4G')}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              netInfo.tier === '4G' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            {language === 'mr' ? 'जलद (4G)' : language === 'hi' ? 'तेज (4G)' : 'Fast'}
          </button>
          <button
            type="button"
            onClick={() => setNetworkTier('2G_EDGE')}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              netInfo.tier === '2G_EDGE' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            {language === 'mr' ? 'कमी (2G)' : language === 'hi' ? 'धीमा (2G)' : 'Low'}
          </button>
          <button
            type="button"
            onClick={() => setNetworkTier('OFFLINE')}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              netInfo.tier === 'OFFLINE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            {language === 'mr' ? 'ऑफलाइन' : language === 'hi' ? 'ऑफलाइन' : 'Offline'}
          </button>
        </div>
      </div>

      {/* Right: Clean connection indicator */}
      <div className="flex items-center space-x-1.5 text-[11px] text-teal-200 font-medium">
        <span
          className={`w-2 h-2 rounded-full ${
            netInfo.isConnected ? 'bg-emerald-400' : 'bg-rose-500'
          }`}
        />
        <span>
          {netInfo.isConnected
            ? (language === 'mr' ? 'इंटरनेट सुरू' : language === 'hi' ? 'इंटरनेट सक्रिय' : 'Connected')
            : (language === 'mr' ? 'ऑफलाइन मोड' : language === 'hi' ? 'ऑफलाइन मोड' : 'Offline Mode')}
        </span>
      </div>
    </div>
  );
};
