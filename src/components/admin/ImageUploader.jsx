import { uploadImage } from '../../lib/apiClient';

// ✅ Função para compressão de imagem
const compressImage = async (file, maxWidth = 1920, quality = 0.85) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      let { width, height } = img;
      
      // Redimensiona mantendo proporção
      if (width > maxWidth) {
        height = Math.round((maxWidth / width) * height);
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Converte para WebP
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // Fallback para PNG se WebP falhar
          canvas.toBlob(resolve, 'image/png', quality);
        }
      }, 'image/webp', quality);
    };
    
    img.onerror = () => {
      resolve(file); // Retorna original se falhar
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export default function ImageUploader({ value, onChange, onRemove, label, maxSize = 10 }) {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > maxSize * 1024 * 1024) {
      alert(`❌ Imagem muito grande. Máximo ${maxSize}MB.`);
      return;
    }
    
    try {
      // ✅ Comprime antes do upload
      const compressedBlob = await compressImage(file);
      const compressedFile = new File(
        [compressedBlob], 
        file.name.replace(/\.\w+$/, '.webp'), 
        { type: 'image/webp' }
      );
      
      const { url } = await uploadImage(compressedFile);
      onChange(url);
      alert('✅ Imagem otimizada e enviada com sucesso!');
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      alert('❌ Erro: ' + error.message);
    }
  };
  
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="w-full text-sm" 
      />
      {value && (
        <div className="mt-2 relative inline-block">
          <img 
            src={value} 
            alt="Preview" 
            className="h-32 object-cover rounded border"
            loading="lazy"
          />
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
            aria-label="Remover imagem"
          >
            ×
          </button>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        💡 Imagens são automaticamente convertidas para WebP e otimizadas
      </p>
    </div>
  );
}