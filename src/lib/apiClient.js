// frontend/src/lib/apiClient.js

// 🔹 URL base da API (Cloudflare Worker)
const API_BASE_URL = 'https://saas-vestidos-api.webpagesuporte.workers.dev';

/**
 * ✅ FUNÇÃO LAZY: Pega o token de autenticação apenas quando necessário
 * Isso evita que o Supabase seja carregado em páginas públicas
 */
async function getAuthToken() {
  try {
    // Lazy import - carrega o módulo do Supabase apenas quando esta função é chamada
    const { supabase } = await import('./supabaseClient');
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (e) {
    // Se falhar (ex: página pública sem auth), retorna null silenciosamente
    console.warn('⚠️ Auth não disponível:', e);
    return null;
  }
}

/**
 * Faz uma requisição API genérica com autenticação automática
 * @param {string} endpoint - Rota da API (ex: '/api/config')
 * @param {Object} options - Opções do fetch (method, body, headers, etc)
 * @returns {Promise<any>} - Resposta da API em JSON
 */
export async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // ✅ Pega token dinamicamente (só carrega Supabase se necessário)
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  // Tratamento de erro com fallback seguro
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
  // ✅ Lazy auth - só carrega Supabase quando esta função é chamada
  const token = await getAuthToken();
  
  if (!token) {
    console.error('❌ [uploadImage] Usuário não autenticado');
    throw new Error('Não autorizado. Faça login para continuar.');
  }

  // Validações básicas do arquivo
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
        'Authorization': `Bearer ${token}`,
        // NÃO definir Content-Type para FormData - o browser define automaticamente
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
 * @param {string} fileName - Nome do arquivo no formato 'userId/uuid.webp'
 * @returns {Promise<{success: boolean, fileName: string}>}
 */
export async function deleteImage(fileName) {
  // ✅ Lazy auth
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Não autorizado');
  }

  const encodedFileName = encodeURIComponent(fileName);
  
  const deleteResponse = await fetch(`${API_BASE_URL}/api/upload/${encodedFileName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
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
 * ✅ Esta função NÃO carrega Supabase - ideal para páginas públicas
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
  // ✅ Lazy auth - só carrega Supabase quando necessário
  const token = await getAuthToken();
  
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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
  // ✅ Lazy auth
  const token = await getAuthToken();
  return !!token;
}

/**
 * Obtém o token de acesso atual (útil para integrações externas)
 * @returns {Promise<string|null>}
 */
export async function getAccessToken() {
  // ✅ Lazy auth
  return await getAuthToken();
}