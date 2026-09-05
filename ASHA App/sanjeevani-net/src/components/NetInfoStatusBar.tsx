import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const NetInfoStatusBar: React.FC = () => {
  const { netInfo, setNetworkTier, syncQueue, isSyncing, setShowSyncDrawer, setShowTechStackModal } = useAppStore();

  return (
    <div className="bg-[#002f35] text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-mono border-b border-teal-800 select-none">
      {/* Left: NetInfo status indicator & tier toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-[10px] text-teal-300 font-sans font-bold flex items-center space-x-1">
          <span className="material-symbols-outlined text-[13px]">cell_tower</span>
          <span>NetInfo:</span>
        </span>

        <div className="flex items-center bg-black/30 rounded-lg p-0.5 border border-teal-900/60 text-[10px]">
          <button
            type="button"
            onClick={() => setNetworkTier('4G')}
            className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
              netInfo.tier === '4G' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
            title="Online 4G / Wi-Fi"
          >
            4G LTE
          </button>
          <button
            type="button"
            onClick={() => setNetworkTier('2G_EDGE')}
            className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
              netInfo.tier === '2G_EDGE' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
            title="Rural 2G EDGE (64 kbps, WebRTC audio-only fallback)"
          >
            2G EDGE
          </button>
          <button
            type="button"
            onClick={() => setNetworkTier('OFFLINE')}
            className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
              netInfo.tier === 'OFFLINE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
            title="Offline Mode (Store-and-Forward SQLite Queue)"
          >
            Offline
          </button>
        </div>

        {netInfo.isConnected && (
          <span className="text-[10px] text-emerald-300 hidden sm:inline">
            {netInfo.latencyMs}ms
          </span>
        )}
      </div>

      {/* Right: Store-and-Forward Sync Queue pill & Tech Stack Inspector */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowSyncDrawer(true)}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-md font-sans text-[10px] font-bold transition-all ${
            syncQueue.length > 0
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
              : 'bg-teal-900/50 text-teal-200 border border-teal-700/50 hover:bg-teal-800/50'
          }`}
          title="WatermelonDB SQLite Store-and-Forward Queue"
        >
          <span className={`material-symbols-outlined text-[13px] ${isSyncing ? 'animate-spin' : ''}`}>
            {isSyncing ? 'sync' : 'database'}
          </span>
          <span>
            {isSyncing ? 'Syncing...' : syncQueue.length > 0 ? `${syncQueue.length} Pending Sync` : 'DB Synced'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowTechStackModal(true)}
          className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-teal-100 px-2 py-0.5 rounded-md font-sans text-[10px] font-bold border border-white/20 transition-colors"
          title="Inspect Complete Tech Stack (React Native, WatermelonDB, DRF, PostgreSQL, Zustand, Zod, Bhashini, WebRTC)"
        >
          <span className="material-symbols-outlined text-[13px] text-amber-300">layers</span>
          <span>Tech Stack</span>
        </button>
      </div>
    </div>
  );
};
