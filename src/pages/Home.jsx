// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/apiClient';
import Header from '../components/site/Header';
import Footer from '../components/site/Footer';
import HeroSection from '../components/site/Sections/HeroSection';
import ProductsSection from '../components/site/Sections/ProductsSection';
import ContentSection from '../components/site/Sections/ContentSection';
import ContactSection from '../components/site/Sections/ContactSection';

export default function Home() {
  const { storeId } = useParams();
  const location = useLocation();
  const [sections, setSections] = useState([]);
  const [config, setConfig] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [storeSlug, setStoreSlug] = useState(null);

  // ✅ Efeito para atualizar meta tags dinamicamente (SEO)
  useEffect(() => {
    if (config?.nome_loja) {
      // Atualiza título da página
      document.title = `${config.nome_loja} | Site Oficial`;
      
      // Atualiza ou cria meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      
      // Busca subtítulo do hero para descrição
      const heroSection = sections.find(s => s.section_type === 'hero');
      const description = heroSection?.content?.subtitle || 
        `Conheça ${config.nome_loja} - Qualidade e excelência em nossos serviços.`;
      
      // SEO: max 160 caracteres para meta description
      metaDesc.content = description.slice(0, 160);
    }
  }, [config, sections]);

  useEffect(() => {
    const getProfileId = async () => {
      if (storeId) {
        setStoreSlug(storeId);
        try {
          const profile = await apiRequest(`/api/profile/${storeId}`);
          if (profile?.id) {
            setProfileId(profile.id);
          } else {
            setNotFound(true);
          }
        } catch (error) {
          setNotFound(true);
        }
        return;
      }
      setNotFound(true);
    };
    
    getProfileId();
  }, [storeId]);

  useEffect(() => {
    if (profileId) {
      carregarDados();
    }
  }, [profileId]);

  const carregarDados = async () => {
    try {
      const [sectionsData, configData, produtosData] = await Promise.all([
        apiRequest(`/api/sections?profile_id=${profileId}`).catch(() => []),
        apiRequest(`/api/config?profile_id=${profileId}`).catch(() => ({})),
        apiRequest(`/api/produtos?profile_id=${profileId}`).catch(() => [])
      ]);
      
      setSections(sectionsData || []);
      setConfig(configData || {});
      setProdutos(produtosData || []);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 text-lg">Site não encontrado</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const renderSection = (section) => {
    switch (section.section_type) {
      case 'header': return null;
      case 'hero': return <HeroSection key={section.id} section={section} config={config} />;
      case 'products': return <ProductsSection key={section.id} section={section} config={config} produtos={produtos} />;
      case 'content': return <ContentSection key={section.id} section={section} config={config} />;
      case 'contact': return <ContactSection key={section.id} section={section} config={config} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: config?.cor_fundo || '#fff', color: config?.cor_texto }}>
      <Header config={config} sections={sections} storeSlug={storeSlug} />
      
      {/* ✅ Main landmark para acessibilidade e SEO */}
      <main id="main-content" className="focus:outline-none">
        {sections.length > 0 ? (
          sections
            .filter(section => section.section_type !== 'header' && section.section_type !== 'footer')
            .map(renderSection)
        ) : (
          <section className="py-16 px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: config?.cor_texto }}>
              Bem-vindo
            </h2>
            <p className="text-gray-600">Site em construção</p>
          </section>
        )}
      </main>
      
      <Footer config={config} sections={sections} />
    </div>
  );
}