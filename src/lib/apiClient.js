// src/lib/apiClient.js
import { supabase } from './supabaseClient';

const API_BASE_URL = 'https://saas-vestidos-api.webpagesuporte.workers.dev';

export async function apiRequest(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adiciona o token JWT se existir sessão
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro na requisição' }));
    throw new Error(error.error || `Erro ${response.status}`);
  }

  return response.json();
}

export async function uploadImage(file) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('Não autorizado');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro no upload');
  }

  return response.json();
}