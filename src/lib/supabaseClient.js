// frontend/src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jwmoftfgoiwbfwitcyrf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// ✅ Lazy initialization - só cria o cliente quando realmente necessário
let supabaseInstance = null;

export const getSupabase = async () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      // ✅ Configurações otimizadas para reduzir bundle
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

// ✅ Exporta interface mínima para tree shaking
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
    },
    signUp: async (credentials) => {
      const client = await getSupabase();
      return client.auth.signUp(credentials);
    }
  }
};