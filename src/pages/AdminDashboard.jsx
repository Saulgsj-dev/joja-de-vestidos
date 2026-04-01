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
    try {
      await saveConfig(config);
      alert('✅ Configurações salvas!');
    } catch (e) {
      alert('❌ Erro: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSection = async (sectionData) => {
    try {
      await saveSection(sectionData);
      alert('✅ Seção salva!');
    } catch (e) {
      alert('❌ Erro ao salvar: ' + e.message);
    }
  };

  const handleTogglePublish = async (section, newStatus) => {
    try {
      await togglePublish(section, newStatus);
      alert(newStatus ? '✅ Seção publicada!' : '⏸️ Seção despublicada!');
    } catch (e) {
      alert('❌ Erro: ' + e.message);
    }
  };

  const handleUpdateSection = (updatedSection) => {
    setSelectedSection(updatedSection);
  };

  if (authLoading || sectionsLoading || configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const publicSiteUrl = storeSlug ? `/${storeSlug}` : '/';

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.cor_fundo, color: config.cor_texto }}>
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{config.nome_loja || 'Minha loja de vestidos'}</h1>
          <div className="flex gap-2">
            <button onClick={() => navigate(publicSiteUrl)} className="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800">
              Ver Site
            </button>
            <button onClick={signOut} className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 flex gap-4 flex-wrap lg:flex-nowrap">
        <AdminSidebar
          sections={sections}
          selectedSection={selectedSection}
          activeTab={activeTab}
          activeAccordion={activeAccordion}
          onSelectSection={setSelectedSection}
          onToggleTab={setActiveTab}
          onToggleAccordion={setActiveAccordion}
          onTogglePublish={handleTogglePublish}
          onLoadSections={loadSections}
        />

        <div className="flex-1 min-w-0 bg-white rounded-2xl p-6 shadow-lg">
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
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Selecione uma seção para editar</p>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 bg-cyan-200 rounded-2xl p-6">
          <SitePreview config={config} sections={sections} selectedSection={selectedSection} />
        </div>
      </div>
    </div>
  );
}