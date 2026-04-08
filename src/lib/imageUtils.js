// frontend/src/lib/imageUtils.js

/**
 * Converte uma imagem para WebP usando Canvas API
 * @param {File} file - Arquivo de imagem original
 * @param {Object} options - Opções de conversão
 * @returns {Promise<File>} - Promise com o arquivo WebP convertido
 */
export async function convertToWebP(file, options = {}) {
  const {
    quality = 0.85,           // Qualidade: 0.1 a 1.0
    maxWidth = 1920,          // Largura máxima da imagem
    maxHeight = 1920,         // Altura máxima da imagem
    onProgress = null         // Callback para progresso (opcional)
  } = options;

  return new Promise((resolve, reject) => {
    // Se já for WebP e estiver dentro dos limites, pode pular conversão
    if (file.type === 'image/webp' && file.size <= 2 * 1024 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Liberar URL do objeto
      URL.revokeObjectURL(objectUrl);

      // Calcular novas dimensões mantendo aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Criar canvas com as dimensões calculadas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      // ✅ MANTÉM TRANSPARÊNCIA - Não adiciona fundo branco
      // Canvas já começa transparente por padrão
      ctx.drawImage(img, 0, 0, width, height);

      // Converter para WebP (com suporte a transparência)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha na conversão para WebP'));
            return;
          }

          // Criar novo arquivo com nome .webp
          const webpFileName = file.name.replace(/\.[^.]+$/, '') + '.webp';
          const webpFile = new File([blob], webpFileName, {
            type: 'image/webp',
            lastModified: Date.now()
          });

          // Log de otimização (útil para debug)
          const originalSize = (file.size / 1024).toFixed(1);
          const newSize = (webpFile.size / 1024).toFixed(1);
          const savings = ((1 - webpFile.size / file.size) * 100).toFixed(1);
          console.log(`🖼️ Otimização: ${originalSize}KB → ${newSize}KB (${savings}% menor)`);

          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Erro ao carregar imagem: ' + error.message));
    };

    // Trigger load
    img.src = objectUrl;
  });
}

/**
 * Valida se o arquivo é uma imagem suportada
 * @param {File} file 
 * @returns {boolean}
 */
export function isValidImage(file) {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  return allowedTypes.includes(file.type);
}

/**
 * Formata tamanho de arquivo para exibição
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}