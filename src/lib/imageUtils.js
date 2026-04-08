// frontend/src/components/admin/ImageUploader.jsx
import { useState } from 'react';
import { uploadImage } from '../../lib/apiClient';
import { convertToWebP, isValidImage, formatFileSize } from '../../lib/imageUtils';

export default function ImageUploader({ 
  value, 
  onChange, 
  onRemove, 
  label, 
  maxSize = 10,        // MB
  quality = 0.85,      // Qualidade WebP (0.1 a 1.0)
  maxWidth = 1920,     // Dimensão máxima
  showProgress = true 
}) {
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setUploading(false);
    setConverting(false);

    // ✅ Validação: tipo de arquivo
    if (!isValidImage(file)) {
      setError('❌ Formato não suportado. Use JPG, PNG, WebP ou GIF.');
      return;
    }

    // ✅ Validação: tamanho máximo
    if (file.size > maxSize * 1024 * 1024) {
      setError(`❌ Imagem muito grande. Máximo ${maxSize}MB.`);
      return;
    }

    try {
      // 🔄 Passo 1: Converter para WebP (mantendo transparência)
      setConverting(true);
      const optimizedFile = await convertToWebP(file, {
        quality,
        maxWidth,
        maxHeight: maxWidth
      });
      setConverting(false);

      // 📤 Passo 2: Fazer upload do arquivo otimizado
      setUploading(true);
      const { url } = await uploadImage(optimizedFile);
      
      // ✅ Sucesso
      onChange(url);
      
      // Feedback visual
      if (showProgress) {
        const savings = ((1 - optimizedFile.size / file.size) * 100).toFixed(0);
        alert(`✅ Imagem otimizada e enviada!\n📉 Economia: ${savings}% no tamanho\n✨ Transparência preservada!`);
      }
      
    } catch (err) {
      console.error('❌ Erro no upload:', err);
      setError('❌ Erro: ' + (err.message || 'Falha ao processar imagem'));
    } finally {
      setConverting(false);
      setUploading(false);
    }
  };

  // Limpar input ao remover
  const handleRemove = () => {
    const input = document.querySelector(`input[type="file"][data-label="${label}"]`);
    if (input) input.value = '';
    onRemove?.();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input de arquivo */}
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading || converting}
          data-label={label}
          className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                     file:border-0 file:text-sm file:font-medium 
                     file:bg-purple-100 file:text-purple-700 
                     hover:file:bg-purple-200 disabled:opacity-50 cursor-pointer"
        />
        
        {/* Botão remover */}
        {value && !uploading && !converting && (
          <button
            onClick={handleRemove}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            title="Remover imagem"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Status de processamento */}
      {(converting || uploading) && showProgress && (
        <div className="flex items-center gap-2 text-sm text-purple-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
          <span>{converting ? '🔄 Otimizando imagem...' : '📤 Enviando...'}</span>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Preview da imagem */}
      {value && (
        <div className="relative inline-block group mt-2">
          <img 
            src={value} 
            alt={label || 'Preview'} 
            className="h-32 w-auto object-contain rounded-lg border border-gray-200 shadow-sm"
            loading="lazy"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 
                       flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 
                       transition-opacity shadow-lg hover:bg-red-600"
            title="Remover"
          >
            ×
          </button>
        </div>
      )}

      {/* Dica */}
      {showProgress && !value && (
        <p className="text-xs text-gray-500">
          💡 Imagens são automaticamente convertidas para WebP com transparência preservada
        </p>
      )}
    </div>
  );
}