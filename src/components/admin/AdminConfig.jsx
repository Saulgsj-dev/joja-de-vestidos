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
          value={config.cor_fundo}
          onChange={(e) => handleColorChange('cor_fundo', e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cor do Texto</label>
        <input
          type="color"
          value={config.cor_texto}
          onChange={(e) => handleColorChange('cor_texto', e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cor do Botão/Footer</label>
        <input
          type="color"
          value={config.cor_botao}
          onChange={(e) => handleColorChange('cor_botao', e.target.value)}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Texto do Footer</label>
        <input
          type="text"
          value={config.footer_texto}
          onChange={(e) => setConfig({ ...config, footer_texto: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="© 2024 Minha Loja"
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
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {saving ? 'Salvando...' : '💾 Salvar Configurações'}
      </button>
    </div>
  );
}