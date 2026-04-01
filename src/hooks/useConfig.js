import { useState, useCallback } from 'react';
import { apiRequest } from '../lib/apiClient';

export function useConfig(profileId) {
  const [config, setConfig] = useState({
    cor_fundo: '#ffffff',
    cor_texto: '#000000',
    cor_botao: '#000000',
    footer_texto: '© 2024 Minha Loja',
    whatsapp_numero: '',
    nome_loja: 'Minha Loja de Vestidos'
  });
  const [loading, setLoading] = useState(false);

  const loadConfig = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const data = await apiRequest(`/api/config?profile_id=${profileId}`);
      if (data && Object.keys(data).length > 0) {
        setConfig(data);
      }
    } catch (e) {
      console.error('Erro ao carregar config:', e);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  const saveConfig = useCallback(async (configData) => {
    if (!profileId) throw new Error('Profile ID não encontrado');
    
    const response = await apiRequest('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configData)
    });
    
    return response;
  }, [profileId]);

  return { config, loading, loadConfig, saveConfig, setConfig };
}