// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔍 DEBUG - Remova após testar
console.log('🔐 [ENV] URL:', supabaseUrl);
console.log('🔐 [ENV] Key:', supabaseAnonKey ? '✓ Carregada' : '✗ NÃO ENCONTRADA');
console.log('🔐 [ENV] All VITE vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE')));

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ VARIÁVEIS NÃO CARREGADAS!');
  console.error('✅ Verifique:');
  console.error('   1. Variáveis no Netlify (Settings → Environment variables)');
  console.error('   2. Prefixo VITE_ está correto?');
  console.error('   3. Fez "Clear cache and deploy"?');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);