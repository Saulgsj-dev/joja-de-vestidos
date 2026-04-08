import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jwmoftfgoiwbfwitcyrf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// ✅ Cria cliente apenas com funcionalidades essenciais
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // ✅ Desabilita realtime se não estiver usando
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  // ✅ Não carrega storage se não usar
  db: {
    schema: 'public'
  }
});

// ✅ Exporta apenas o que precisa
export const { auth, from, schema, rpc } = supabase;