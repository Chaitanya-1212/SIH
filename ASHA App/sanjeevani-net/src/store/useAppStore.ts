/**
 * Zustand Global App State Store
 * Manages reactive state across React Native UI, WatermelonDB SQLite,
 * NetInfo network status, Bhashini voice, and WebRTC streaming.
 */

import { create } from 'zustand';
import { AppScreen, Beneficiary, Language, VitalsData } from '../types';
import { NetInfoState, SyncQueueItem, WebRtcStats, BhashiniVoiceState } from '../types/techStack';
import { INITIAL_BENEFICIARY, OTHER_BENEFICIARIES } from '../data/mockData';
import { watermelonDb } from '../services/watermelonDb';
import { drfApiClient } from '../services/apiClient';
import { secureStorage, StoredSession } from '../services/secureStorage';
import { bhashiniService, BHASHINI_DICTIONARY } from '../services/bhashiniService';

export interface AppState {
  // Navigation & Screen
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;

  // Language & Bhashini
  language: Language;
  setLanguage: (lang: Language) => void;
  bhashiniVoice: BhashiniVoiceState;
  startBhashiniVoiceInput: () => Promise<void>;
  speakVernacular: (text?: string) => Promise<void>;
  stopSpeaking: () => void;

  // Beneficiary Data (WatermelonDB + SQLite)
  beneficiary: Beneficiary;
  allBeneficiaries: Beneficiary[];
  setBeneficiary: (beneficiary: Beneficiary) => void;
  updateBeneficiaryVitals: (vitals: VitalsData, notes?: string) => void;

  // NetInfo Network Detection
  netInfo: NetInfoState;
  setNetworkTier: (tier: '4G' | '2G_EDGE' | 'OFFLINE') => void;

  // Store-and-Forward Sync (WatermelonDB -> DRF -> PostgreSQL)
  syncQueue: SyncQueueItem[];
  isSyncing: boolean;
  syncSuccessMessage: string | null;
  triggerStoreAndForwardSync: () => Promise<void>;
  showSyncDrawer: boolean;
  setShowSyncDrawer: (show: boolean) => void;

