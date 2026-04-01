// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { apiRequest, uploadImage } from '../lib/apiClient';
import { useNavigate } from 'react-router-dom';
import SitePreview from '../components/SitePreview';

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
  const navigate = useNavigate();

  useEffect(() => { verificarAuth(); }, []);

  const verificarAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) { navigate('/login'); return; }
      setUser(session.user);
      await Promise.all([carregarConfig(session.user.id), carregarSections(session.user.id)]);
    } catch (err) {
      console.error('Erro na auth:', err);
      navigate('/login');
    } finally { setLoading(false); }
  };

  const carregarConfig = async (profileId) => {
    try {
      const data = await apiRequest(`/api/config?profile_id=${profileId}`);
      if (data && Object.keys(data).length > 0) setConfig(data);
    } catch (e) { console.error('Erro ao carregar config:', e); }
  };

  const carregarSections = async (profileId) => {
    try {
      const data = await apiRequest(`/api/sections?profile_id=${profileId}&show_all=true`);
      if (data && data.length > 0) { setSections(data); }
      else {
        await apiRequest('/api/sections/init', { method: 'POST' });
        const newData = await apiRequest(`/api/sections?profile_id=${profileId}&show_all=true`);
        setSections(newData);
      }
    } catch (e) { console.error('Erro ao carregar sections:', e); }
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
    } catch (e) { alert('❌ Erro: ' + e.message); }
    finally { setSaving(false); }
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
    } catch (e) { alert('❌ Erro ao salvar: ' + e.message); }
  };

  const togglePublish = async (section, newStatus) => {
    try {
      await apiRequest('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: section.id, section_type: section.section_type,
          section_order: section.section_order, content: section.content,
          styles: section.styles, is_active: newStatus ? 1 : 0
        })
      });
      await carregarSections(user.id);
      alert(newStatus ? '✅ Seção publicada!' : '⏸️ Seção despublicada!');
    } catch (e) { alert('❌ Erro: ' + e.message); }
  };

  const deleteOldImage = async (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    try {
      const urlObj = new URL(imageUrl);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      const fileName = pathParts.slice(-2).join('/');
      if (!fileName) return;
      await apiRequest(`/api/upload/${encodeURIComponent(fileName)}`, { method: 'DELETE' });
    } catch (e) { console.warn('⚠️ Não foi possível deletar imagem:', e.message); }
  };

  const handleSectionUpdate = (field, value) => {
    if (!selectedSection) return;
    setSelectedSection({ ...selectedSection, content: { ...selectedSection.content, [field]: value } });
  };

  const handleStyleUpdate = (field, value) => {
    if (!selectedSection) return;
    setSelectedSection({ ...selectedSection, styles: { ...selectedSection.styles, [field]: value } });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 10 * 1024 * 1024) { alert('❌ Imagem muito grande. Máximo 10MB.'); return; }
    try {
      const oldImageUrl = selectedSection?.content?.logo;
      alert('📤 Fazendo upload...');
      const { url: newUrl } = await uploadImage(file);
      await apiRequest('/api/sections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedSection, content: { ...selectedSection.content, logo: newUrl } })
      });
      if (oldImageUrl) await deleteOldImage(oldImageUrl);
      await carregarSections(user.id);
      alert('✅ Logo atualizada!');
    } catch (e) { alert('❌ Erro: ' + e.message); }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 10 * 1024 * 1024) { alert('❌ Imagem muito grande. Máximo 10MB.'); return; }
    try {
      const oldImageUrl = selectedSection?.content?.image;
      alert('📤 Fazendo upload...');
      const { url: newUrl } = await uploadImage(file);
      await apiRequest('/api/sections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedSection, content: { ...selectedSection.content, image: newUrl } })
      });
      if (oldImageUrl) await deleteOldImage(oldImageUrl);
      await carregarSections(user.id);
      alert('✅ Imagem atualizada!');
    } catch (e) { alert('❌ Erro: ' + e.message); }
  };

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 10 * 1024 * 1024) { alert('❌ Imagem muito grande. Máximo 10MB.'); return; }
    try {
      const oldImageUrl = selectedSection?.styles?.backgroundImage;
      alert('📤 Fazendo upload...');
      const { url: newUrl } = await uploadImage(file);
      await apiRequest('/api/sections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedSection, styles: { ...selectedSection.styles, backgroundImage: newUrl } })
      });
      if (oldImageUrl) await deleteOldImage(oldImageUrl);
      await carregarSections(user.id);
      alert('✅ Fundo atualizado!');
    } catch (e) { alert('❌ Erro: ' + e.message); }
  };

  const handleLeftImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 10 * 1024 * 1024) { alert('❌ Imagem muito grande. Máximo 10MB.'); return; }
    try {
      const oldImageUrl = selectedSection?.content?.leftImage;
      alert('📤 Fazendo upload...');
      const { url: newUrl } = await uploadImage(file);
      await apiRequest('/api/sections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedSection, content: { ...selectedSection.content, leftImage: newUrl } })
      });
      if (oldImageUrl) await deleteOldImage(oldImageUrl);
      await carregarSections(user.id);
      alert('✅ Imagem esquerda atualizada!');
    } catch (e) { alert('❌ Erro: ' + e.message); }
  };

  const handleRightImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 10 * 1024 * 1024) { alert('❌ Imagem muito grande. Máximo 10MB.'); return; }
    try {
      const oldImageUrl = selectedSection?.content?.rightImage;
      alert('📤 Fazendo upload...');
      const { url: newUrl } = await uploadImage(file);
      await apiRequest('/api/sections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedSection, content: { ...selectedSection.content, rightImage: newUrl } })
      });
      if (oldImageUrl) await deleteOldImage(oldImageUrl);
      await carregarSections(user.id);
      alert('✅ Imagem direita atualizada!');
    } catch (e) { alert('❌ Erro: ' + e.message); }
  };

  const handleBackgroundTypeChange = (type) => {
    setSelectedSection({ ...selectedSection, styles: { ...selectedSection.styles, backgroundType: type } });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.cor_fundo, color: config.cor_texto }}>
      {/* Header Admin */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <div className="flex gap-2">
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800">Ver Site</button>
            <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800">Sair</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 flex gap-4">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab('sections')} className={`flex-1 py-2 rounded ${activeTab === 'sections' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Seções</button>
            <button onClick={() => setActiveTab('config')} className={`flex-1 py-2 rounded ${activeTab === 'config' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>Config</button>
          </div>

          {activeTab === 'sections' && (
            <div className="space-y-2">
              {sections.map((section, index) => (
                <div key={section.id} className="relative group">
                  <button onClick={() => setSelectedSection(section)} className={`w-full p-3 rounded-lg text-left transition ${selectedSection?.id === section.id ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gradient-to-r from-green-50 to-blue-100 hover:from-green-100 hover:to-blue-200'} ${section.is_active === 0 ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-center">
                      <span>{section.section_type === 'header' && 'Header'}{section.section_type === 'hero' && 'Hero'}{section.section_type === 'products' && 'Produtos'}{section.section_type === 'content' && `Sessão ${index + 1}`}</span>
                      <span className={`text-xs px-2 py-1 rounded ${section.is_active === 1 ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>{section.is_active === 1 ? '✓' : '○'}</span>
                    </div>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); togglePublish(section, section.is_active === 0); }} className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition px-2 py-1 rounded text-xs ${section.is_active === 1 ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>{section.is_active === 1 ? 'Despublicar' : 'Publicar'}</button>
                </div>
              ))}
              <button className="w-full p-3 text-blue-400 text-2xl font-bold hover:bg-blue-50 rounded-lg mt-2">+ Adicionar Seção</button>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Configurações Gerais</h3>
              <div><label className="block text-sm font-medium mb-1">Nome da Loja</label><input type="text" value={config.nome_loja || ''} onChange={(e) => setConfig({...config, nome_loja: e.target.value})} className="w-full p-2 border rounded" placeholder="Minha Loja" /></div>
              <div><label className="block text-sm font-medium mb-1">Cor de Fundo</label><input type="color" value={config.cor_fundo} onChange={(e) => setConfig({...config, cor_fundo: e.target.value})} className="w-full h-10 rounded cursor-pointer" /></div>
              <div><label className="block text-sm font-medium mb-1">Cor do Texto</label><input type="color" value={config.cor_texto} onChange={(e) => setConfig({...config, cor_texto: e.target.value})} className="w-full h-10 rounded cursor-pointer" /></div>
              <div><label className="block text-sm font-medium mb-1">Cor do Botão/Footer</label><input type="color" value={config.cor_botao} onChange={(e) => setConfig({...config, cor_botao: e.target.value})} className="w-full h-10 rounded cursor-pointer" /></div>
              <div><label className="block text-sm font-medium mb-1">Texto do Footer</label><input type="text" value={config.footer_texto} onChange={(e) => setConfig({...config, footer_texto: e.target.value})} className="w-full p-2 border rounded" placeholder="© 2024 Minha Loja" /></div>
              <button onClick={salvarConfig} disabled={saving} className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">{saving ? 'Salvando...' : '💾 Salvar Configurações'}</button>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
          {selectedSection ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Editando: {selectedSection.section_type}</h2>
                <button onClick={() => togglePublish(selectedSection, selectedSection.is_active === 0)} className={`px-4 py-2 rounded-lg font-medium ${selectedSection.is_active === 1 ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>{selectedSection.is_active === 1 ? '🔓 Despublicar' : '✅ Publicar'}</button>
              </div>

              {/* Header Editor */}
              {selectedSection.section_type === 'header' && (
                <div className="space-y-5">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-purple-800 mb-3">🎨 Aparência do Header</h3>
                    <div className="flex gap-2 mb-4">
                      <button onClick={() => handleStyleUpdate('bgType', 'solid')} className={`flex-1 py-2 rounded text-sm ${selectedSection.styles?.bgType === 'solid' || !selectedSection.styles?.bgType ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>Cor Sólida</button>
                      <button onClick={() => handleStyleUpdate('bgType', 'gradient')} className={`flex-1 py-2 rounded text-sm ${selectedSection.styles?.bgType === 'gradient' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>Gradiente</button>
                    </div>
                    {(selectedSection.styles?.bgType === 'solid' || !selectedSection.styles?.bgType) && <div className="mb-3"><label className="block text-xs font-medium mb-1">Cor de Fundo</label><input type="color" value={selectedSection.styles?.bgColor || config.cor_fundo || '#ffffff'} onChange={(e) => handleStyleUpdate('bgColor', e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div>}
                    {selectedSection.styles?.bgType === 'gradient' && <div className="grid grid-cols-2 gap-3 mb-3"><div><label className="block text-xs font-medium mb-1">Cor Inicial</label><input type="color" value={selectedSection.styles?.gradientStart || '#667eea'} onChange={(e) => handleStyleUpdate('gradientStart', e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div><div><label className="block text-xs font-medium mb-1">Cor Final</label><input type="color" value={selectedSection.styles?.gradientEnd || '#764ba2'} onChange={(e) => handleStyleUpdate('gradientEnd', e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div></div>}
                    <div><label className="block text-xs font-medium mb-1">Cor do Texto</label><input type="color" value={selectedSection.styles?.textColor || config.cor_texto || '#000000'} onChange={(e) => handleStyleUpdate('textColor', e.target.value)} className="w-full h-10 rounded cursor-pointer" /></div>
                  </div>
                  {/* ... (resto do editor de header, hero, etc. mantém igual ao seu código original) ... */}
                </div>
              )}

              {/* Hero Editor */}
              {selectedSection.section_type === 'hero' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">📝 Conteúdo</h3>
                  <div><label className="block text-sm font-medium mb-2">Título Principal</label><input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded text-xl" /></div>
                  <div><label className="block text-sm font-medium mb-2">Subtítulo/Descrição</label><textarea value={selectedSection.content.subtitle || ''} onChange={(e) => handleSectionUpdate('subtitle', e.target.value)} className="w-full p-2 border rounded" rows="3" /></div>
                  <div><label className="block text-sm font-medium mb-2">Imagem Principal</label><input type="file" accept="image/*" onChange={handleHeroImageUpload} className="w-full" />{selectedSection.content.image && <img src={selectedSection.content.image} alt="Principal" className="mt-2 w-full h-48 object-cover rounded" />}</div>
                  {/* ... (resto do editor de hero mantém igual) ... */}
                </div>
              )}

              {/* Products/Content Editors */}
              {selectedSection.section_type === 'products' && <div className="space-y-4"><div><label className="block text-sm font-medium mb-2">Título da Seção</label><input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded" /></div><p className="text-sm text-gray-500">Esta seção mostra automaticamente os produtos cadastrados.</p></div>}
              {selectedSection.section_type === 'content' && <div className="space-y-4"><div><label className="block text-sm font-medium mb-2">Título</label><input type="text" value={selectedSection.content.title || ''} onChange={(e) => handleSectionUpdate('title', e.target.value)} className="w-full p-2 border rounded" /></div><div><label className="block text-sm font-medium mb-2">Texto</label><textarea value={selectedSection.content.text || ''} onChange={(e) => handleSectionUpdate('text', e.target.value)} className="w-full p-2 border rounded" rows="4" /></div></div>}

              <button onClick={() => salvarSection(selectedSection)} className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">💾 Salvar Alterações</button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400"><p>Selecione uma seção para editar</p></div>
          )}
        </div>

        {/* Preview */}
        <div className="flex-1 bg-cyan-200 rounded-2xl p-6">
          <SitePreview config={config} sections={sections} selectedSection={selectedSection} />
        </div>
      </div>
    </div>
  );
}