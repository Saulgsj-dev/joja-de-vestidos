// frontend/src/components/admin/ImageUploader.jsx
import { uploadImage } from '../../lib/apiClient';

export default function ImageUploader({ value, onChange, onRemove, label, maxSize = 10 }) {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      alert(`❌ Imagem muito grande. Máximo ${maxSize}MB.`);
      return;
    }

    try {
      const { url } = await uploadImage(file);
      onChange(url);
      alert('✅ Imagem atualizada com sucesso!');
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      alert('❌ Erro: ' + error.message);
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm" />
      {value && (
        <div className="mt-2 relative inline-block">
          <img src={value} alt="Preview" className="h-32 object-cover rounded border" />
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}