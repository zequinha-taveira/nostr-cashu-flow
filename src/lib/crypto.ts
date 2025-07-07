import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDKey } from '@scure/bip32';
import { sha256 } from '@noble/hashes/sha256';
import { getPublicKey } from '@noble/secp256k1';
import { generateSecretKey, getPublicKey as nostrGetPublicKey, nip19 } from 'nostr-tools';

export interface WalletKeys {
  seed: Uint8Array;
  mnemonic: string;
  masterKey: HDKey;
  lightningKey: HDKey;
  ecashKey: HDKey;
  nostrPrivateKey: Uint8Array;
  nostrPublicKey: string;
  npub: string;
  nsec: string;
}

export interface EncryptedWallet {
  encryptedData: string;
  salt: string;
  iv: string;
}

/**
 * Generate a new wallet with BIP39 mnemonic and derived keys
 */
export async function generateWallet(wordCount: 12 | 24 = 12): Promise<WalletKeys> {
  const strength = wordCount === 12 ? 128 : 256;
  const mnemonic = bip39.generateMnemonic(wordlist, strength);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  
  const masterKey = HDKey.fromMasterSeed(seed);
  
  // Lightning Network key derivation (BIP44: m/44'/0'/0'/0/0)
  const lightningKey = masterKey.derive("m/44'/0'/0'/0/0");
  
  // eCash key derivation (BIP44: m/44'/1'/0'/0/0)
  const ecashKey = masterKey.derive("m/44'/1'/0'/0/0");
  
  // Nostr key derivation (BIP44: m/44'/1237'/0'/0/0 - 1237 is Nostr's registered coin type)
  const nostrDerivationKey = masterKey.derive("m/44'/1237'/0'/0/0");
  const nostrPrivateKey = nostrDerivationKey.privateKey!;
  const nostrPublicKey = nostrGetPublicKey(nostrPrivateKey);
  
  const npub = nip19.npubEncode(nostrPublicKey);
  const nsec = nip19.nsecEncode(nostrPrivateKey);
  
  return {
    seed,
    mnemonic,
    masterKey,
    lightningKey,
    ecashKey,
    nostrPrivateKey,
    nostrPublicKey,
    npub,
    nsec
  };
}

/**
 * Restore wallet from BIP39 mnemonic
 */
export async function restoreWallet(mnemonic: string): Promise<WalletKeys> {
  if (!bip39.validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic phrase');
  }
  
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const masterKey = HDKey.fromMasterSeed(seed);
  
  const lightningKey = masterKey.derive("m/44'/0'/0'/0/0");
  const ecashKey = masterKey.derive("m/44'/1'/0'/0/0");
  
  const nostrDerivationKey = masterKey.derive("m/44'/1237'/0'/0/0");
  const nostrPrivateKey = nostrDerivationKey.privateKey!;
  const nostrPublicKey = nostrGetPublicKey(nostrPrivateKey);
  
  const npub = nip19.npubEncode(nostrPublicKey);
  const nsec = nip19.nsecEncode(nostrPrivateKey);
  
  return {
    seed,
    mnemonic,
    masterKey,
    lightningKey,
    ecashKey,
    nostrPrivateKey,
    nostrPublicKey,
    npub,
    nsec
  };
}

/**
 * Encrypt wallet data using AES-256-GCM with password-derived key
 */
export async function encryptWallet(walletKeys: WalletKeys, password: string): Promise<EncryptedWallet> {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Derive key using PBKDF2 (Argon2 would be better but isn't available in browsers)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  const walletData = JSON.stringify({
    mnemonic: walletKeys.mnemonic,
    nostrPrivateKey: Array.from(walletKeys.nostrPrivateKey),
    npub: walletKeys.npub,
    nsec: walletKeys.nsec
  });
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    new TextEncoder().encode(walletData)
  );
  
  return {
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
    salt: btoa(String.fromCharCode(...salt)),
    iv: btoa(String.fromCharCode(...iv))
  };
}

/**
 * Decrypt wallet data
 */
export async function decryptWallet(encryptedWallet: EncryptedWallet, password: string): Promise<WalletKeys> {
  const salt = new Uint8Array(atob(encryptedWallet.salt).split('').map(c => c.charCodeAt(0)));
  const iv = new Uint8Array(atob(encryptedWallet.iv).split('').map(c => c.charCodeAt(0)));
  const encryptedData = new Uint8Array(atob(encryptedWallet.encryptedData).split('').map(c => c.charCodeAt(0)));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedData
    );
    
    const walletData = JSON.parse(new TextDecoder().decode(decryptedBuffer));
    
    // Restore wallet from mnemonic
    return await restoreWallet(walletData.mnemonic);
  } catch (error) {
    throw new Error('Failed to decrypt wallet - incorrect password');
  }
}

/**
 * Generate a secure random password for wallet encryption
 */
export function generateSecurePassword(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}