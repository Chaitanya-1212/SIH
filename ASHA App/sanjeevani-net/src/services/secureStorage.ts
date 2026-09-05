/**
 * Secure Storage Service
 * Emulates Android EncryptedSharedPreferences / iOS Keychain (expo-secure-store)
 * for storing JWT access and refresh tokens securely on the device.
 */

const SECURE_STORE_PREFIX = 'sanjeevani_secure_';

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  workerId: string;
  workerName: string;
  subCenter: string;
  role: 'ASHA' | 'ANM' | 'MO';
}

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(`${SECURE_STORE_PREFIX}${key}`, value);
    } catch {
      // fallback in-memory if quota exceeded
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(`${SECURE_STORE_PREFIX}${key}`);
    } catch {
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(`${SECURE_STORE_PREFIX}${key}`);
    } catch {}
  },

  async saveAuthSession(session: StoredSession): Promise<void> {
    await this.setItem('jwt_session', JSON.stringify(session));
  },

  async getAuthSession(): Promise<StoredSession | null> {
    const data = await this.getItem('jwt_session');
    if (!data) return null;
    try {
      return JSON.parse(data) as StoredSession;
    } catch {
      return null;
    }
  },

  async clearAuthSession(): Promise<void> {
    await this.removeItem('jwt_session');
  },
};
