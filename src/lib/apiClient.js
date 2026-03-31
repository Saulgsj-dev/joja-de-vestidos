import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adiciona token se estiver logado
  if (session) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro na requisição');
  }

  return response.json();
}

// Função específica para upload de imagem (FormData)
export async function uploadImage(file) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const formData = new FormData();
  formData.append('file', file);

  // ✅ Apenas UM const response aqui
  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro no upload');
  }

  return response.json();
}