/**
 * Django REST Framework (DRF) API Client
 * Connects mobile React Native app with central Django backend & PostgreSQL EMR database.
 */

import { SyncQueueItem } from '../types/techStack';
import { SyncAuditLog, watermelonDb } from './watermelonDb';
import { secureStorage } from './secureStorage';

export interface DrfApiResponse<T> {
  data?: T;
  status: number;
  message: string;
  serverDbTimestamp?: string;
}

export interface StoreForwardSyncResult {
  syncedCount: number;
  failedCount: number;
  postgresTxId: string;
  auditLog: SyncAuditLog;
}

export const drfApiClient = {
  baseUrl: 'https://emr.sanjeevani-net.nhm.gov.in/api/v1',

  async getAuthHeaders(): Promise<Record<string, string>> {
    const session = await secureStorage.getAuthSession();
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : 'Bearer anonymous',
      'X-Client-Platform': 'React-Native/Android-ASHA',
      'X-Client-Db': 'WatermelonDB-SQLite-v3',
    };
  },

  /**
   * JWT Authentication against Django REST Framework /api/v1/auth/jwt/create/
   */
  async loginWithJwt(workerId: string, pin: string): Promise<DrfApiResponse<{ accessToken: string; refreshToken: string; workerName: string }>> {
    // Simulate network delay to DRF server
    await new Promise((res) => setTimeout(res, 400));

    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sanjeevani_${workerId}_${Date.now()}`;
    const refreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_${workerId}_${Date.now()}`;

    const session = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
      workerId,
      workerName: 'मीना ताई कदम (Meena Tai Kadam)',
      subCenter: 'खैरी उपकेंद्र (SC-Khairi, Wardha)',
      role: 'ASHA' as const,
    };

    await secureStorage.saveAuthSession(session);

    return {
      status: 200,
      message: 'लॉगिन यशस्वी झाले (Authentication successful)',
      data: {
        accessToken,
        refreshToken,
        workerName: session.workerName,
      },
      serverDbTimestamp: new Date().toISOString(),
    };
  },

  /**
   * Store-and-Forward Sync Endpoint
   * Flushes WatermelonDB SQLite queue to server-side PostgreSQL
   */
  async uploadStoreAndForwardQueue(
    queue: SyncQueueItem[],
    isOnline: boolean
  ): Promise<StoreForwardSyncResult> {
    const startTime = Date.now();

    if (!isOnline) {
      const offlineLog: SyncAuditLog = {
        id: `log_err_${Date.now()}`,
        timestamp: 'Just now (Failed)',
        batchSize: queue.length,
        durationMs: 40,
        status: 'NETWORK_OFFLINE',
        serverDatabase: 'Central Health EMR Cloud',
        endpoint: `${this.baseUrl}/sync/store-and-forward/`,
        syncedTables: [],
      };
      watermelonDb.addAuditLog(offlineLog);
      throw new Error('डिव्हाइस ऑफलाइन आहे. नेटवर्क आल्यावर आपोआप सिंक होईल. (Device is offline. Changes saved locally.)');
    }

    // Simulate batch transaction to Central Server
    await new Promise((res) => setTimeout(res, 700));

    const syncedIds = queue.map((q) => q.id);
    watermelonDb.clearSyncedItems(syncedIds);

    const postgresTxId = `TX_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const durationMs = Date.now() - startTime;

    const auditLog: SyncAuditLog = {
      id: `log_${Date.now()}`,
      timestamp: 'Just now',
      batchSize: queue.length,
      durationMs,
      status: 'SUCCESS',
      serverDatabase: 'Central Health EMR Cloud',
      endpoint: `${this.baseUrl}/sync/store-and-forward/`,
      syncedTables: ['emr_vitals', 'emr_patients', 'emr_referrals'],
    };

    watermelonDb.addAuditLog(auditLog);

    return {
      syncedCount: queue.length,
      failedCount: 0,
      postgresTxId,
      auditLog,
    };
  },
};
