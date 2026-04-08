// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔍 Debug: verifique no console do navegador
console.log('🔐 Supabase URL:', supabaseUrl ? '✓ Carregada' : '✗ NÃO ENCONTRADA');
console.log('🔐 Supabase Anon Key:', supabaseAnonKey ? '✓ Carregada' : '✗ NÃO ENCONTRADA');

// 🚨 Validação para evitar erros silenciosos
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO CRÍTICO: Variáveis de ambiente do Supabase não encontradas!');
  console.error('Verifique:');
  console.error('  1. O arquivo .env está na raiz do projeto?');
  console.error('  2. As variáveis começam com VITE_?');
  console.error('  3. Você reiniciou o servidor após alterar o .env?');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);