import { useState } from 'react';

export default function AdminConfig({ config, setConfig, onSave, saving }) {
  const handleColorChange = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Configurações Gerais</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nome da Loja</label>
        <input
          type="text"
          value={config.nome_loja || ''}
          onChange={(e) => setConfig({ ...config, nome_loja: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Minha Loja"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cor de Fundo</label>
        <input
          type="color"
          value={config.cor_fundo || '#ffffff'}
          onChange={(e) => handleColorChange('cor_fundo', e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cor do Texto</label>
        <input
          type="color"
          value={config.cor_texto || '#000000'}
          onChange={(e) => handleColorChange('cor_texto', e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cor do Botão</label>
        <input
          type="color"
          value={config.cor_botao || '#000000'}
          onChange={(e) => handleColorChange('cor_botao', e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">WhatsApp Número</label>
        <input
          type="text"
          value={config.whatsapp_numero || ''}
          onChange={(e) => setConfig({ ...config, whatsapp_numero: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="5511999999999"
        />
        <p className="text-xs text-gray-500 mt-1">
          Formato: 55 + DDD + número (ex: 5511999999999)
        </p>
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
      >
        {saving ? '💾 Salvando...' : '💾 Salvar Configurações'}
      </button>
    </div>
  );
}