import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { apiRequest, uploadImage } from '../lib/apiClient';
import { useNavigate } from 'react-router-dom';
import SitePreview from '../components/SitePreview';

const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESem imagem%3C/text%3E%3C/svg%3E`;

export default function AdminDashboard() {
  const [config, setConfig] = useState({
    cor_fundo: '#ffffff',
    cor_texto: '#000000',
    cor_botao: '#000000',
    footer_texto: '© 2024 Minha Loja',
    whatsapp_numero: '',
    nome_loja: 'Minha Loja de Vestidos'
  });
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('sections');
  const [storeSlug, setStoreSlug] = useState(null);
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
      try {
        const profile = await apiRequest(`/api/profile/by-user/${session.user.id}`);
        if (profile?.slug) {
          setStoreSlug(profile.slug);
        }
      } catch (e) {
        console.log('⚠️ Slug não encontrado, usando fallback');
      }
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
      if (data && Object.keys(data).length > 0) {
        setConfig(data);
      }
    } catch (e) {
      console.error('Erro ao carregar config:', e);
    }
  };

  const carregarSections = async (profileId) => {
    try {
      const data = await apiRequest(`/api/sections?profile_id=${profileId}&show_all=true`);
      if (data && data.length > 0) {
        setSections(data);
      } else {
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
      alert('✅ Seção salva!');
    } catch (e) {
      alert('❌ Erro ao salvar: ' + e.message);
    }
  };

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

  const deleteOldImage = async (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    try {
      const urlObj = new URL(imageUrl);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      const fileName = pathParts.slice(-2).join('/');
      if (!fileName) {
        console.warn('⚠️ Não foi possível extrair fileName de:', imageUrl);
        return;
      }
      console.log('🗑️ Deletando imagem antiga:', fileName);
      await apiRequest(`/api/upload/${encodeURIComponent(fileName)}`, {
        method: 'DELETE'
      });
      console.log('✅ Requisição de delete enviada');
    } catch (e) {
      console.warn('⚠️ Não foi possível deletar imagem antiga:', e.message);
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

  // ✅ UPLOAD GENÉRICO PARA QUALQUER IMAGEM DA SEÇÃO
  const handleImageUpload = async (e, imageField, isStyle = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Imagem muito grande. Máximo 10MB.');
      return;
    }
    try {
      const oldImageUrl = isStyle 
        ? selectedSection?.styles?.[imageField] 
        : selectedSection?.content?.[imageField];
      alert('📤 Fazendo upload...');
      const { url: newUrl } = await uploadImage(file);
      
      const updateData = {
        id: selectedSection.id,
        section_type: selectedSection.section_type,
        section_order: selectedSection.section_order,
        content: selectedSection.content,
        styles: selectedSection.styles,
        is_active: selectedSection.is_active
      };

      if (isStyle) {
        updateData.styles = { ...selectedSection.styles, [imageField]: newUrl };
      } else {
        updateData.content = { ...selectedSection.content, [imageField]: newUrl };
      }

      await apiRequest('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const updatedSection = {
        ...selectedSection,
        [isStyle ? 'styles' : 'content']: {
          ...(isStyle ? selectedSection.styles : selectedSection.content),
          [imageField]: newUrl
        }
      };
      setSelectedSection(updatedSection);
      
      if (oldImageUrl) await deleteOldImage(oldImageUrl);
      await carregarSections(user.id);
      alert('✅ Imagem atualizada com sucesso!');
    } catch (e) {
      console.error('❌ Erro no upload:', e);
      alert('❌ Erro: ' + e.message);
    }
  };

  const handleBackgroundTypeChange = (type) => {
    const updatedSection = {
      ...selectedSection,
      styles: {
        ...selectedSection.styles,
        backgroundType: type
      }
    };
    setSelectedSection(updatedSection);
  };

  const handleRemoveImage = (imageField, isStyle = false) => {
    if (!selectedSection) return;
    const updated = {
      ...selectedSection,
      [isStyle ? 'styles' : 'content']: {
        ...(isStyle ? selectedSection.styles : selectedSection.content),
        [imageField]: ''
      }
    };
    setSelectedSection(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const publicSiteUrl = storeSlug ? `/${storeSlug}` : '/';

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.cor_fundo, color: config.cor_texto }}>
      {/* Header fixo do admin */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{config.nome_loja || 'Minha loja de vestidos'}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(publicSiteUrl)}
              className="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800"
            >
              Ver Site
            </button>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
              className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800"
            >
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
            <button onClick={() => setActiveTab('config')} className={`flex-1 py-2 rounded ${activeTab === 'config' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
              Config
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
                        {section.section_type === 'contact' && 'Contato'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        section.is_active === 1 ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {section.is_active === 1 ? '✓' : '○'}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePublish(section, section.is_active === 0); }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition px-2 py-1 rounded text-xs ${
                      section.is_active === 1 ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
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

          {activeTab === 'config' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Configurações Gerais</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Loja</label>
                <input
                  type="text"
                  value={config.nome_loja || ''}
                  onChange={(e) => setConfig({...config, nome_loja: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Minha Loja"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cor de Fundo</label>
                <input
                  type="color"
                  value={config.cor_fundo}
                  onChange={(e) => setConfig({...config, cor_fundo: e.target.value})}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cor do Texto</label>
                <input
                  type="color"
                  value={config.cor_texto}
                  onChange={(e) => setConfig({...config, cor_texto: e.target.value})}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cor do Botão/Footer</label>
                <input
                  type="color"
                  value={config.cor_botao}
                  onChange={(e) => setConfig({...config, cor_botao: e.target.value})}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Texto do Footer</label>
                <input
                  type="text"
                  value={config.footer_texto}
                  onChange={(e) => setConfig({...config, footer_texto: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="© 2024 Minha Loja"
                />
              </div>
              <button
                onClick={salvarConfig}
                disabled={saving}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : '💾 Salvar Configurações'}
              </button>
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
                    selectedSection.is_active === 1 ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {selectedSection.is_active === 1 ? '🔓 Despublicar' : '✅ Publicar'}
                </button>
              </div>

              {/* ========== HEADER EDITOR (SEM ALTERAÇÕES) ========== */}
              {selectedSection.section_type === 'header' && (
                <div className="space-y-5">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-purple-800 mb-3">🎨 Aparência do Header</h3>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => handleStyleUpdate('bgType', 'solid')}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.bgType === 'solid' || !selectedSection.styles?.bgType
                            ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Cor Sólida
                      </button>
                      <button
                        onClick={() => handleStyleUpdate('bgType', 'gradient')}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.bgType === 'gradient' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Gradiente
                      </button>
                    </div>
                    {(selectedSection.styles?.bgType === 'solid' || !selectedSection.styles?.bgType) && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium mb-1">Cor de Fundo</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.bgColor || config.cor_fundo || '#ffffff'}
                          onChange={(e) => handleStyleUpdate('bgColor', e.target.value)}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                    )}
                    {selectedSection.styles?.bgType === 'gradient' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium mb-1">Cor Inicial</label>
                          <input
                            type="color"
                            value={selectedSection.styles?.gradientStart || '#667eea'}
                            onChange={(e) => handleStyleUpdate('gradientStart', e.target.value)}
                            className="w-full h-10 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Cor Final</label>
                          <input
                            type="color"
                            value={selectedSection.styles?.gradientEnd || '#764ba2'}
                            onChange={(e) => handleStyleUpdate('gradientEnd', e.target.value)}
                            className="w-full h-10 rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium mb-1">Cor do Texto</label>
                      <input
                        type="color"
                        value={selectedSection.styles?.textColor || config.cor_texto || '#000000'}
                        onChange={(e) => handleStyleUpdate('textColor', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-800 mb-3">⬅️ Lado Esquerdo</h3>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => handleStyleUpdate('leftType', 'text')}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.leftType === 'text' || !selectedSection.styles?.leftType
                            ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Texto
                      </button>
                      <button
                        onClick={() => handleStyleUpdate('leftType', 'logo')}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.leftType === 'logo' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Logo
                      </button>
                    </div>
                    {(!selectedSection.styles?.leftType || selectedSection.styles?.leftType === 'text') ? (
                      <div>
                        <label className="block text-xs font-medium mb-1">Texto</label>
                        <input
                          type="text"
                          value={selectedSection.content?.leftText || selectedSection.content?.title || ''}
                          onChange={(e) => handleSectionUpdate('leftText', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Ex: Minha Loja"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium mb-1">Logo</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo', false)} className="w-full text-sm" />
                        {(selectedSection.content?.logo || selectedSection.styles?.leftLogo) && (
                          <div className="mt-2 relative inline-block">
                            <img
                              src={selectedSection.content?.logo || selectedSection.styles?.leftLogo}
                              alt="Logo"
                              className="h-12 object-contain rounded border"
                            />
                            <button
                              onClick={() => { handleSectionUpdate('logo', ''); handleStyleUpdate('leftLogo', ''); }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========== HERO EDITOR ========== */}
              {selectedSection.section_type === 'hero' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">📝 Conteúdo</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Título Principal</label>
                    <input
                      type="text"
                      value={selectedSection.content.title || ''}
                      onChange={(e) => handleSectionUpdate('title', e.target.value)}
                      className="w-full p-2 border rounded text-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtítulo/Descrição</label>
                    <textarea
                      value={selectedSection.content.subtitle || ''}
                      onChange={(e) => handleSectionUpdate('subtitle', e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Imagem Principal (Centro)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'image', false)}
                      className="w-full"
                    />
                    {selectedSection.content.image && (
                      <img
                        src={selectedSection.content.image}
                        alt="Principal"
                        className="mt-2 w-full h-48 object-cover rounded"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold border-b pb-2 mt-6">🎨 Fundo</h3>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => handleBackgroundTypeChange('color')}
                      className={`flex-1 py-2 rounded ${
                        selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType
                          ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Cor de Fundo
                    </button>
                    <button
                      onClick={() => handleBackgroundTypeChange('image')}
                      className={`flex-1 py-2 rounded ${
                        selectedSection.styles.backgroundType === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Imagem de Fundo
                    </button>
                  </div>
                  {(selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
                      <input
                        type="color"
                        value={selectedSection.styles.backgroundColor || '#faf5ff'}
                        onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                        className="w-full h-10 rounded"
                      />
                    </div>
                  )}
                  {selectedSection.styles.backgroundType === 'image' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'backgroundImage', true)}
                          className="w-full"
                        />
                        {selectedSection.styles.backgroundImage && (
                          <img
                            src={selectedSection.styles.backgroundImage}
                            alt="Fundo"
                            className="mt-2 w-full h-48 object-cover rounded"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Opacidade: {selectedSection.styles.backgroundOpacity || 100}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedSection.styles.backgroundOpacity || 100}
                          onChange={(e) => handleStyleUpdate('backgroundOpacity', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                  <h3 className="text-lg font-semibold border-b pb-2 mt-6">🖼️ Imagens Laterais</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Imagem Lateral Esquerda</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'leftImage', false)}
                      className="w-full"
                    />
                    {selectedSection.content.leftImage && (
                      <div className="mt-2 relative">
                        <img
                          src={selectedSection.content.leftImage}
                          alt="Esquerda"
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          onClick={() => handleRemoveImage('leftImage', false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Imagem Lateral Direita</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'rightImage', false)}
                      className="w-full"
                    />
                    {selectedSection.content.rightImage && (
                      <div className="mt-2 relative">
                        <img
                          src={selectedSection.content.rightImage}
                          alt="Direita"
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          onClick={() => handleRemoveImage('rightImage', false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========== PRODUCTS SECTION EDITOR (ATUALIZADO) ========== */}
              {selectedSection.section_type === 'products' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título da Seção</label>
                    <input 
                      type="text" 
                      value={selectedSection.content.title || ''} 
                      onChange={(e) => handleSectionUpdate('title', e.target.value)} 
                      className="w-full p-2 border rounded" 
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold border-b pb-2 mt-4">🎨 Fundo da Seção</h3>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => handleBackgroundTypeChange('color')}
                      className={`flex-1 py-2 rounded ${
                        selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType
                          ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Cor de Fundo
                    </button>
                    <button
                      onClick={() => handleBackgroundTypeChange('image')}
                      className={`flex-1 py-2 rounded ${
                        selectedSection.styles.backgroundType === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Imagem de Fundo
                    </button>
                  </div>
                  {(selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
                      <input
                        type="color"
                        value={selectedSection.styles.backgroundColor || '#ffffff'}
                        onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                        className="w-full h-10 rounded"
                      />
                    </div>
                  )}
                  {selectedSection.styles.backgroundType === 'image' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'backgroundImage', true)}
                          className="w-full"
                        />
                        {selectedSection.styles.backgroundImage && (
                          <img
                            src={selectedSection.styles.backgroundImage}
                            alt="Fundo"
                            className="mt-2 w-full h-48 object-cover rounded"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Opacidade: {selectedSection.styles.backgroundOpacity || 100}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedSection.styles.backgroundOpacity || 100}
                          onChange={(e) => handleStyleUpdate('backgroundOpacity', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                  
                  <p className="text-sm text-gray-500 mt-4">Esta seção mostra automaticamente os produtos cadastrados.</p>
                </div>
              )}

              {/* ========== CONTENT SECTIONS EDITOR (ATUALIZADO) ========== */}
              {selectedSection.section_type === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <input 
                      type="text" 
                      value={selectedSection.content.title || ''} 
                      onChange={(e) => handleSectionUpdate('title', e.target.value)} 
                      className="w-full p-2 border rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto</label>
                    <textarea 
                      value={selectedSection.content.text || ''} 
                      onChange={(e) => handleSectionUpdate('text', e.target.value)} 
                      className="w-full p-2 border rounded" 
                      rows="4" 
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold border-b pb-2 mt-4">🎨 Fundo da Seção</h3>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => handleBackgroundTypeChange('color')}
                      className={`flex-1 py-2 rounded ${
                        selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType
                          ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Cor de Fundo
                    </button>
                    <button
                      onClick={() => handleBackgroundTypeChange('image')}
                      className={`flex-1 py-2 rounded ${
                        selectedSection.styles.backgroundType === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Imagem de Fundo
                    </button>
                  </div>
                  {(selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
                      <input
                        type="color"
                        value={selectedSection.styles.backgroundColor || '#faf5ff'}
                        onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                        className="w-full h-10 rounded"
                      />
                    </div>
                  )}
                  {selectedSection.styles.backgroundType === 'image' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'backgroundImage', true)}
                          className="w-full"
                        />
                        {selectedSection.styles.backgroundImage && (
                          <img
                            src={selectedSection.styles.backgroundImage}
                            alt="Fundo"
                            className="mt-2 w-full h-48 object-cover rounded"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Opacidade: {selectedSection.styles.backgroundOpacity || 100}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedSection.styles.backgroundOpacity || 100}
                          onChange={(e) => handleStyleUpdate('backgroundOpacity', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                  
                  <h3 className="text-lg font-semibold border-b pb-2 mt-4">🖼️ Imagem da Seção (Opcional)</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Imagem</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'image', false)}
                      className="w-full"
                    />
                    {selectedSection.content.image && (
                      <div className="mt-2 relative inline-block">
                        <img
                          src={selectedSection.content.image}
                          alt="Seção"
                          className="w-full h-48 object-cover rounded"
                        />
                        <button
                          onClick={() => handleRemoveImage('image', false)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========== CONTACT SECTION EDITOR (ATUALIZADO) ========== */}
              {selectedSection.section_type === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <input 
                      type="text" 
                      value={selectedSection.content.title || ''} 
                      onChange={(e) => handleSectionUpdate('title', e.target.value)} 
                      className="w-full p-2 border rounded" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto</label>
                    <textarea 
                      value={selectedSection.content.text || ''} 
                      onChange={(e) => handleSectionUpdate('text', e.target.value)} 
                      className="w-full p-2 border rounded" 
                      rows="4" 
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold border-b pb-2 mt-4">🎨 Fundo da Seção</h3>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => handleBackgroundTypeChange('color')}
                      className={`flex-1 py-2 rounded ${
                        selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType
                          ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Cor de Fundo
                    </button>
                    <button
                      onClick={() => handleBackgroundTypeChange('image')}
                      className={`flex-1 py-2 rounded ${
                        selectedSection.styles.backgroundType === 'image' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      Imagem de Fundo
                    </button>
                  </div>
                  {(selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
                      <input
                        type="color"
                        value={selectedSection.styles.backgroundColor || '#f9fafb'}
                        onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                        className="w-full h-10 rounded"
                      />
                    </div>
                  )}
                  {selectedSection.styles.backgroundType === 'image' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'backgroundImage', true)}
                          className="w-full"
                        />
                        {selectedSection.styles.backgroundImage && (
                          <img
                            src={selectedSection.styles.backgroundImage}
                            alt="Fundo"
                            className="mt-2 w-full h-48 object-cover rounded"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Opacidade: {selectedSection.styles.backgroundOpacity || 100}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedSection.styles.backgroundOpacity || 100}
                          onChange={(e) => handleStyleUpdate('backgroundOpacity', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <button 
                onClick={() => salvarSection(selectedSection)} 
                className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                💾 Salvar Alterações
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Selecione uma seção para editar</p>
            </div>
          )}
        </div>

        {/* Preview em Tempo Real */}
        <div className="flex-1 bg-cyan-200 rounded-2xl p-6">
          <SitePreview
            config={config}
            sections={sections}
            selectedSection={selectedSection}
          />
        </div>
      </div>
    </div>
  );
}