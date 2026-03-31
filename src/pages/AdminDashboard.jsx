import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { apiRequest, uploadImage } from '../lib/apiClient';
import { useNavigate } from 'react-router-dom';

const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESem imagem%3C/text%3E%3C/svg%3E`;

export default function AdminDashboard() {
  const [config, setConfig] = useState({
    cor_fundo: '#ffffff',
    cor_texto: '#000000',
    cor_botao: '#000000',
    footer_texto: '© 2024 Minha Loja',
    whatsapp_numero: ''
  });
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('sections');
  const navigate = useNavigate();

  useEffect(() => {
    verificarAuth();
  }, []);

  const verificarAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      await Promise.all([
        carregarConfig(session.user.id),
        carregarSections(session.user.id)
      ]);
    } catch (err) {
      console.error('Erro na auth:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const carregarConfig = async (profileId) => {
    try {
      const data = await apiRequest(`/api/config?profile_id=${profileId}`);
      if (data && Object.keys(data).length > 0) setConfig(data);
    } catch (e) {
      console.error('Erro ao carregar config:', e);
    }
  };

  // ✅ CORRIGIDO: Adicionado parâmetro show_all=true
  const carregarSections = async (profileId) => {
    try {
      const data = await apiRequest(`/api/sections?profile_id=${profileId}&show_all=true`);
      if (data && data.length > 0) {
        setSections(data);
      } else {
        // Inicializar seções padrão
        await apiRequest('/api/sections/init', { method: 'POST' });
        const newData = await apiRequest(`/api/sections?profile_id=${profileId}&show_all=true`);
        setSections(newData);
      }
    } catch (e) {
      console.error('Erro ao carregar sections:', e);
    }
  };

  const salvarConfig = async () => {
    setSaving(true);
    try {
      await apiRequest('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      alert('✅ Configurações salvas!');
    } catch (e) {
      alert('❌ Erro: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const salvarSection = async (sectionData) => {
    try {
      await apiRequest('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData)
      });
      await carregarSections(user.id);
      alert('✅ Seção salva! Recarregue a página para ver as mudanças.');
    } catch (e) {
      alert('❌ Erro ao salvar: ' + e.message);
    }
  };

  // ✅ CORRIGIDO: Envia todos os campos obrigatórios
  const togglePublish = async (section, newStatus) => {
    try {
      await apiRequest('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: section.id,
          section_type: section.section_type,
          section_order: section.section_order,
          content: section.content,
          styles: section.styles,
          is_active: newStatus ? 1 : 0
        })
      });
      await carregarSections(user.id);
      alert(newStatus ? '✅ Seção publicada!' : '⏸️ Seção despublicada!');
    } catch (e) {
      alert('❌ Erro: ' + e.message);
    }
  };

  const handleSectionUpdate = (field, value) => {
    if (!selectedSection) return;
    const updated = {
      ...selectedSection,
      content: { ...selectedSection.content, [field]: value }
    };
    setSelectedSection(updated);
  };

  const handleStyleUpdate = (field, value) => {
    if (!selectedSection) return;
    const updated = {
      ...selectedSection,
      styles: { ...selectedSection.styles, [field]: value }
    };
    setSelectedSection(updated);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      handleSectionUpdate('logo', url);
    } catch (e) {
      alert('Erro no upload: ' + e.message);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      handleSectionUpdate('image', url);
    } catch (e) {
      alert('Erro no upload: ' + e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.cor_fundo, color: config.cor_texto }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Minha loja de vestidos</h1>
          <div className="flex gap-2">
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800">
              Ver Site
            </button>
            <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 flex gap-4">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab('sections')} className={`flex-1 py-2 rounded ${activeTab === 'sections' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
              Seções
            </button>
            <button onClick={() => setActiveTab('products')} className={`flex-1 py-2 rounded ${activeTab === 'products' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
              Produtos
            </button>
          </div>

          {activeTab === 'sections' && (
            <div className="space-y-2">
              {sections.map((section, index) => (
                <div key={section.id} className="relative group">
                  <button
                    onClick={() => setSelectedSection(section)}
                    className={`w-full p-3 rounded-lg text-left transition ${
                      selectedSection?.id === section.id
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gradient-to-r from-green-50 to-blue-100 hover:from-green-100 hover:to-blue-200'
                    } ${section.is_active === 0 ? 'opacity-50' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>
                        {section.section_type === 'header' && 'Header'}
                        {section.section_type === 'hero' && 'Hero Section'}
                        {section.section_type === 'products' && 'Produtos'}
                        {section.section_type === 'content' && `Sessão ${index + 1}`}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        section.is_active === 1
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}>
                        {section.is_active === 1 ? '✓' : '○'}
                      </span>
                    </div>
                  </button>
                  {/* Botão rápido de publicar/despublicar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePublish(section, section.is_active === 0);
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition px-2 py-1 rounded text-xs ${
                      section.is_active === 1
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {section.is_active === 1 ? 'Despublicar' : 'Publicar'}
                  </button>
                </div>
              ))}
              <button className="w-full p-3 text-blue-400 text-2xl font-bold hover:bg-blue-50 rounded-lg mt-2">
                + Adicionar Seção
              </button>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="text-center text-gray-500 py-8">
              Gerenciamento de produtos em breve...
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
          {selectedSection ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Editando: {selectedSection.section_type}</h2>
                <button
                  onClick={() => togglePublish(selectedSection, selectedSection.is_active === 0)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedSection.is_active === 1
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {selectedSection.is_active === 1 ? '🔓 Despublicar' : '✅ Publicar'}
                </button>
              </div>

              {/* Header Editor */}
              {selectedSection.section_type === 'header' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Logo</label>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full" />
                    {selectedSection.content.logo && (
                      <img src={selectedSection.content.logo} alt="Logo" className="mt-2 h-16 object-contain" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                </div>
              )}

              {/* Hero Editor */}
              {selectedSection.section_type === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-bold mb-2">Título Principal</label>
                    <input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded text-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtítulo</label>
                    <input type="text" value={selectedSection.content.subtitle || ''} onChange={(e) => handleSectionUpdate('subtitle', e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
                    <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="w-full" />
                    {selectedSection.content.image && (
                      <img src={selectedSection.content.image} alt="Hero" className="mt-2 w-full h-48 object-cover rounded" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
                    <input type="color" value={selectedSection.styles.backgroundColor || '#faf5ff'} onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)} className="w-full h-10 rounded" />
                  </div>
                </div>
              )}

              {/* Products Section Editor */}
              {selectedSection.section_type === 'products' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título da Seção</label>
                    <input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <p className="text-sm text-gray-500">Esta seção mostra automaticamente os produtos cadastrados.</p>
                </div>
              )}

              {/* Content Sections Editor */}
              {selectedSection.section_type === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto</label>
                    <textarea value={selectedSection.content.text || ''} onChange={(e) => handleSectionUpdate('text', e.target.value)} className="w-full p-2 border rounded" rows="4" />
                  </div>
                </div>
              )}

              <button onClick={() => salvarSection(selectedSection)} className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                💾 Salvar Alterações
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Selecione uma seção para editar</p>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="flex-1 bg-cyan-200 rounded-2xl p-6">
          <div className="bg-white rounded-xl p-4 h-full">
            <h3 className="text-lg font-bold mb-4">📱 Preview</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>✓ Seções publicadas aparecem no site</p>
              <p>○ Seções despublicadas ficam ocultas</p>
              <p className="mt-4 p-2 bg-purple-50 rounded">
                Clique em <strong>Ver Site</strong> para ver as mudanças!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}