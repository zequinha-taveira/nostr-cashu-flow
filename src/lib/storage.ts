import { EncryptedWallet, WalletKeys } from './crypto';

export interface WalletStorage {
  encryptedWallet?: EncryptedWallet;
  preferences: {
    prioritizePrivacy: boolean;
    prioritizeSpeed: boolean;
    defaultCurrency: 'sats' | 'btc';
  };
  lastBackup?: string;
}

const STORAGE_KEY = 'bitcoin_wallet_storage';

/**
 * Save wallet data to localStorage
 */
export function saveWalletStorage(storage: WalletStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    throw new Error('Failed to save wallet data to storage');
  }
}

/**
 * Load wallet data from localStorage
 */
export function loadWalletStorage(): WalletStorage | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load wallet data from storage:', error);
    return null;
  }
}

/**
 * Clear all wallet data from storage
 */
export function clearWalletStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if wallet exists in storage
 */
export function hasStoredWallet(): boolean {
  const storage = loadWalletStorage();
  return storage?.encryptedWallet != null;
}

/**
 * Update wallet preferences
 */
export function updatePreferences(preferences: Partial<WalletStorage['preferences']>): void {
  const storage = loadWalletStorage() || {
    preferences: {
      prioritizePrivacy: true,
      prioritizeSpeed: false,
      defaultCurrency: 'sats' as const
    }
  };
  
  storage.preferences = { ...storage.preferences, ...preferences };
  saveWalletStorage(storage);
}

/**
 * Get current preferences
 */
export function getPreferences(): WalletStorage['preferences'] {
  const storage = loadWalletStorage();
  return storage?.preferences || {
    prioritizePrivacy: true,
    prioritizeSpeed: false,
    defaultCurrency: 'sats'
  };
}