  // Authentication (JWT + Secure Storage)
  jwtSession: StoredSession | null;
  loginWithJwt: (workerId: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // WebRTC Teleconsultation
  webrtcStats: WebRtcStats;
  showTeleconsultModal: boolean;
  setShowTeleconsultModal: (show: boolean) => void;
  toggleLowBandwidthWebRtc: () => void;

  // Modals
  showWhatsAppModal: boolean;
  setShowWhatsAppModal: (show: boolean) => void;
  showTechStackModal: boolean;
  setShowTechStackModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentScreen: 'vitals',
  setScreen: (screen) => set({ currentScreen: screen }),

  // Language
  language: 'hi',
  setLanguage: (lang) => {
    set({ language: lang });
    // Also update Bhashini state
    set((state) => ({
      bhashiniVoice: { ...state.bhashiniVoice, detectedLanguage: lang },
    }));
  },
  bhashiniVoice: {
    isListening: false,
    transcript: '',
    detectedLanguage: 'hi',
    isSpeaking: false,
  },
  startBhashiniVoiceInput: async () => {
    const { language } = get();
    set((state) => ({
      bhashiniVoice: { ...state.bhashiniVoice, isListening: true, transcript: 'ऐकतोय... / सुन रहे हैं... (Listening...)' },
    }));

    try {
      const result = await bhashiniService.simulateAsrListening(language);
      set((state) => ({
        bhashiniVoice: {
          ...state.bhashiniVoice,
          isListening: false,
          transcript: result.transcript,
        },
      }));

      // If vitals were extracted, auto-update
      if (result.extractedValues?.systolic && result.extractedValues?.diastolic) {
        const currentVitals = get().beneficiary.vitals;
        get().updateBeneficiaryVitals(
          {
            ...currentVitals,
            systolic: result.extractedValues.systolic,
            diastolic: result.extractedValues.diastolic,
            recordedAt: 'Bhashini Voice Input',
          },
          result.extractedValues.symptoms
        );
      }
    } catch {
      set((state) => ({
        bhashiniVoice: { ...state.bhashiniVoice, isListening: false },
      }));
    }
  },
  speakVernacular: async (text) => {
    const { language, beneficiary } = get();
    const prompt =
      text ||
      `${BHASHINI_DICTIONARY[language].highRiskAlert} ${beneficiary.name}, रक्तदाब ${beneficiary.vitals.systolic}/${beneficiary.vitals.diastolic}`;

    set((state) => ({
      bhashiniVoice: { ...state.bhashiniVoice, isSpeaking: true },
    }));

    await bhashiniService.speakText(prompt, language);

    set((state) => ({
      bhashiniVoice: { ...state.bhashiniVoice, isSpeaking: false },
    }));
  },
  stopSpeaking: () => {
    bhashiniService.stopSpeaking();
    set((state) => ({
      bhashiniVoice: { ...state.bhashiniVoice, isSpeaking: false },
    }));
  },

  // Beneficiary (WatermelonDB + SQLite)
  beneficiary: INITIAL_BENEFICIARY,
  allBeneficiaries: watermelonDb.getBeneficiaries(),
  setBeneficiary: (beneficiary) => set({ beneficiary }),
  updateBeneficiaryVitals: (newVitals, notes) => {
    const { beneficiary } = get();
    const { updatedBeneficiary } = watermelonDb.updateBeneficiaryVitals(
      beneficiary.id,
      newVitals,
      notes
    );

    set({
      beneficiary: updatedBeneficiary,
      allBeneficiaries: watermelonDb.getBeneficiaries(),
      syncQueue: watermelonDb.getSyncQueue(),
    });

    // Auto-sync if online with high speed
    if (get().netInfo.isConnected && get().netInfo.tier === '4G') {
      get().triggerStoreAndForwardSync();
    }
  },

  // NetInfo
  netInfo: {
    isConnected: true,
    type: 'cellular',
    tier: '4G',
    latencyMs: 38,
    downloadKbps: 18400,
  },
  setNetworkTier: (tier) => {
    let stateUpdate: Partial<NetInfoState>;

    if (tier === 'OFFLINE') {
      stateUpdate = {
        isConnected: false,
        type: 'none',
        tier: 'OFFLINE',
        latencyMs: 0,
        downloadKbps: 0,
      };
    } else if (tier === '2G_EDGE') {
      stateUpdate = {
        isConnected: true,
        type: 'cellular',
        tier: '2G_EDGE',
        latencyMs: 380,
        downloadKbps: 64, // 64 kbps rural 2G
      };
    } else {
      stateUpdate = {
        isConnected: true,
        type: 'cellular',
        tier: '4G',
        latencyMs: 35,
        downloadKbps: 18400,
      };
    }

    set((state) => ({
      netInfo: { ...state.netInfo, ...stateUpdate },
      // Auto-adapt WebRTC on 2G EDGE
      webrtcStats: {
        ...state.webrtcStats,
        isAudioOnlyFallback: tier === '2G_EDGE',
        bitrateKbps: tier === '2G_EDGE' ? 48 : 850,
        resolution: tier === '2G_EDGE' ? 'OPUS Audio Only' : '720p HD (30fps)',
      },
    }));

    // If transitioned back online, trigger Store-and-Forward sync!
    if (tier !== 'OFFLINE' && get().syncQueue.length > 0) {
      setTimeout(() => {
        get().triggerStoreAndForwardSync();
      }, 500);
    }
  },

  // Store-and-Forward Sync
  syncQueue: watermelonDb.getSyncQueue(),
  isSyncing: false,
  syncSuccessMessage: null,
  triggerStoreAndForwardSync: async () => {
    const { syncQueue, netInfo } = get();
    if (syncQueue.length === 0) return;

    set({ isSyncing: true, syncSuccessMessage: null });
    try {
      const result = await drfApiClient.uploadStoreAndForwardQueue(syncQueue, netInfo.isConnected);
      set({
        isSyncing: false,
        syncQueue: watermelonDb.getSyncQueue(),
        syncSuccessMessage: `✓ Synced ${result.syncedCount} records to PostgreSQL (Tx: ${result.postgresTxId})`,
      });
      setTimeout(() => {
        set({ syncSuccessMessage: null });
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      set({ isSyncing: false, syncSuccessMessage: `⚠️ ${msg}` });
    }
  },
  showSyncDrawer: false,
  setShowSyncDrawer: (show) => set({ showSyncDrawer: show }),

  // Authentication (JWT + Secure Storage)
  jwtSession: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sanjeevani_sample_token',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample_refresh',
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    workerId: 'ASHA-4412',
    workerName: 'मीना ताई कदम (Meena Tai Kadam)',
    subCenter: 'खैरी उपकेंद्र (SC-Khairi, Wardha)',
    role: 'ASHA',
  },
  loginWithJwt: async (workerId, pin) => {
    try {
      const res = await drfApiClient.loginWithJwt(workerId, pin);
      const session = await secureStorage.getAuthSession();
      if (session) {
        set({ jwtSession: session, currentScreen: 'beneficiary' });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  logout: async () => {
    await secureStorage.clearAuthSession();
    set({ jwtSession: null, currentScreen: 'login' });
  },

  // WebRTC Teleconsultation
  webrtcStats: {
    iceConnectionState: 'connected',
    bitrateKbps: 780,
    packetLossPercent: 0.2,
    latencyMs: 42,
    resolution: '720p HD (30fps)',
    isAudioOnlyFallback: false,
  },
  showTeleconsultModal: false,
  setShowTeleconsultModal: (show) => set({ showTeleconsultModal: show }),
  toggleLowBandwidthWebRtc: () => {
    set((state) => {
      const isCurrentlyAudio = state.webrtcStats.isAudioOnlyFallback;
      return {
        webrtcStats: {
          ...state.webrtcStats,
          isAudioOnlyFallback: !isCurrentlyAudio,
          bitrateKbps: !isCurrentlyAudio ? 48 : 780,
          resolution: !isCurrentlyAudio ? 'OPUS Audio Only (Low Bandwidth)' : '720p HD (30fps)',
        },
      };
    });
  },

  // Modals
  showWhatsAppModal: false,
  setShowWhatsAppModal: (show) => set({ showWhatsAppModal: show }),
  showTechStackModal: false,
  setShowTechStackModal: (show) => set({ showTechStackModal: show }),
}));
