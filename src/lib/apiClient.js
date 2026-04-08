// frontend/src/lib/apiClient.js
import { supabase } from './supabaseClient';

// 🔹 URL base da API (Cloudflare Worker)
const API_BASE_URL = 'https://saas-vestidos-api.webpagesuporte.workers.dev';

/**
 * Faz uma requisição API genérica com autenticação automática
 * @param {string} endpoint - Rota da API (ex: '/api/config')
 * @param {Object} options - Opções do fetch (method, body, headers, etc)
 * @returns {Promise<any>} - Resposta da API em JSON
 */
export async function apiRequest(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Adiciona token de autenticação se existir sessão
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    // Garante que credentials sejam incluídas se necessário
    credentials: 'same-origin',
  });

  // Tratamento de erro com fallback seguro
  if (!response.ok) {
    let errorData = { error: 'Erro na requisição' };
    try {
      errorData = await response.json();
    } catch {
      // Se não conseguir parsear JSON, usa mensagem genérica
      errorData = { error: `Erro ${response.status}: ${response.statusText}` };
    }
    console.error('❌ [apiRequest] Erro:', errorData);
    throw new Error(errorData.error || `Erro ${response.status}`);
  }

  // Retorna JSON ou objeto vazio se resposta estiver vazia
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

/**
 * Faz upload de imagem com autenticação
 * @param {File} file - Arquivo de imagem (já pode estar convertido para WebP)
 * @param {Object} options - Opções adicionais (ex: onProgress para barra de progresso)
 * @returns {Promise<{url: string, fileName: string, contentType: string, size: number}>}
 */
export async function uploadImage(file, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    console.error('❌ [uploadImage] Usuário não autenticado');
    throw new Error('Não autorizado. Faça login para continuar.');
  }

  // Validações básicas do arquivo
  if (!file || !(file instanceof File)) {
    throw new Error('Arquivo inválido');
  }

  // Log para debug (útil em desenvolvimento)
  console.log(`📤 [uploadImage] Iniciando: ${file.name} (${formatBytes(file.size)})`);

  const formData = new FormData();
  formData.append('file', file, file.name);

  // Callback de progresso (opcional - para futura implementação)
  if (options.onProgress && typeof options.onProgress === 'function') {
    options.onProgress(10); // 10% = começando upload
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        // NÃO definir Content-Type para FormData - o browser define automaticamente com boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('❌ [uploadImage] Erro na resposta:', error);
      throw new Error(error.error || `Erro ${response.status} no upload`);
    }

    const result = await response.json();
    
    if (options.onProgress) {
      options.onProgress(100); // 100% = concluído
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
 * @param {string} fileName - Nome do arquivo no formato 'userId/uuid.webp'
 * @returns {Promise<{success: boolean, fileName: string}>}
 */
export async function deleteImage(fileName) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('Não autorizado');
  }

  // Codifica o nome do arquivo para URL-safe
  const encodedFileName = encodeURIComponent(fileName);
  
  const response = await fetch(`${API_BASE_URL}/api/upload/${encodedFileName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Erro ${response.status} ao deletar`);
  }

  return response.json();
}

/**
 * Busca perfil público por slug (rota pública, sem autenticação)
 * @param {string} slug - Slug da loja (ex: 'minha-loja')
 * @returns {Promise<{id: string, nome_loja: string, slug: string, ativo: number, plano: string}>}
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
 * @param {string} userId - ID do usuário no Supabase
 * @returns {Promise<{id: string, nome_loja: string, slug: string, ativo: number, plano: string}>}
 */
export async function getProfileByUserId(userId) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {};
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/api/profile/by-user/${userId}`, {
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Erro ${response.status}`);
  }
  
  return response.json();
}

/**
 * Formata tamanho de arquivo em bytes para string legível
 * @param {number} bytes 
 * @returns {string}
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
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session?.access_token;
}

/**
 * Obtém o token de acesso atual (útil para integrações externas)
 * @returns {Promise<string|null>}
 */
export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}