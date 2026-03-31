// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiClient';

export default function Home() {
  const [sections, setSections] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const PROFILE_ID = 'demo-profile-id';

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [sectionsData, configData] = await Promise.all([
        apiRequest(`/api/sections?profile_id=${PROFILE_ID}`),
        apiRequest(`/api/config?profile_id=${PROFILE_ID}`)
      ]);
      setSections(sectionsData || []);
      setConfig(configData || {});
    } catch (e) {
      console.error('Erro:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  // Renderiza cada tipo de seção
  const renderSection = (section) => {
    const { content, styles, section_type } = section;

    switch (section_type) {
      case 'header':
        return (
          <header key={section.id} className="p-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">{content.title || 'Minha loja de vestidos'}</h1>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-purple-700 rounded-lg">painel</button>
                <button className="px-4 py-2 bg-blue-700 rounded-lg">sair</button>
              </div>
            </div>
          </header>
        );

      case 'hero':
        return (
          <section key={section.id} className="py-12 px-4 text-center" style={{ backgroundColor: styles.backgroundColor || '#67e8f9' }}>
            <h2 className="text-4xl font-bold mb-4">{content.title || 'Inserir um título'}</h2>
            <p className="text-2xl mb-6">{content.subtitle || 'Inserir um subtítulo'}</p>
            {content.image && <img src={content.image} alt="Hero" className="mx-auto max-w-2xl rounded-lg" />}
          </section>
        );

      case 'content':
        return (
          <section key={section.id} className="py-8 px-4 bg-gradient-to-r from-green-50 to-blue-100">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-2">{content.title || 'sessão'}</h3>
              {content.text && <p className="text-gray-700">{content.text}</p>}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: config?.cor_fundo || '#fff' }}>
      {sections.map(renderSection)}
    </div>
  );
}