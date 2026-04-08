// frontend/src/lib/apiClient.js
import { supabase } from './supabaseClient';

// ✅ CORREÇÃO: Usando variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://saas-vestidos-api.webpagesuporte.workers.dev';

// 🔍 Debug (remova após funcionar)
if (import.meta.env.DEV) {
  console.log('🌐 API Base URL:', API_BASE_URL);
}

/**
 * Faz uma requisição API genérica com autenticação automática
 */
export async function apiRequest(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  if (!response.ok) {
    let errorData = { error: 'Erro na requisição' };
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: `Erro ${response.status}: ${response.statusText}` };
    }
    console.error('❌ [apiRequest] Erro:', errorData);
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

/**
 * Faz upload de imagem com autenticação
 */
export async function uploadImage(file, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    console.error('❌ [uploadImage] Usuário não autenticado');
    throw new Error('Não autorizado. Faça login para continuar.');
  }

  if (!file || !(file instanceof File)) {
    throw new Error('Arquivo inválido');
  }

  console.log(`📤 [uploadImage] Iniciando: ${file.name} (${formatBytes(file.size)})`);

  const formData = new FormData();
  formData.append('file', file, file.name);

  if (options.onProgress && typeof options.onProgress === 'function') {
    options.onProgress(10);
  }

  try {
    const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json().catch(() => ({}));
      console.error('❌ [uploadImage] Erro na resposta:', error);
      throw new Error(error.error || `Erro ${uploadResponse.status} no upload`);
    }

    const result = await uploadResponse.json();
    
    if (options.onProgress) {
      options.onProgress(100);
    }
    
    console.log(`✅ [uploadImage] Concluído: ${result.url}`);
    return result;
    
  } catch (error) {
    console.error('❌ [uploadImage] Exceção:', error);
    throw error;
  }
}

/**
 * Deleta uma imagem do bucket R2 via API
 */
export async function deleteImage(fileName) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('Não autorizado');
  }

  const encodedFileName = encodeURIComponent(fileName);
  
  const deleteResponse = await fetch(`${API_BASE_URL}/api/upload/${encodedFileName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!deleteResponse.ok) {
    const error = await deleteResponse.json().catch(() => ({}));
    throw new Error(error.error || `Erro ${deleteResponse.status} ao deletar`);
  }

  return deleteResponse.json();
}

/**
 * Busca perfil público por slug (rota pública, SEM autenticação)
 */
export async function getProfileBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}/api/profile/${slug}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Site não encontrado');
    }
    throw new Error(`Erro ${response.status} ao carregar perfil`);
  }
  
  return response.json();
}

/**
 * Busca perfil por ID de usuário (requer autenticação)
 */
export async function getProfileByUserId(userId) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {};
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  const profileResponse = await fetch(`${API_BASE_URL}/api/profile/by-user/${userId}`, {
    headers,
  });
  
  if (!profileResponse.ok) {
    const error = await profileResponse.json().catch(() => ({}));
    throw new Error(error.error || `Erro ${profileResponse.status}`);
  }
  
  return profileResponse.json();
}

/**
 * Formata tamanho de arquivo em bytes
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Verifica se o usuário está autenticado
 */
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session?.access_token;
}

/**
 * Obtém o token de acesso atual
 */
export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}