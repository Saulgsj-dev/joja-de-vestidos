import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jwmoftfgoiwbfwitcyrf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

let supabaseInstance = null;

export const getSupabase = async () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
      db: {
        schema: 'public'
      }
    });
  }
  return supabaseInstance;
};

export const supabase = {
  auth: {
    getSession: async () => {
      const client = await getSupabase();
      return client.auth.getSession();
    },
    onAuthStateChange: (callback) => {
      return getSupabase().then(client => 
        client.auth.onAuthStateChange(callback)
      );
    },
    signInWithPassword: async (credentials) => {
      const client = await getSupabase();
      return client.auth.signInWithPassword(credentials);
    },
    signOut: async () => {
      const client = await getSupabase();
      return client.auth.signOut();
    }
  }
};