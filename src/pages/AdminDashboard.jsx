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
    nome_loja: 'Minha Loja de Vestidos',
    // 🎨 NOVO: Layout Geral
    site_border_radius: '0',
    site_container_width: 'full', // full, narrow, compact
    site_side_padding: 'normal', // none, small, normal, large
    site_animation: 'none', // none, fade, slide, zoom
    site_animation_duration: '500'
  });
  
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('sections');
  const [storeSlug, setStoreSlug] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState('content');
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
        setConfig(prev => ({ ...prev, ...data }));
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
      await apiRequest(`/api/upload/${encodeURIComponent(fileName)}`, {
        method: 'DELETE'
      });
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
    setSelectedSection({
      ...selectedSection,
      styles: { ...selectedSection.styles, backgroundType: type }
    });
  };

  const handleRemoveImage = (imageField, isStyle = false) => {
    if (!selectedSection) return;
    setSelectedSection({
      ...selectedSection,
      [isStyle ? 'styles' : 'content']: {
        ...(isStyle ? selectedSection.styles : selectedSection.content),
        [imageField]: ''
      }
    });
  };

  const handleAddImage = (imageArrayField) => {
    if (!selectedSection) return;
    const currentImages = selectedSection.content?.[imageArrayField] || [];
    setSelectedSection({
      ...selectedSection,
      content: {
        ...selectedSection.content,
        [imageArrayField]: [...currentImages, '']
      }
    });
  };

  const handleImageArrayUpload = async (e, imageArrayField, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Imagem muito grande. Máximo 10MB.');
      return;
    }
    try {
      const oldImageUrl = selectedSection?.content?.[imageArrayField]?.[index];
      const { url: newUrl } = await uploadImage(file);
      
      const currentImages = selectedSection.content?.[imageArrayField] || [];
      const updatedImages = [...currentImages];
      updatedImages[index] = newUrl;
      
      await apiRequest('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSection.id,
          section_type: selectedSection.section_type,
          section_order: selectedSection.section_order,
          content: { ...selectedSection.content, [imageArrayField]: updatedImages },
          styles: selectedSection.styles,
          is_active: selectedSection.is_active
        })
      });

      setSelectedSection({
        ...selectedSection,
        content: { ...selectedSection.content, [imageArrayField]: updatedImages }
      });
      
      if (oldImageUrl) await deleteOldImage(oldImageUrl);
      await carregarSections(user.id);
      alert('✅ Imagem atualizada com sucesso!');
    } catch (e) {
      console.error('❌ Erro no upload:', e);
      alert('❌ Erro: ' + e.message);
    }
  };

  const handleRemoveImageFromArray = (imageArrayField, index) => {
    if (!selectedSection) return;
    const currentImages = selectedSection.content?.[imageArrayField] || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setSelectedSection({
      ...selectedSection,
      content: { ...selectedSection.content, [imageArrayField]: updatedImages }
    });
  };

  // 🔘 Handlers para Botão da Seção
  const handleButtonUpdate = (field, value) => {
    if (!selectedSection) return;
    const updated = {
      ...selectedSection,
      content: { 
        ...selectedSection.content, 
        button: { ...(selectedSection.content.button || {}), [field]: value }
      }
    };
    setSelectedSection(updated);
  };

  // 📐 Handlers para Padding da Seção
  const handlePaddingUpdate = (field, value) => {
    if (!selectedSection) return;
    const updated = {
      ...selectedSection,
      styles: { 
        ...selectedSection.styles, 
        padding: { ...(selectedSection.styles.padding || {}), [field]: value }
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

  // ✅ Componente Accordion
  const Accordion = ({ id, title, children, defaultOpen = false }) => (
    <div className="border rounded-lg overflow-hidden mb-3">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveAccordion(activeAccordion === id ? null : id);
        }}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <svg className={`w-5 h-5 transition-transform ${activeAccordion === id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {(activeAccordion === id || defaultOpen) && (
        <div className="p-4 bg-white" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  );

  const handleColorChange = (e, field, isStyle = false, sectionField = null) => {
    e.stopPropagation();
    const color = e.target.value;
    if (isStyle && selectedSection) {
      handleStyleUpdate(field, color);
    } else if (selectedSection && sectionField) {
      handleSectionUpdate(sectionField, color);
    } else {
      setConfig({...config, [field]: color});
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.cor_fundo, color: config.cor_texto }}>
      {/* Header fixo do admin */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 sticky top-0 z-50">
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

      <div className="max-w-7xl mx-auto p-4 flex gap-4 flex-wrap lg:flex-nowrap">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white rounded-2xl p-4 shadow-lg">
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
                    onClick={() => { setSelectedSection(section); setActiveAccordion('content'); }}
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
                        {section.section_type === 'content' && `Conteúdo ${index + 1}`}
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
              
              {/* Configurações básicas existentes */}
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
                  onChange={(e) => handleColorChange(e, 'cor_fundo')}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cor do Texto</label>
                <input
                  type="color"
                  value={config.cor_texto}
                  onChange={(e) => handleColorChange(e, 'cor_texto')}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cor do Botão/Footer</label>
                <input
                  type="color"
                  value={config.cor_botao}
                  onChange={(e) => handleColorChange(e, 'cor_botao')}
                  onClick={(e) => e.stopPropagation()}
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

              {/* 🎨 NOVO: Layout Geral do Site */}
              <Accordion id="layout-geral" title="🎨 Layout Geral" defaultOpen={false}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Arredondamento das Bordas</label>
                    <select
                      value={config.site_border_radius || '0'}
                      onChange={(e) => setConfig({...config, site_border_radius: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="0">Sem arredondamento</option>
                      <option value="4">Leve (4px)</option>
                      <option value="8">Médio (8px)</option>
                      <option value="16">Suave (16px)</option>
                      <option value="24">Arredondado (24px)</option>
                      <option value="999">Pílula</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Largura do Container</label>
                    <select
                      value={config.site_container_width || 'full'}
                      onChange={(e) => setConfig({...config, site_container_width: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="full">Largura total</option>
                      <option value="narrow">Estreito (1200px)</option>
                      <option value="compact">Compacto (900px)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Espaçamento Lateral</label>
                    <select
                      value={config.site_side_padding || 'normal'}
                      onChange={(e) => setConfig({...config, site_side_padding: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="none">Sem espaçamento</option>
                      <option value="small">Pequeno</option>
                      <option value="normal">Normal</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Animação de Entrada</label>
                    <select
                      value={config.site_animation || 'none'}
                      onChange={(e) => setConfig({...config, site_animation: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="none">Sem animação</option>
                      <option value="fade">Fade In</option>
                      <option value="slide">Slide Up</option>
                      <option value="zoom">Zoom In</option>
                    </select>
                  </div>
                  
                  {config.site_animation !== 'none' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Duração da Animação: {config.site_animation_duration}ms</label>
                      <input
                        type="range"
                        min="200"
                        max="2000"
                        step="100"
                        value={config.site_animation_duration || '500'}
                        onChange={(e) => setConfig({...config, site_animation_duration: e.target.value})}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </Accordion>

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
        <div className="flex-1 min-w-0 bg-white rounded-2xl p-6 shadow-lg">
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

              {/* ========== HEADER EDITOR ========== */}
              {selectedSection.section_type === 'header' && (
                <div className="space-y-3">
                  <Accordion id="header-appearance" title="🎨 Aparência" defaultOpen={true}>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('bgType', 'solid'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.bgType === 'solid' || !selectedSection.styles?.bgType
                            ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Cor Sólida
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('bgType', 'gradient'); }}
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
                          onChange={(e) => handleColorChange(e, 'bgColor', true)}
                          onClick={(e) => e.stopPropagation()}
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
                            onChange={(e) => handleColorChange(e, 'gradientStart', true)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full h-10 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Cor Final</label>
                          <input
                            type="color"
                            value={selectedSection.styles?.gradientEnd || '#764ba2'}
                            onChange={(e) => handleColorChange(e, 'gradientEnd', true)}
                            onClick={(e) => e.stopPropagation()}
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
                        onChange={(e) => handleColorChange(e, 'textColor', true)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                    </div>
                  </Accordion>

                  <Accordion id="header-left" title="⬅️ Lado Esquerdo">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('leftType', 'text'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.leftType === 'text' || !selectedSection.styles?.leftType
                            ? 'bg-blue-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Texto
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('leftType', 'logo'); }}
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
                            <img src={selectedSection.content?.logo || selectedSection.styles?.leftLogo} alt="Logo" className="h-12 object-contain rounded border" />
                            <button onClick={(e) => { e.stopPropagation(); handleSectionUpdate('logo', ''); handleStyleUpdate('leftLogo', ''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                          </div>
                        )}
                      </div>
                    )}
                  </Accordion>
                </div>
              )}

              {/* ========== HERO EDITOR ========== */}
              {selectedSection.section_type === 'hero' && (
                <div className="space-y-3">
                  {/* 📝 CONTEÚDO */}
                  <Accordion id="content" title="📝 Conteúdo" defaultOpen={true}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Título Principal</label>
                        <input
                          type="text"
                          value={selectedSection.content.title || ''}
                          onChange={(e) => handleSectionUpdate('title', e.target.value)}
                          className="w-full p-2 border rounded text-xl"
                          placeholder="Digite o título..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subtítulo/Descrição</label>
                        <textarea
                          value={selectedSection.content.subtitle || ''}
                          onChange={(e) => handleSectionUpdate('subtitle', e.target.value)}
                          className="w-full p-2 border rounded"
                          rows="3"
                          placeholder="Digite a descrição..."
                        />
                      </div>
                      
                      {/* 🔘 NOVO: Botão da Seção */}
                      <div className="pt-4 border-t">
                        <label className="block text-sm font-medium mb-2">🔘 Botão de Ação</label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={selectedSection.content.button?.text || ''}
                            onChange={(e) => handleButtonUpdate('text', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Texto do botão (ex: Comprar agora)"
                          />
                          <input
                            type="text"
                            value={selectedSection.content.button?.link || ''}
                            onChange={(e) => handleButtonUpdate('link', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Link ou WhatsApp (ex: https://wa.me/5542999999999)"
                          />
                          <select
                            value={selectedSection.content.button?.type || 'link'}
                            onChange={(e) => handleButtonUpdate('type', e.target.value)}
                            className="w-full p-2 border rounded"
                          >
                            <option value="link">🔗 Link Externo</option>
                            <option value="whatsapp">📱 WhatsApp</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </Accordion>

                  {/* 🎨 CORES DOS TEXTOS */}
                  <Accordion id="text-colors" title="🎨 Cores dos Textos">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor do Título</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.titleColor || '#ffffff'}
                          onChange={(e) => handleColorChange(e, 'titleColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor da Descrição</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.subtitleColor || '#e5e7eb'}
                          onChange={(e) => handleColorChange(e, 'subtitleColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </Accordion>

                  {/* 🔤 ESTILO DA FONTE */}
                  <Accordion id="font-styles" title="🔤 Estilo da Fonte">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tamanho do Título</label>
                        <select
                          value={selectedSection.styles?.titleFontSize || 'large'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('titleFontSize', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="small">Pequeno</option>
                          <option value="medium">Médio</option>
                          <option value="large">Grande</option>
                          <option value="xlarge">Extra Grande</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Peso do Título</label>
                        <select
                          value={selectedSection.styles?.titleFontWeight || 'bold'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('titleFontWeight', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="normal">Normal</option>
                          <option value="semibold">Semi-negrito</option>
                          <option value="bold">Negrito</option>
                          <option value="extrabold">Extra Negrito</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tamanho da Descrição</label>
                        <select
                          value={selectedSection.styles?.subtitleFontSize || 'medium'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('subtitleFontSize', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="small">Pequeno</option>
                          <option value="medium">Médio</option>
                          <option value="large">Grande</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>

                  {/* 📐 ALINHAMENTOS */}
                  <Accordion id="alignments" title="📐 Alinhamentos">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Alinhamento do Título</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={(e) => { e.stopPropagation(); handleStyleUpdate('titleAlign', align); }}
                              className={`flex-1 py-2 rounded text-sm ${
                                selectedSection.styles?.titleAlign === align || (!selectedSection.styles?.titleAlign && align === 'center')
                                  ? 'bg-purple-600 text-white' : 'bg-gray-200'
                              }`}
                            >
                              {align === 'left' ? '⬅️ Esquerda' : align === 'center' ? '↕️ Centro' : '➡️ Direita'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Alinhamento da Descrição</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={(e) => { e.stopPropagation(); handleStyleUpdate('subtitleAlign', align); }}
                              className={`flex-1 py-2 rounded text-sm ${
                                selectedSection.styles?.subtitleAlign === align || (!selectedSection.styles?.subtitleAlign && align === 'center')
                                  ? 'bg-purple-600 text-white' : 'bg-gray-200'
                              }`}
                            >
                              {align === 'left' ? '⬅️ Esquerda' : align === 'center' ? '↕️ Centro' : '➡️ Direita'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Accordion>

                  {/* 🖼️ POSIÇÃO DA IMAGEM */}
                  <Accordion id="image-position" title="🖼️ Posição da Imagem">
                    <div>
                      <label className="block text-sm font-medium mb-2">Posição da Imagem Principal</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'above', label: '📍 Acima do Título', icon: '⬆️' },
                          { value: 'between', label: '📍 Entre Título e Descrição', icon: '↕️' },
                          { value: 'below', label: '📍 Abaixo da Descrição', icon: '⬇️' }
                        ].map(pos => (
                          <button
                            key={pos.value}
                            onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imagePosition', pos.value); }}
                            className={`p-3 rounded-lg text-sm border-2 transition ${
                              selectedSection.styles?.imagePosition === pos.value || (!selectedSection.styles?.imagePosition && pos.value === 'above')
                                ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{pos.icon}</div>
                            <div className="text-xs">{pos.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Imagem Principal</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image', false)}
                        className="w-full"
                      />
                      {selectedSection.content.image && (
                        <div className="mt-2 relative">
                          <img src={selectedSection.content.image} alt="Principal" className="w-full h-48 object-cover rounded" />
                          <button onClick={(e) => { e.stopPropagation(); handleRemoveImage('image', false); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                        </div>
                      )}
                    </div>
                  </Accordion>

                  {/* 🎨 FUNDO */}
                  <Accordion id="background" title="🎨 Fundo da Seção">
                    <div className="space-y-4">
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBackgroundTypeChange('color'); }}
                          className={`flex-1 py-2 rounded ${
                            selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType
                              ? 'bg-purple-600 text-white' : 'bg-gray-200'
                          }`}
                        >
                          Cor de Fundo
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBackgroundTypeChange('image'); }}
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
                            onChange={(e) => handleColorChange(e, 'backgroundColor', true)}
                            onClick={(e) => e.stopPropagation()}
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
                              <img src={selectedSection.styles.backgroundImage} alt="Fundo" className="mt-2 w-full h-48 object-cover rounded" />
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Opacidade: {selectedSection.styles.backgroundOpacity || 100}%</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={selectedSection.styles.backgroundOpacity || 100}
                              onChange={(e) => { e.stopPropagation(); handleStyleUpdate('backgroundOpacity', parseInt(e.target.value)); }}
                              className="w-full"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </Accordion>

                  {/* 🖼️ LAYOUT DE IMAGENS - CORRIGIDO */}
                  <Accordion id="image-layout" title="🖼️ Layout de Imagens">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imageLayout', 'center'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.imageLayout === 'center' || !selectedSection.styles?.imageLayout
                            ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Centralizado
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imageLayout', 'sides'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.imageLayout === 'sides' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Laterais
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imageLayout', 'grid'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.imageLayout === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Grid
                      </button>
                    </div>
                    
                    {/* ✅ CORREÇÃO: Mostrar upload da imagem principal quando Centralizado */}
                    {(selectedSection.styles?.imageLayout === 'center' || !selectedSection.styles?.imageLayout) && (
                      <div className="p-3 bg-purple-50 rounded-lg mb-4">
                        <label className="block text-sm font-medium mb-2 text-purple-700">📷 Imagem Centralizada</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'image', false)}
                          className="w-full text-sm"
                        />
                        {selectedSection.content.image && (
                          <div className="mt-2 relative inline-block">
                            <img src={selectedSection.content.image} alt="Centralizada" className="h-24 object-contain rounded border" />
                            <button onClick={(e) => { e.stopPropagation(); handleRemoveImage('image', false); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {(selectedSection.styles?.imageLayout === 'sides' || !selectedSection.styles?.imageLayout) && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Imagem Lateral Esquerda</label>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'leftImage', false)} className="w-full" />
                          {selectedSection.content.leftImage && (
                            <div className="mt-2 relative">
                              <img src={selectedSection.content.leftImage} alt="Esquerda" className="w-full h-32 object-cover rounded" />
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveImage('leftImage', false); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Imagem Lateral Direita</label>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'rightImage', false)} className="w-full" />
                          {selectedSection.content.rightImage && (
                            <div className="mt-2 relative">
                              <img src={selectedSection.content.rightImage} alt="Direita" className="w-full h-32 object-cover rounded" />
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveImage('rightImage', false); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {selectedSection.styles?.imageLayout === 'grid' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Imagens do Grid</label>
                        <div className="space-y-2">
                          {(selectedSection.content.gridImages || []).map((img, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <input type="file" accept="image/*" onChange={(e) => handleImageArrayUpload(e, 'gridImages', index)} className="flex-1 text-sm" />
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveImageFromArray('gridImages', index); }} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">×</button>
                            </div>
                          ))}
                          <button onClick={(e) => { e.stopPropagation(); handleAddImage('gridImages'); }} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-purple-500 hover:text-purple-500">+ Adicionar Imagem</button>
                        </div>
                        {selectedSection.content.gridImages?.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {selectedSection.content.gridImages.map((img, index) => (
                              img && <img key={index} src={img} alt={`Grid ${index}`} className="w-full h-24 object-cover rounded" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Accordion>

                  {/* 📐 NOVO: Padding da Seção */}
                  <Accordion id="section-padding" title="📐 Espaçamento da Seção">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Padding Superior: {selectedSection.styles?.padding?.top || 'py-8'}</label>
                        <select
                          value={selectedSection.styles?.padding?.top || 'py-8'}
                          onChange={(e) => handlePaddingUpdate('top', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="py-2">Mínimo</option>
                          <option value="py-4">Pequeno</option>
                          <option value="py-8">Normal</option>
                          <option value="py-12">Grande</option>
                          <option value="py-16">Extra Grande</option>
                          <option value="py-0">Sem padding</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Padding Inferior: {selectedSection.styles?.padding?.bottom || 'py-8'}</label>
                        <select
                          value={selectedSection.styles?.padding?.bottom || 'py-8'}
                          onChange={(e) => handlePaddingUpdate('bottom', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="py-2">Mínimo</option>
                          <option value="py-4">Pequeno</option>
                          <option value="py-8">Normal</option>
                          <option value="py-12">Grande</option>
                          <option value="py-16">Extra Grande</option>
                          <option value="py-0">Sem padding</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>

                  {/* ✨ NOVO: Animação da Seção */}
                  <Accordion id="section-animation" title="✨ Animação da Seção">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Animação</label>
                        <select
                          value={selectedSection.styles?.animation || 'none'}
                          onChange={(e) => handleStyleUpdate('animation', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="none">Sem animação</option>
                          <option value="fade">Fade In</option>
                          <option value="slide-up">Slide Up</option>
                          <option value="slide-left">Slide Esquerda</option>
                          <option value="zoom">Zoom In</option>
                        </select>
                      </div>
                      {selectedSection.styles?.animation !== 'none' && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Duração: {selectedSection.styles?.animationDuration || '500'}ms</label>
                          <input
                            type="range"
                            min="200"
                            max="2000"
                            step="100"
                            value={selectedSection.styles?.animationDuration || '500'}
                            onChange={(e) => handleStyleUpdate('animationDuration', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </Accordion>
                </div>
              )}

              {/* ========== PRODUCTS SECTION EDITOR ========== */}
              {selectedSection.section_type === 'products' && (
                <div className="space-y-3">
                  <Accordion id="products-content" title="📝 Conteúdo" defaultOpen={true}>
                    <div>
                      <label className="block text-sm font-medium mb-2">Título da Seção</label>
                      <input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    
                    {/* 🔘 Botão para Products */}
                    <div className="pt-4 border-t">
                      <label className="block text-sm font-medium mb-2">🔘 Botão de Ação</label>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={selectedSection.content.button?.text || ''}
                          onChange={(e) => handleButtonUpdate('text', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Texto do botão"
                        />
                        <input
                          type="text"
                          value={selectedSection.content.button?.link || ''}
                          onChange={(e) => handleButtonUpdate('link', e.target.value)}
                          className="w-full p-2 border rounded"
                          placeholder="Link ou WhatsApp"
                        />
                        <select
                          value={selectedSection.content.button?.type || 'link'}
                          onChange={(e) => handleButtonUpdate('type', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="link">🔗 Link Externo</option>
                          <option value="whatsapp">📱 WhatsApp</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="products-text-colors" title="🎨 Cores dos Textos">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor do Título</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.titleColor || config.cor_texto || '#000000'}
                          onChange={(e) => handleColorChange(e, 'titleColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor do Preço</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.priceColor || config.cor_botao || '#000000'}
                          onChange={(e) => handleColorChange(e, 'priceColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="products-alignments" title="📐 Alinhamentos">
                    <div>
                      <label className="block text-sm font-medium mb-2">Alinhamento do Título</label>
                      <div className="flex gap-2">
                        {['left', 'center', 'right'].map(align => (
                          <button
                            key={align}
                            onClick={(e) => { e.stopPropagation(); handleStyleUpdate('titleAlign', align); }}
                            className={`flex-1 py-2 rounded text-sm ${
                              selectedSection.styles?.titleAlign === align || (!selectedSection.styles?.titleAlign && align === 'center')
                                ? 'bg-purple-600 text-white' : 'bg-gray-200'
                            }`}
                          >
                            {align === 'left' ? '⬅️' : align === 'center' ? '↕️' : '➡️'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="products-font" title="🔤 Estilo da Fonte">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tamanho do Título</label>
                        <select
                          value={selectedSection.styles?.titleFontSize || 'medium'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('titleFontSize', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="small">Pequeno</option>
                          <option value="medium">Médio</option>
                          <option value="large">Grande</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Peso do Título</label>
                        <select
                          value={selectedSection.styles?.titleFontWeight || 'bold'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('titleFontWeight', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="normal">Normal</option>
                          <option value="semibold">Semi-negrito</option>
                          <option value="bold">Negrito</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="products-background" title="🎨 Fundo da Seção">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBackgroundTypeChange('color'); }}
                        className={`flex-1 py-2 rounded ${
                          selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType
                            ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Cor de Fundo
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBackgroundTypeChange('image'); }}
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
                          onChange={(e) => handleColorChange(e, 'backgroundColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded"
                        />
                      </div>
                    )}
                    {selectedSection.styles.backgroundType === 'image' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'backgroundImage', true)} className="w-full" />
                          {selectedSection.styles.backgroundImage && (
                            <img src={selectedSection.styles.backgroundImage} alt="Fundo" className="mt-2 w-full h-48 object-cover rounded" />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Opacidade: {selectedSection.styles.backgroundOpacity || 100}%</label>
                          <input type="range" min="0" max="100" value={selectedSection.styles.backgroundOpacity || 100} onChange={(e) => { e.stopPropagation(); handleStyleUpdate('backgroundOpacity', parseInt(e.target.value)); }} className="w-full" />
                        </div>
                      </>
                    )}
                  </Accordion>

                  {/* 📐 Padding para Products */}
                  <Accordion id="products-padding" title="📐 Espaçamento da Seção">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Padding Vertical</label>
                        <select
                          value={selectedSection.styles?.padding?.vertical || 'py-12'}
                          onChange={(e) => handlePaddingUpdate('vertical', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="py-4">Pequeno</option>
                          <option value="py-8">Normal</option>
                          <option value="py-12">Grande</option>
                          <option value="py-16">Extra Grande</option>
                          <option value="py-0">Sem padding</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>

                  <p className="text-sm text-gray-500 mt-4">Esta seção mostra automaticamente os produtos cadastrados.</p>
                </div>
              )}

              {/* ========== CONTENT SECTIONS EDITOR ========== */}
              {selectedSection.section_type === 'content' && (
                <div className="space-y-3">
                  <Accordion id="content-text" title="📝 Texto" defaultOpen={true}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Título</label>
                        <input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Texto/Descrição</label>
                        <textarea value={selectedSection.content.text || ''} onChange={(e) => handleSectionUpdate('text', e.target.value)} className="w-full p-2 border rounded" rows="4" />
                      </div>
                      
                      {/* 🔘 Botão para Content */}
                      <div className="pt-4 border-t">
                        <label className="block text-sm font-medium mb-2">🔘 Botão de Ação</label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={selectedSection.content.button?.text || ''}
                            onChange={(e) => handleButtonUpdate('text', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Texto do botão"
                          />
                          <input
                            type="text"
                            value={selectedSection.content.button?.link || ''}
                            onChange={(e) => handleButtonUpdate('link', e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Link ou WhatsApp"
                          />
                          <select
                            value={selectedSection.content.button?.type || 'link'}
                            onChange={(e) => handleButtonUpdate('type', e.target.value)}
                            className="w-full p-2 border rounded"
                          >
                            <option value="link">🔗 Link Externo</option>
                            <option value="whatsapp">📱 WhatsApp</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="content-text-colors" title="🎨 Cores dos Textos">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor do Título</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.titleColor || config.cor_texto || '#000000'}
                          onChange={(e) => handleColorChange(e, 'titleColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor do Texto</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.textColor || '#374151'}
                          onChange={(e) => handleColorChange(e, 'textColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="content-alignments" title="📐 Alinhamentos">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Alinhamento do Título</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={(e) => { e.stopPropagation(); handleStyleUpdate('titleAlign', align); }}
                              className={`flex-1 py-2 rounded text-sm ${
                                selectedSection.styles?.titleAlign === align || (!selectedSection.styles?.titleAlign && align === 'left')
                                  ? 'bg-purple-600 text-white' : 'bg-gray-200'
                              }`}
                            >
                              {align === 'left' ? '⬅️' : align === 'center' ? '↕️' : '➡️'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Alinhamento do Texto</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={(e) => { e.stopPropagation(); handleStyleUpdate('textAlign', align); }}
                              className={`flex-1 py-2 rounded text-sm ${
                                selectedSection.styles?.textAlign === align || (!selectedSection.styles?.textAlign && align === 'left')
                                  ? 'bg-purple-600 text-white' : 'bg-gray-200'
                              }`}
                            >
                              {align === 'left' ? '⬅️' : align === 'center' ? '↕️' : '➡️'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="content-font" title="🔤 Estilo da Fonte">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tamanho do Título</label>
                        <select
                          value={selectedSection.styles?.titleFontSize || 'medium'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('titleFontSize', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="small">Pequeno</option>
                          <option value="medium">Médio</option>
                          <option value="large">Grande</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Peso do Título</label>
                        <select
                          value={selectedSection.styles?.titleFontWeight || 'semibold'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('titleFontWeight', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="normal">Normal</option>
                          <option value="semibold">Semi-negrito</option>
                          <option value="bold">Negrito</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tamanho do Texto</label>
                        <select
                          value={selectedSection.styles?.textFontSize || 'medium'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('textFontSize', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="small">Pequeno</option>
                          <option value="medium">Médio</option>
                          <option value="large">Grande</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="content-image-position" title="🖼️ Posição da Imagem">
                    <div>
                      <label className="block text-sm font-medium mb-2">Posição da Imagem</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { value: 'none', label: '❌ Sem Imagem' },
                          { value: 'above', label: '⬆️ Acima' },
                          { value: 'between', label: '↕️ Entre' },
                          { value: 'below', label: '⬇️ Abaixo' }
                        ].map(pos => (
                          <button
                            key={pos.value}
                            onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imagePosition', pos.value); }}
                            className={`p-2 rounded-lg text-xs border-2 transition ${
                              selectedSection.styles?.imagePosition === pos.value || (!selectedSection.styles?.imagePosition && pos.value === 'above')
                                ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {(selectedSection.styles?.imagePosition !== 'none') && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Imagem</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image', false)} className="w-full" />
                        {selectedSection.content.image && (
                          <div className="mt-2 relative inline-block">
                            <img src={selectedSection.content.image} alt="Seção" className="w-full h-48 object-cover rounded" />
                            <button onClick={(e) => { e.stopPropagation(); handleRemoveImage('image', false); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">×</button>
                          </div>
                        )}
                      </div>
                    )}
                  </Accordion>

                  <Accordion id="content-image-layout" title="🖼️ Layout de Imagens">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imageLayout', 'none'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.imageLayout === 'none' || !selectedSection.styles?.imageLayout
                            ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Sem Layout
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imageLayout', 'center'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.imageLayout === 'center' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Centro
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imageLayout', 'side'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.imageLayout === 'side' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Lateral
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStyleUpdate('imageLayout', 'grid'); }}
                        className={`flex-1 py-2 rounded text-sm ${
                          selectedSection.styles?.imageLayout === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Grid
                      </button>
                    </div>
                    {selectedSection.styles?.imageLayout === 'grid' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Imagens do Grid</label>
                        <div className="space-y-2">
                          {(selectedSection.content.gridImages || []).map((img, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <input type="file" accept="image/*" onChange={(e) => handleImageArrayUpload(e, 'gridImages', index)} className="flex-1 text-sm" />
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveImageFromArray('gridImages', index); }} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">×</button>
                            </div>
                          ))}
                          <button onClick={(e) => { e.stopPropagation(); handleAddImage('gridImages'); }} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-purple-500 hover:text-purple-500">+ Adicionar Imagem</button>
                        </div>
                        {selectedSection.content.gridImages?.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {selectedSection.content.gridImages.map((img, index) => (
                              img && <img key={index} src={img} alt={`Grid ${index}`} className="w-full h-24 object-cover rounded" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Accordion>

                  <Accordion id="content-background" title="🎨 Fundo da Seção">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBackgroundTypeChange('color'); }}
                        className={`flex-1 py-2 rounded ${
                          selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType
                            ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Cor de Fundo
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBackgroundTypeChange('image'); }}
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
                          onChange={(e) => handleColorChange(e, 'backgroundColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded"
                        />
                      </div>
                    )}
                    {selectedSection.styles.backgroundType === 'image' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'backgroundImage', true)} className="w-full" />
                          {selectedSection.styles.backgroundImage && (
                            <img src={selectedSection.styles.backgroundImage} alt="Fundo" className="mt-2 w-full h-48 object-cover rounded" />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Opacidade: {selectedSection.styles.backgroundOpacity || 100}%</label>
                          <input type="range" min="0" max="100" value={selectedSection.styles.backgroundOpacity || 100} onChange={(e) => { e.stopPropagation(); handleStyleUpdate('backgroundOpacity', parseInt(e.target.value)); }} className="w-full" />
                        </div>
                      </>
                    )}
                  </Accordion>

                  {/* 📐 Padding para Content */}
                  <Accordion id="content-padding" title="📐 Espaçamento da Seção">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Padding Vertical</label>
                        <select
                          value={selectedSection.styles?.padding?.vertical || 'py-8'}
                          onChange={(e) => handlePaddingUpdate('vertical', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="py-2">Mínimo</option>
                          <option value="py-4">Pequeno</option>
                          <option value="py-8">Normal</option>
                          <option value="py-12">Grande</option>
                          <option value="py-16">Extra Grande</option>
                          <option value="py-0">Sem padding</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>
                </div>
              )}

              {/* ========== CONTACT SECTION EDITOR ========== */}
              {selectedSection.section_type === 'contact' && (
                <div className="space-y-3">
                  <Accordion id="contact-content" title="📝 Conteúdo" defaultOpen={true}>
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
                  </Accordion>

                  <Accordion id="contact-text-colors" title="🎨 Cores dos Textos">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor do Título</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.titleColor || config.cor_texto || '#000000'}
                          onChange={(e) => handleColorChange(e, 'titleColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Cor do Texto</label>
                        <input
                          type="color"
                          value={selectedSection.styles?.textColor || '#374151'}
                          onChange={(e) => handleColorChange(e, 'textColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="contact-alignments" title="📐 Alinhamentos">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Alinhamento do Título</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={(e) => { e.stopPropagation(); handleStyleUpdate('titleAlign', align); }}
                              className={`flex-1 py-2 rounded text-sm ${
                                selectedSection.styles?.titleAlign === align || (!selectedSection.styles?.titleAlign && align === 'center')
                                  ? 'bg-purple-600 text-white' : 'bg-gray-200'
                              }`}
                            >
                              {align === 'left' ? '⬅️' : align === 'center' ? '↕️' : '➡️'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Alinhamento do Texto</label>
                        <div className="flex gap-2">
                          {['left', 'center', 'right'].map(align => (
                            <button
                              key={align}
                              onClick={(e) => { e.stopPropagation(); handleStyleUpdate('textAlign', align); }}
                              className={`flex-1 py-2 rounded text-sm ${
                                selectedSection.styles?.textAlign === align || (!selectedSection.styles?.textAlign && align === 'center')
                                  ? 'bg-purple-600 text-white' : 'bg-gray-200'
                              }`}
                            >
                              {align === 'left' ? '⬅️' : align === 'center' ? '↕️' : '➡️'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="contact-font" title="🔤 Estilo da Fonte">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tamanho do Título</label>
                        <select
                          value={selectedSection.styles?.titleFontSize || 'medium'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('titleFontSize', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="small">Pequeno</option>
                          <option value="medium">Médio</option>
                          <option value="large">Grande</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Peso do Título</label>
                        <select
                          value={selectedSection.styles?.titleFontWeight || 'semibold'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('titleFontWeight', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="normal">Normal</option>
                          <option value="semibold">Semi-negrito</option>
                          <option value="bold">Negrito</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tamanho do Texto</label>
                        <select
                          value={selectedSection.styles?.textFontSize || 'medium'}
                          onChange={(e) => { e.stopPropagation(); handleStyleUpdate('textFontSize', e.target.value); }}
                          className="w-full p-2 border rounded"
                        >
                          <option value="small">Pequeno</option>
                          <option value="medium">Médio</option>
                          <option value="large">Grande</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>

                  <Accordion id="contact-background" title="🎨 Fundo da Seção">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBackgroundTypeChange('color'); }}
                        className={`flex-1 py-2 rounded ${
                          selectedSection.styles.backgroundType === 'color' || !selectedSection.styles.backgroundType
                            ? 'bg-purple-600 text-white' : 'bg-gray-200'
                        }`}
                      >
                        Cor de Fundo
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBackgroundTypeChange('image'); }}
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
                          onChange={(e) => handleColorChange(e, 'backgroundColor', true)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-10 rounded"
                        />
                      </div>
                    )}
                    {selectedSection.styles.backgroundType === 'image' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Imagem de Fundo</label>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'backgroundImage', true)} className="w-full" />
                          {selectedSection.styles.backgroundImage && (
                            <img src={selectedSection.styles.backgroundImage} alt="Fundo" className="mt-2 w-full h-48 object-cover rounded" />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Opacidade: {selectedSection.styles.backgroundOpacity || 100}%</label>
                          <input type="range" min="0" max="100" value={selectedSection.styles.backgroundOpacity || 100} onChange={(e) => { e.stopPropagation(); handleStyleUpdate('backgroundOpacity', parseInt(e.target.value)); }} className="w-full" />
                        </div>
                      </>
                    )}
                  </Accordion>

                  {/* 📐 Padding para Contact */}
                  <Accordion id="contact-padding" title="📐 Espaçamento da Seção">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Padding Vertical</label>
                        <select
                          value={selectedSection.styles?.padding?.vertical || 'py-8'}
                          onChange={(e) => handlePaddingUpdate('vertical', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="py-2">Mínimo</option>
                          <option value="py-4">Pequeno</option>
                          <option value="py-8">Normal</option>
                          <option value="py-12">Grande</option>
                          <option value="py-16">Extra Grande</option>
                          <option value="py-0">Sem padding</option>
                        </select>
                      </div>
                    </div>
                  </Accordion>
                </div>
              )}

              <button onClick={(e) => { e.stopPropagation(); salvarSection(selectedSection); }} className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full font-semibold">
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
        <div className="flex-1 min-w-0 bg-cyan-200 rounded-2xl p-6">
          <SitePreview config={config} sections={sections} selectedSection={selectedSection} />
        </div>
      </div>
    </div>
  );
}