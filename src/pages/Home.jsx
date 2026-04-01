import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiClient';
import { supabase } from '../lib/supabaseClient';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

export default function Home() {
  const { storeId } = useParams(); // ID da loja na URL (opcional)
  const [sections, setSections] = useState([]);
  const [config, setConfig] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    // ✅ Prioriza: 1) storeId da URL, 2) sessão do usuário, 3) ID padrão público
    const getProfileId = async () => {
      if (storeId) {
        setProfileId(storeId);
        return;
      }
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          setProfileId(session.user.id);
          return;
        }
      } catch (error) {
        console.error('Erro ao pegar session:', error);
      }
      
      // ✅ FALLBACK: ID padrão para loja pública (configure no backend)
      setProfileId('public');
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
      // ✅ Rotas públicas não precisam de token
      const [sectionsData, configData, produtosData] = await Promise.all([
        apiRequest(`/api/sections?profile_id=${profileId}`).catch(() => []),
        apiRequest(`/api/config?profile_id=${profileId}`),
        apiRequest(`/api/produtos?profile_id=${profileId}`)
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

  const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESem imagem%3C/text%3E%3C/svg%3E`;

  const renderSection = (section) => {
    const { content, styles, section_type } = section;

    switch (section_type) {
      case 'header':
        return null;

      case 'hero':
        const hasLeftImage = content.leftImage;
        const hasRightImage = content.rightImage;
        const backgroundStyle = {};

        if (styles.backgroundType === 'image' && styles.backgroundImage) {
          const opacity = (styles.backgroundOpacity || 100) / 100;
          backgroundStyle.backgroundImage = `url(${styles.backgroundImage})`;
          backgroundStyle.backgroundSize = 'cover';
          backgroundStyle.backgroundPosition = 'center';
          backgroundStyle.backgroundRepeat = 'no-repeat';
          backgroundStyle.backgroundColor = `rgba(0, 0, 0, ${0.4 * opacity})`;
          backgroundStyle.backgroundBlendMode = 'multiply';
        } else {
          backgroundStyle.backgroundColor = styles.backgroundColor || '#faf5ff';
        }

        return (
          <section
            key={section.id}
            className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 relative overflow-hidden"
            style={backgroundStyle}
          >
            <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto relative z-10">
              {hasLeftImage && hasRightImage ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
                  <div className="hidden lg:block order-2 lg:order-1">
                    <img src={content.leftImage} alt="Esquerda" className="w-full h-auto max-h-80 lg:max-h-96 object-contain rounded-lg shadow-xl" />
                  </div>
                  <div className="order-1 lg:order-2 text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-white drop-shadow-lg">
                      {content.title || 'Bem-vindo'}
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-lg mx-auto mb-4 sm:mb-6 px-2 text-white drop-shadow-md">
                      {content.subtitle || 'Sua mensagem aqui'}
                    </p>
                    {content.image && (
                      <div className="relative w-full flex justify-center mt-4 sm:mt-6">
                        <img src={content.image} alt="Principal" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: 'min(40vh, 350px)' }} />
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block order-3">
                    <img src={content.rightImage} alt="Direita" className="w-full h-auto max-h-80 lg:max-h-96 object-contain rounded-lg shadow-xl" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-white drop-shadow-lg px-2">
                    {content.title || 'Bem-vindo'}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 sm:mb-8 px-4 text-white drop-shadow-md">
                    {content.subtitle || 'Sua mensagem aqui'}
                  </p>
                  {content.image && (
                    <div className="relative w-full flex justify-center">
                      <img src={content.image} alt="Principal" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: 'min(50vh, 450px)' }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        );

      case 'products':
        return (
          <section key={section.id} className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8" style={{ color: config?.cor_texto }}>
              {content.title || 'Nossos Produtos'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {produtos.map(produto => (
                <div key={produto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  <div className="aspect-square bg-gray-100">
                    <img src={produto.imagem_url || PLACEHOLDER} alt={produto.titulo} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-base sm:text-lg" style={{ color: config?.cor_texto }}>{produto.titulo}</h4>
                    {produto.preco && <p className="font-bold text-lg sm:text-xl mt-2" style={{ color: config?.cor_botao }}>{produto.preco}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'content':
        return (
          <section key={section.id} className="py-6 sm:py-8 px-4 bg-gradient-to-r from-green-50 to-blue-100">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: config?.cor_texto }}>{content.title || 'Sessão'}</h3>
              {content.text && <p className="text-gray-700 text-sm sm:text-base">{content.text}</p>}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: config?.cor_fundo || '#fff', color: config?.cor_texto }}>
      <Header config={config} sections={sections} />
      
      {sections.length > 0 ? (
        sections.filter(s => s.section_type !== 'header').map(renderSection)
      ) : (
        <section className="py-12 sm:py-16 px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: config?.cor_texto }}>
            Bem-vindo!
          </h2>
          <p className="text-sm sm:text-base lg:text-lg opacity-80" style={{ color: config?.cor_texto }}>
            Configure seu site pelo painel administrativo
          </p>
        </section>
      )}

      <footer className="p-4 sm:p-6 text-center mt-12" style={{ backgroundColor: config?.cor_botao || '#000', color: '#fff' }}>
        <p className="text-sm sm:text-base">{config?.footer_texto || '© 2024 Todos os direitos reservados'}</p>
      </footer>
    </div>
  );
}