import { AppScreen, Beneficiary, Facility, Language, ReferralTimelineStep, VitalsData } from '../types';

export interface JwtToken {
  access: string;
  refresh: string;
  expiresAt: number;
}

export interface SyncQueueItem {
  id: string;
  table: 'beneficiaries' | 'vitals' | 'referrals' | 'assessments';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
  createdAt: string;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'SYNCED';
  retryCount: number;
  errorMessage?: string;
}

export interface NetInfoState {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'none';
  tier: '4G' | '2G_EDGE' | 'OFFLINE';
  latencyMs: number;
  downloadKbps: number;
}

export interface WebRtcStats {
  iceConnectionState: 'new' | 'checking' | 'connected' | 'completed' | 'failed';
  bitrateKbps: number;
  packetLossPercent: number;
  latencyMs: number;
  resolution: string;
  isAudioOnlyFallback: boolean;
}

export interface BhashiniVoiceState {
  isListening: boolean;
  transcript: string;
  detectedLanguage: 'mr' | 'hi' | 'en';
  isSpeaking: boolean;
}
