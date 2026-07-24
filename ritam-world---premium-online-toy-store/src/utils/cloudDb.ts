/// <reference types="vite/client" />

export interface CloudDbConfig {
  provider: 'supabase' | 'firebase' | 'custom_rest' | 'local';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseAppId?: string;
  customApiEndpoint?: string;
  autoSync: boolean;
  lastConnectedAt?: string;
}

const CONFIG_STORAGE_KEY = 'ritam_world_db_config';

export function getCloudDbConfig(): CloudDbConfig {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse Cloud DB Config from localStorage', e);
  }

  // Default configuration pre-connected to Supabase
  const DEFAULT_SUPABASE_URL = 'https://etlkfhwqavttxcjmzexl.supabase.co';
  const DEFAULT_SUPABASE_KEY = 'sb_publishable_iFEVMGqkUGsvSGRHnzVK1A_Rz1vvNz6';

  // Fallback to environment variables or pre-set Supabase credentials
  const envObj = (import.meta as any).env || {};
  const envSupabaseUrl = envObj.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envSupabaseKey = envObj.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  const envFirebaseProjectId = envObj.VITE_FIREBASE_PROJECT_ID;

  if (envSupabaseUrl && envSupabaseKey) {
    return {
      provider: 'supabase',
      supabaseUrl: envSupabaseUrl,
      supabaseAnonKey: envSupabaseKey,
      autoSync: true,
    };
  }

  if (envFirebaseProjectId) {
    return {
      provider: 'firebase',
      firebaseApiKey: envObj.VITE_FIREBASE_API_KEY || '',
      firebaseAuthDomain: envObj.VITE_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: envFirebaseProjectId,
      firebaseAppId: envObj.VITE_FIREBASE_APP_ID || '',
      autoSync: true,
    };
  }

  return {
    provider: 'local',
    autoSync: true,
  };
}

export function saveCloudDbConfig(config: CloudDbConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Cloud DB Config to localStorage', e);
  }
}

export async function testCloudDbConnection(config: CloudDbConfig): Promise<{ success: boolean; message: string }> {
  try {
    if (config.provider === 'supabase') {
      if (!config.supabaseUrl || !config.supabaseAnonKey) {
        return { success: false, message: 'Supabase URL এবং Anon Key অবশ্যই প্রদান করতে হবে' };
      }
      const response = await fetch(`${config.supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
        },
      });
      if (response.ok || response.status === 404 || response.status === 200) {
        return { success: true, message: 'Supabase ক্লাউড ডাটাবেজ সফলভাবে কানেক্ট করা হয়েছে!' };
      }
      return { success: false, message: `Supabase কানেকশন ব্যর্থ হয়েছে (Status: ${response.status})` };
    }

    if (config.provider === 'firebase') {
      if (!config.firebaseProjectId) {
        return { success: false, message: 'Firebase Project ID প্রদান করতে হবে' };
      }
      return { success: true, message: 'Firebase Firestore ডাটাবেজ কনফিগারেশন সংরক্ষিত হয়েছে!' };
    }

    if (config.provider === 'custom_rest') {
      if (!config.customApiEndpoint) {
        return { success: false, message: 'Custom API Endpoint প্রদান করুন' };
      }
      const response = await fetch(config.customApiEndpoint, { method: 'GET' });
      if (response.ok) {
        return { success: true, message: 'Custom REST API সফলভাবে কানেক্ট হয়েছে!' };
      }
      return { success: false, message: 'API এ্যান্ডপয়েন্ট রেসপন্স করেনি' };
    }

    return { success: true, message: 'লোকাল অটো-সিঙ্ক ডাটাবেজ একটিভ করা হয়েছে।' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'ডাটাবেজ টেস্ট কানেকশন ব্যর্থ হয়েছে' };
  }
}
