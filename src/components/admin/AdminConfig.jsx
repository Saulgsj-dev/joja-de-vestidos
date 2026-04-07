// frontend/src/components/admin/AdminConfig.jsx
import { useState } from 'react';

export default function AdminConfig({ config, setConfig, onSave, saving }) {
  const handleColorChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Configurações Gerais</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input
          type="text"
          value={config.nome_loja || ''}
          onChange={(e) => setConfig({ ...config, nome_loja: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Minha Loja"
        />
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-semibold text-sm mb-3 text-gray-700">🎨 Cores do Site</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Cor de Fundo</label>
            <input
              type="color"
              value={config.cor_fundo || '#ffffff'}
              onChange={(e) => handleColorChange('cor_fundo', e.target.value)}
              className="w-full h-10 rounded cursor-pointer border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cor do Texto</label>
            <input
              type="color"
              value={config.cor_texto || '#000000'}
              onChange={(e) => handleColorChange('cor_texto', e.target.value)}
              className="w-full h-10 rounded cursor-pointer border"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium transition shadow-md"
      >
        {saving ? '💾 Salvando...' : '💾 Salvar Configurações'}
      </button>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Dica:</strong> Para editar o footer, vá na aba "Seções" e clique em "🔻 Footer (Rodapé)"
        </p>
      </div>
    </div>
  );
}