import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiClient';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [sections, setSections] = useState([]);
  const [config, setConfig] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);

  // ✅ Obtém o profile_id do usuário logado
  useEffect(() => {
    const getProfileId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const id = session?.user?.id || null;
      setProfileId(id);
    };
    getProfileId();
  }, []);

  // ✅ Carrega dados apenas após ter o profile_id
  useEffect(() => {
    if (profileId) {
      carregarDados();
    }
  }, [profileId]);

  const carregarDados = async () => {
    try {
      const [sectionsData, configData, produtosData] = await Promise.all([
        apiRequest(`/api/sections?profile_id=${profileId}`).catch(() => []),
        apiRequest(`/api/config?profile_id=${profileId}`),
        apiRequest(`/api/produtos?profile_id=${profileId}`)
      ]);
      setSections(sectionsData || []);
      setConfig(configData || {});
      setProdutos(produtosData || []);
    } catch (e) {
      console.error('Erro:', e);
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

  // Renderiza cada tipo de seção
  const renderSection = (section) => {
    const { content, styles, section_type } = section;
    
    switch (section_type) {
      case 'header':
        return (
          <header key={section.id} className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">{content.title || 'Minha Loja de Vestidos'}</h1>
              <div className="flex gap-2">
                <a href="/admin" className="px-4 py-2 bg-black rounded-lg hover:bg-gray-800">Painel</a>
              </div>
            </div>
          </header>
        );
        
      case 'hero':
        // Determina o layout baseado nas imagens laterais
        const hasLeftImage = content.leftImage;
        const hasRightImage = content.rightImage;
        
        // Calcula o estilo de fundo
        const backgroundStyle = {};
        if (styles.backgroundType === 'image' && styles.backgroundImage) {
          const opacity = (styles.backgroundOpacity || 100) / 100;
          backgroundStyle.backgroundImage = `url(${styles.backgroundImage})`;
          backgroundStyle.backgroundSize = 'cover';
          backgroundStyle.backgroundPosition = 'center';
          backgroundStyle.opacity = opacity;
        } else {
          backgroundStyle.backgroundColor = styles.backgroundColor || '#faf5ff';
        }

        return (
          <section
            key={section.id}
            className="py-16 px-4 relative"
            style={backgroundStyle}
          >
            <div className="max-w-7xl mx-auto">
              {/* Layout com 2 imagens laterais */}
              {hasLeftImage && hasRightImage ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <img 
                      src={content.leftImage} 
                      alt="Lateral Esquerda" 
                      className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl"
                    />
                  </div>
                  <div className="order-1 md:order-2 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      {content.title || 'Coleção de Vestidos'}
                    </h2>
                    <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
                      {content.subtitle || 'Elegância e estilo para você'}
                    </p>
                    {content.image && (
                      <img 
                        src={content.image} 
                        alt="Principal" 
                        className="mx-auto max-w-md mt-8 rounded-lg shadow-2xl"
                      />
                    )}
                  </div>
                  <div className="order-3">
                    <img 
                      src={content.rightImage} 
                      alt="Lateral Direita" 
                      className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl"
                    />
                  </div>
                </div>
              ) : hasLeftImage || hasRightImage ? (
                /* Layout com 1 imagem lateral */
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${hasRightImage ? 'md:flex-row-reverse' : ''}`}>
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      {content.title || 'Coleção de Vestidos'}
                    </h2>
                    <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto md:mx-0">
                      {content.subtitle || 'Elegância e estilo para você'}
                    </p>
                    {content.image && (
                      <img 
                        src={content.image} 
                        alt="Principal" 
                        className="mx-auto md:mx-0 max-w-md mt-8 rounded-lg shadow-2xl"
                      />
                    )}
                  </div>
                  <div>
                    <img 
                      src={hasLeftImage ? content.leftImage : content.rightImage} 
                      alt="Lateral" 
                      className="w-full h-96 object-cover rounded-lg shadow-xl"
                    />
                  </div>
                </div>
              ) : (
                /* Layout padrão sem imagens laterais */
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    {content.title || 'Coleção de Vestidos'}
                  </h2>
                  <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
                    {content.subtitle || 'Elegância e estilo para você'}
                  </p>
                  {content.image && (
                    <img 
                      src={content.image} 
                      alt="Principal" 
                      className="mx-auto max-w-2xl mt-8 rounded-lg shadow-lg"
                    />
                  )}
                </div>
              )}
            </div>
          </section>
        );
        
      case 'products':
        return (
          <section key={section.id} className="max-w-6xl mx-auto px-4 py-12">
            <h3 className="text-2xl font-bold text-center mb-8">{content.title || 'Nossos Vestidos'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map(produto => (
                <div key={produto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  <div className="aspect-square bg-gray-100">
                    <img src={produto.imagem_url || PLACEHOLDER} alt={produto.titulo} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg">{produto.titulo}</h4>
                    {produto.preco && (
                      <p className="font-bold text-xl mt-2" style={{ color: config?.cor_botao || '#000' }}>
                        {produto.preco}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {produtos.length === 0 && (
              <p className="text-center text-gray-500 py-8">👗 Nenhum produto disponível</p>
            )}
          </section>
        );
        
      case 'content':
        return (
          <section key={section.id} className="py-8 px-4 bg-gradient-to-r from-green-50 to-blue-100">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-2">{content.title || 'Sessão'}</h3>
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
      {sections.length > 0 ? (
        sections.map(renderSection)
      ) : (
        // Fallback se não tiver seções
        <>
          <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Minha Loja de Vestidos</h1>
              <a href="/admin" className="px-4 py-2 bg-black rounded-lg">Painel</a>
            </div>
          </header>
          <section className="py-16 px-4 text-center bg-gradient-to-b from-purple-50 to-white">
            <h2 className="text-4xl font-bold mb-4">Coleção de Vestidos</h2>
            <p className="text-lg opacity-80">Elegância e estilo para você</p>
          </section>
        </>
      )}
      <footer
        className="p-6 text-center mt-12"
        style={{ backgroundColor: config?.cor_botao || '#000', color: '#fff' }}
      >
        <p>{config?.footer_texto || '© 2024 Minha Loja de Vestidos'}</p>
      </footer>
    </div>
  );
}