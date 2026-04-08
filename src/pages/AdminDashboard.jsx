// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSections } from '../hooks/useSections';
import { useConfig } from '../hooks/useConfig';
import { apiRequest } from '../lib/apiClient';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminConfig from '../components/admin/AdminConfig';
import SectionEditor from '../components/admin/SectionEditor/SectionEditor';
import SitePreview from '../components/preview/SitePreview';

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('sections');
  const [activeAccordion, setActiveAccordion] = useState('content');
  const [storeSlug, setStoreSlug] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState(null);
  const [displayName, setDisplayName] = useState('Minha loja de vestidos');

  const { sections, loading: sectionsLoading, loadSections, saveSection, togglePublish } = useSections(user?.id);
  const { config, loading: configLoading, saveConfig, loadConfig, setConfig } = useConfig(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      loadSections();
      loadConfig();
      getStoreSlug();
    }
  }, [user, authLoading]);

  // ✅ Sincroniza o nome com o display name
  useEffect(() => {
    if (config?.nome_loja) {
      setDisplayName(config.nome_loja);
    }
  }, [config?.nome_loja]);

  const getStoreSlug = async () => {
    try {
      const profile = await apiRequest(`/api/profile/by-user/${user.id}`);
      if (profile?.slug) {
        setStoreSlug(profile.slug);
      }
    } catch (e) {
      console.log('⚠️ Slug não encontrado');
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setError(null);
    try {
      console.log('💾 Salvando config:', config);
      await saveConfig(config);
      // ✅ Atualiza o display name após salvar
      if (config.nome_loja) {
        setDisplayName(config.nome_loja);
      }
      alert('✅ Configurações salvas com sucesso!');
    } catch (e) {
      console.error('❌ Erro ao salvar config:', e);
      setError('Erro ao salvar: ' + e.message);
      alert('❌ Erro ao salvar configurações: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSection = async (sectionData) => {
    try {
      console.log('💾 Salvando seção:', sectionData);
      await saveSection(sectionData);
      alert('✅ Seção salva com sucesso!');
      setSelectedSection(null);
    } catch (e) {
      console.error('❌ Erro ao salvar seção:', e);
      alert('❌ Erro ao salvar: ' + e.message);
    }
  };

  const handleTogglePublish = async (section, newStatus) => {
    try {
      await togglePublish(section, newStatus);
      alert(newStatus ? '✅ Seção publicada!' : '⏸️ Seção despublicada!');
      // Recarrega as seções para atualizar a lista
      await loadSections();
    } catch (e) {
      console.error('❌ Erro ao publicar/despublicar:', e);
      alert('❌ Erro: ' + e.message);
    }
  };

  const handleUpdateSection = (updatedSection) => {
    setSelectedSection(updatedSection);
  };

  if (authLoading || sectionsLoading || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent"></div>
        <p className="ml-4 text-gray-600">Carregando...</p>
      </div>
    );
  }

  const publicSiteUrl = storeSlug ? `/${storeSlug}` : '/';

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: config.cor_fundo, color: config.cor_texto }}>
      {/* 🔹 HEADER RESPONSIVO - ✅ Nome dinâmico */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 sm:p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          <h1 className="text-lg sm:text-2xl font-bold truncate flex-1">
            {displayName}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(publicSiteUrl)}
              className="px-3 sm:px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg text-xs sm:text-sm font-medium transition shadow-md"
            >
              <span className="hidden sm:inline">Ver Site</span>
              <span className="sm:hidden">👁️</span>
            </button>
            <button
              onClick={signOut}
              className="px-3 sm:px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-xs sm:text-sm font-medium transition shadow-md"
            >
              <span className="hidden sm:inline">Sair</span>
              <span className="sm:hidden">🚪</span>
            </button>
          </div>
        </div>
      </header>

      {/* 🔹 BOTÃO MOBILE PARA TOGGLE SIDEBAR */}
      <div className="lg:hidden p-3 bg-white border-b shadow-sm sticky top-[60px] z-40">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {showSidebar ? 'Ocultar Menu' : 'Mostrar Menu'}
        </button>
      </div>

      {/* 🔹 MENSAGEM DE ERRO */}
      {error && (
        <div className="max-w-[1800px] mx-auto p-3">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <button onClick={() => setError(null)} className="ml-4 font-bold">×</button>
          </div>
        </div>
      )}

      {/* 🔹 LAYOUT PRINCIPAL - 3 COLUNAS (DESKTOP) / 1 COLUNA (MOBILE) */}
      <div className="max-w-[1800px] mx-auto p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 📱 SIDEBAR - Mobile: Toggle / Desktop: Sempre visível */}
          <div className={`lg:block ${showSidebar ? 'block' : 'hidden'} w-full lg:w-80 flex-shrink-0`}>
            <div className="sticky top-[120px] lg:top-[100px]">
              <AdminSidebar
                sections={sections}
                selectedSection={selectedSection}
                activeTab={activeTab}
                activeAccordion={activeAccordion}
                onSelectSection={(section) => {
                  setSelectedSection(section);
                  setShowSidebar(false);
                }}
                onToggleTab={setActiveTab}
                onToggleAccordion={setActiveAccordion}
                onTogglePublish={handleTogglePublish}
                onLoadSections={loadSections}
              />
            </div>
          </div>

          {/* 📝 EDITOR - Ocupa espaço disponível */}
          <div className="bg-white rounded-2xl shadow-lg h-[80vh] flex flex-col overflow-hidden">
            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {activeTab === 'config' ? (
                <AdminConfig
                  config={config}
                  setConfig={setConfig}
                  onSave={handleSaveConfig}
                  saving={saving}
                />
              ) : selectedSection ? (
                <SectionEditor
                  section={selectedSection}
                  config={config}
                  activeAccordion={activeAccordion}
                  onSave={handleSaveSection}
                  onTogglePublish={handleTogglePublish}
                  onUpdateSection={handleUpdateSection}
                  onSetActiveAccordion={setActiveAccordion}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <p className="text-lg font-medium">Selecione uma seção para editar</p>
                  <p className="text-sm mt-2">Clique em uma seção na barra lateral</p>
                </div>
              )}
            </div>
          </div>

          {/* 👁️ PREVIEW - Desktop: Lado direito / Mobile: Abaixo */}
          <div className="flex-1 min-w-0 order-3 lg:order-3">
            <div className="bg-cyan-100 rounded-2xl p-3 sm:p-6 shadow-lg">
              <div className="bg-white rounded-xl p-2 sm:p-3">
                <SitePreview
                  config={config}
                  sections={sections}
                  selectedSection={selectedSection}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 OVERLAY PARA MOBILE (fecha sidebar ao clicar fora) */}
      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}