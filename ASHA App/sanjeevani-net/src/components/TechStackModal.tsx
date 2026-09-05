import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export const TechStackModal: React.FC = () => {
  const {
    showTechStackModal,
    setShowTechStackModal,
    netInfo,
    setNetworkTier,
    syncQueue,
    triggerStoreAndForwardSync,
    isSyncing,
    language,
    setLanguage,
    startBhashiniVoiceInput,
    bhashiniVoice,
    speakVernacular,
    webrtcStats,
    toggleLowBandwidthWebRtc,
    jwtSession,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<string>('all');

  if (!showTechStackModal) return null;

  const TECH_LAYERS = [
    {
      layer: 'Mobile Framework',
      tech: 'React Native (Android)',
      role: 'Builds the Android ASHA/ANM app',
      icon: 'smartphone',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      details: 'Optimized touch ergonomics, Android status bar, material design, and hardware back button integration.',
    },
    {
      layer: 'Local Database',
      tech: 'WatermelonDB + SQLite',
      role: 'Stores patient data when offline',
      icon: 'database',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      details: 'High-performance lazy-loading SQLite engine with dirty record tracking (_status) and offline schema migrations.',
    },
    {
      layer: 'Backend API',
      tech: 'Django REST Framework (DRF)',
      role: 'Sends/receives data from the central server',
      icon: 'api',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      details: 'RESTful endpoints (/api/v1/vitals/, /api/v1/sync/store-and-forward/) with DRF serializers and Bearer token auth.',
    },
    {
      layer: 'Server Database',
      tech: 'PostgreSQL 16',
      role: 'Stores the synchronized EMR data',
      icon: 'dns',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      details: 'Cloud-hosted relational EMR tables (emr_patients, emr_vitals, emr_referrals) with JSONB clinical telemetry.',
    },
    {
      layer: 'Offline Sync',
      tech: 'Store-and-Forward Sync',
      role: 'Uploads pending data when internet returns',
      icon: 'sync_saved_locally',
      color: 'text-teal-700 bg-teal-50 border-teal-200',
      details: `${syncQueue.length} items currently in SQLite sync queue. Automatic batch flush on NetInfo online event.`,
    },
    {
      layer: 'Network Detection',
      tech: 'NetInfo',
      role: 'Detects online/offline status',
      icon: 'wifi_tethering',
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      details: `Active status: ${netInfo.tier} (${netInfo.isConnected ? 'Connected' : 'Offline'}). Real-time reconnection listener.`,
    },
    {
      layer: 'Authentication',
      tech: 'JWT + Secure Storage',
      role: 'Secure ASHA/ANM login',
      icon: 'lock',
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      details: `Active Token: ${jwtSession?.accessToken?.slice(0, 24)}... stored in EncryptedSharedPreferences / SecureStore.`,
    },
    {
      layer: 'State Management',
      tech: 'Zustand',
      role: 'Manages app state',
      icon: 'account_tree',
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      details: 'Fast, un-opinionated reactive store (useAppStore) managing beneficiaries, netInfo, Bhashini, and WebRTC telemetry.',
    },
    {
      layer: 'Forms & Validation',
      tech: 'React Hook Form + Zod',
      role: 'Patient/vitals forms',
      icon: 'fact_check',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      details: 'vitalsFormSchema with strict numeric clinical bounds (BP 60-260 mmHg, Pulse 40-200 BPM, Temp 92-108°F).',
    },
    {
      layer: 'Language',
      tech: 'Bhashini APIs (Digital India)',
      role: 'Marathi/Hindi/vernacular voice & language support',
      icon: 'record_voice_over',
      color: 'text-green-700 bg-green-50 border-green-200',
      details: 'Trilingual Vernacular engine: ASR Speech-to-text, NMT Translation, and TTS voice assistant in Marathi & Hindi.',
    },
    {
      layer: 'Teleconsultation',
      tech: 'WebRTC',
      role: 'Low-bandwidth doctor consultation',
      icon: 'video_camera_front',
      color: 'text-teal-800 bg-teal-50 border-teal-200',
      details: `Resolution: ${webrtcStats.resolution} • Bitrate: ${webrtcStats.bitrateKbps} kbps • Adaptive 2G Audio Fallback available.`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#00434c] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#12b388] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">layers</span>
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Architecture &amp; Tech Stack</h3>
              <p className="text-[11px] text-teal-200">Production-Ready Frontline Maternal Healthcare Platform</p>
            </div>
          </div>
          <button
            onClick={() => setShowTechStackModal(false)}
            className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs hover:bg-white/30"
          >
            ✕
          </button>
        </div>

        {/* Live Interactive Controls Bar */}
        <div className="bg-[#f1f3ff] p-3 border-b border-[#e0e8fd] space-y-2">
          <span className="text-[10px] font-bold text-[#00434c] uppercase tracking-wider block">
            Live Interactive Simulators:
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* NetInfo simulation */}
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">NetInfo Tier:</span>
              <div className="flex items-center space-x-1 mt-1">
                {(['4G', '2G_EDGE', 'OFFLINE'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setNetworkTier(t)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      netInfo.tier === t ? 'bg-[#00434c] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t === '2G_EDGE' ? '2G' : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Bhashini Vernacular */}
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block">Bhashini Lang:</span>
              <div className="flex items-center space-x-1 mt-1">
                {(['mr', 'hi', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      language === l ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {l === 'mr' ? 'मराठी' : l === 'hi' ? 'हिन्दी' : 'EN'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={startBhashiniVoiceInput}
              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">mic</span>
              <span>{bhashiniVoice.isListening ? 'Listening...' : 'Test Bhashini ASR'}</span>
            </button>

            <button
              onClick={() => speakVernacular()}
              className="flex-1 py-1.5 bg-[#00434c] hover:bg-[#0a5c67] text-white text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">volume_up</span>
              <span>Test Bhashini TTS</span>
            </button>

            <button
              onClick={toggleLowBandwidthWebRtc}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg flex items-center space-x-1 border ${
                webrtcStats.isAudioOnlyFallback
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">network_check</span>
              <span>WebRTC 2G Mode</span>
            </button>
          </div>

          {bhashiniVoice.transcript && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 font-medium">
              <strong>Bhashini ASR:</strong> {bhashiniVoice.transcript}
            </div>
          )}
        </div>

        {/* 11 Layers List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {TECH_LAYERS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs space-y-1.5 hover:border-[#00434c] transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {item.layer}
                    </span>
                    <h4 className="text-xs font-black text-[#141c2b]">{item.tech}</h4>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Layer {idx + 1}
                </span>
              </div>

              <div className="bg-[#f8fafc] rounded-xl p-2 text-[11px] text-slate-700 space-y-0.5">
                <p className="font-semibold text-[#00434c]">{item.role}</p>
                <p className="text-[10px] text-slate-500">{item.details}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-500 font-medium">MoHFW / NRHM Architecture Standard</span>
          <button
            onClick={() => setShowTechStackModal(false)}
            className="px-4 py-1.5 bg-[#00434c] text-white font-bold rounded-xl text-xs hover:bg-[#0a5c67]"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
