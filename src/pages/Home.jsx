import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiClient';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const { storeId } = useParams();
  const [sections, setSections] = useState([]);
  const [config, setConfig] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [storeSlug, setStoreSlug] = useState(null);

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
          console.error('Erro ao buscar profile:', error);
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

  const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESem imagem%3C/text%3E%3C/svg%3E`;

  // ✅ FUNÇÃO PARA GERAR ESTILO DE FUNDO
  const getBackgroundStyle = (styles) => {
    const backgroundStyle = {};
    if (styles?.backgroundType === 'image' && styles?.backgroundImage) {
      const opacity = (styles.backgroundOpacity || 100) / 100;
      backgroundStyle.backgroundImage = `url(${styles.backgroundImage})`;
      backgroundStyle.backgroundSize = 'cover';
      backgroundStyle.backgroundPosition = 'center';
      backgroundStyle.backgroundRepeat = 'no-repeat';
      backgroundStyle.backgroundColor = `rgba(0, 0, 0, ${0.4 * opacity})`;
      backgroundStyle.backgroundBlendMode = 'multiply';
    } else {
      backgroundStyle.backgroundColor = styles?.backgroundColor || '#ffffff';
    }
    return backgroundStyle;
  };

  // ✅ FUNÇÃO PARA OBTER CLASSES DE FONTE
  const getTitleFontClasses = (styles, defaultSize = 'medium', defaultWeight = 'normal') => {
    const fontSizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg', xlarge: 'text-xl' };
    const fontWeights = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold', extrabold: 'font-extrabold' };
    return {
      size: fontSizes[styles?.titleFontSize || defaultSize],
      weight: fontWeights[styles?.titleFontWeight || defaultWeight],
      color: styles?.titleColor || config?.cor_texto || '#000000',
      align: styles?.titleAlign || 'center'
    };
  };

  const getSubtitleFontClasses = (styles, defaultSize = 'medium') => {
    const fontSizes = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };
    return {
      size: fontSizes[styles?.subtitleFontSize || defaultSize],
      color: styles?.subtitleColor || '#e5e7eb',
      align: styles?.subtitleAlign || 'center'
    };
  };

  const getTextFontClasses = (styles, defaultSize = 'medium') => {
    const fontSizes = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };
    return {
      size: fontSizes[styles?.textFontSize || defaultSize],
      color: styles?.textColor || '#374151',
      align: styles?.textAlign || 'left'
    };
  };

  const getAlignClass = (align) => {
    const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };
    return alignClasses[align] || 'text-center';
  };

  const renderSection = (section) => {
    const { content, styles, section_type } = section;

    switch (section_type) {
      case 'header':
        return null;

      case 'hero':
        const heroBgStyle = getBackgroundStyle(styles);
        const heroTitleFont = getTitleFontClasses(styles, 'large', 'bold');
        const heroSubtitleFont = getSubtitleFontClasses(styles, 'medium');
        const imagePosition = styles?.imagePosition || 'above';
        const imageLayout = styles?.imageLayout || 'center';
        const hasLeftImage = content.leftImage;
        const hasRightImage = content.rightImage;
        const hasGridImages = content.gridImages?.length > 0;

        return (
          <section
            key={section.id}
            className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden"
            style={heroBgStyle}
          >
            <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto relative z-10">
              {/* Layout Centralizado */}
              {imageLayout === 'center' && (
                <div className={getAlignClass(heroTitleFont.align)}>
                  {imagePosition === 'above' && content.image && (
                    <div className="mb-4 flex justify-center">
                      <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                    </div>
                  )}
                  <h2 className={`sm:text-3xl lg:text-4xl ${heroTitleFont.weight} mb-4 text-white drop-shadow-lg`}>
                    {content.title || 'Bem-vindo'}
                  </h2>
                  {imagePosition === 'between' && content.image && (
                    <div className="mb-4 flex justify-center">
                      <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                    </div>
                  )}
                  <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 text-white drop-shadow-md">
                    {content.subtitle || 'Sua mensagem aqui'}
                  </p>
                  {imagePosition === 'below' && content.image && (
                    <div className="mt-4 flex justify-center">
                      <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                    </div>
                  )}
                </div>
              )}

              {/* Layout Laterais */}
              {imageLayout === 'sides' && hasLeftImage && hasRightImage && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
                  <div className="hidden lg:block">
                    <img src={content.leftImage} alt="Lateral Esquerda" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl" />
                  </div>
                  <div className={getAlignClass(heroTitleFont.align)}>
                    {imagePosition === 'above' && content.image && (
                      <div className="mb-4 flex justify-center">
                        <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                      </div>
                    )}
                    <h2 className={`sm:text-3xl lg:text-4xl ${heroTitleFont.weight} mb-4 text-white drop-shadow-lg`}>
                      {content.title || 'Bem-vindo'}
                    </h2>
                    {imagePosition === 'between' && content.image && (
                      <div className="mb-4 flex justify-center">
                        <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                      </div>
                    )}
                    <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-lg mx-auto mb-6 text-white drop-shadow-md">
                      {content.subtitle || 'Sua mensagem aqui'}
                    </p>
                    {imagePosition === 'below' && content.image && (
                      <div className="mt-4 flex justify-center">
                        <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <img src={content.rightImage} alt="Lateral Direita" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl" />
                  </div>
                </div>
              )}

              {imageLayout === 'sides' && (hasLeftImage || hasRightImage) && !(hasLeftImage && hasRightImage) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className={getAlignClass(heroTitleFont.align)}>
                    {imagePosition === 'above' && content.image && (
                      <div className="mb-4 flex justify-center md:justify-start">
                        <img src={content.image} alt="Principal" className="w-full max-w-xs h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
                      </div>
                    )}
                    <h2 className={`sm:text-3xl lg:text-4xl ${heroTitleFont.weight} mb-4 text-white drop-shadow-lg`}>
                      {content.title || 'Bem-vindo'}
                    </h2>
                    {imagePosition === 'between' && content.image && (
                      <div className="mb-4 flex justify-center md:justify-start">
                        <img src={content.image} alt="Principal" className="w-full max-w-xs h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
                      </div>
                    )}
                    <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto md:mx-0 mb-6 text-white drop-shadow-md">
                      {content.subtitle || 'Sua mensagem aqui'}
                    </p>
                    {imagePosition === 'below' && content.image && (
                      <div className="mt-4 flex justify-center md:justify-start">
                        <img src={content.image} alt="Principal" className="w-full max-w-xs h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <img src={hasLeftImage ? content.leftImage : content.rightImage} alt="Lateral" className="w-full h-64 object-cover rounded-lg shadow-xl" />
                  </div>
                </div>
              )}

              {imageLayout === 'sides' && !hasLeftImage && !hasRightImage && (
                <div className={getAlignClass(heroTitleFont.align)}>
                  <h2 className={`sm:text-3xl lg:text-4xl ${heroTitleFont.weight} mb-4 text-white drop-shadow-lg`}>
                    {content.title || 'Bem-vindo'}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 text-white drop-shadow-md">
                    {content.subtitle || 'Sua mensagem aqui'}
                  </p>
                </div>
              )}

              {/* Layout Grid */}
              {imageLayout === 'grid' && hasGridImages && (
                <div className={getAlignClass(heroTitleFont.align)}>
                  <h2 className={`sm:text-3xl lg:text-4xl ${heroTitleFont.weight} mb-4 text-white drop-shadow-lg`}>
                    {content.title || 'Bem-vindo'}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 text-white drop-shadow-md">
                    {content.subtitle || 'Sua mensagem aqui'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {content.gridImages.map((img, index) => (
                      img && (
                        <img
                          key={index}
                          src={img}
                          alt={`Grid ${index}`}
                          className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg"
                        />
                      )
                    ))}
                  </div>
                </div>
              )}

              {imageLayout === 'grid' && !hasGridImages && (
                <div className={getAlignClass(heroTitleFont.align)}>
                  <h2 className={`sm:text-3xl lg:text-4xl ${heroTitleFont.weight} mb-4 text-white drop-shadow-lg`}>
                    {content.title || 'Bem-vindo'}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 text-white drop-shadow-md">
                    {content.subtitle || 'Sua mensagem aqui'}
                  </p>
                </div>
              )}
            </div>
          </section>
        );

      case 'products':
        const productsBgStyle = getBackgroundStyle(styles);
        const productsTitleFont = getTitleFontClasses(styles, 'medium', 'bold');
        const priceColor = styles?.priceColor || config?.cor_botao || '#000000';
        return (
          <section key={section.id} className="max-w-6xl mx-auto px-4 sm:px-6 py-12" style={productsBgStyle}>
            <h3 className={`sm:text-2xl ${productsTitleFont.weight} mb-8 ${getAlignClass(productsTitleFont.align)}`} style={{ color: productsTitleFont.color }}>
              {content.title || 'Nossos Produtos'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map(produto => (
                <div key={produto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  <div className="aspect-square bg-gray-100">
                    <img src={produto.imagem_url || PLACEHOLDER} alt={produto.titulo} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className={`font-bold ${productsTitleFont.size}`} style={{ color: productsTitleFont.color }}>{produto.titulo}</h4>
                    {produto.preco && (
                      <p className="font-bold text-lg sm:text-xl mt-2" style={{ color: priceColor }}>{produto.preco}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {produtos.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nenhum produto disponível</p>
            )}
          </section>
        );

      case 'content':
        const contentBgStyle = getBackgroundStyle(styles);
        const contentTitleFont = getTitleFontClasses(styles, 'medium', 'semibold');
        const contentTextFont = getTextFontClasses(styles, 'medium');
        const contentImagePosition = styles?.imagePosition || 'above';
        const contentImageLayout = styles?.imageLayout || 'none';
        const hasContentGridImages = content.gridImages?.length > 0;
        return (
          <section key={section.id} className="py-8 sm:py-12 px-4" style={contentBgStyle}>
            <div className="max-w-4xl mx-auto">
              {contentImagePosition === 'above' && content.image && contentImageLayout !== 'side' && (
                <img 
                  src={content.image} 
                  alt={content.title || 'Imagem da seção'} 
                  className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
                />
              )}

              <h3 className={`sm:text-xl ${contentTitleFont.weight} mb-4 ${getAlignClass(contentTitleFont.align)}`} style={{ color: contentTitleFont.color }}>
                {content.title || 'Seção'}
              </h3>

              {contentImagePosition === 'between' && content.image && contentImageLayout !== 'side' && (
                <img 
                  src={content.image} 
                  alt={content.title || 'Imagem da seção'} 
                  className="w-full h-64 object-cover rounded-lg my-4 shadow-md"
                />
              )}

              {contentImageLayout === 'side' && content.image && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-4">
                  <div className={getAlignClass(contentTextFont.align)}>
                    {content.text && <p className={`${contentTextFont.size}`} style={{ color: contentTextFont.color }}>{content.text}</p>}
                  </div>
                  <div>
                    <img 
                      src={content.image} 
                      alt={content.title || 'Imagem da seção'} 
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              )}

              {contentImageLayout === 'grid' && hasContentGridImages && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 mb-4">
                  {content.gridImages.map((img, i) => (
                    img && (
                      <img
                        key={i}
                        src={img}
                        alt={`Grid ${i}`}
                        className="w-full h-32 object-cover rounded shadow"
                      />
                    )
                  ))}
                </div>
              )}

              {contentImageLayout !== 'side' && content.text && (
                <p className={`${contentTextFont.size} ${getAlignClass(contentTextFont.align)}`} style={{ color: contentTextFont.color }}>
                  {content.text}
                </p>
              )}

              {contentImagePosition === 'below' && content.image && contentImageLayout !== 'side' && (
                <img 
                  src={content.image} 
                  alt={content.title || 'Imagem da seção'} 
                  className="w-full h-64 object-cover rounded-lg mt-4 shadow-md"
                />
              )}
            </div>
          </section>
        );

      case 'contact':
        const contactBgStyle = getBackgroundStyle(styles);
        const contactTitleFont = getTitleFontClasses(styles, 'medium', 'semibold');
        const contactTextFont = getTextFontClasses(styles, 'medium');
        return (
          <section key={section.id} className="py-8 sm:py-12 px-4" style={contactBgStyle}>
            <div className="max-w-4xl mx-auto">
              <h3 className={`sm:text-xl ${contactTitleFont.weight} mb-4 ${getAlignClass(contactTitleFont.align)}`} style={{ color: contactTitleFont.color }}>
                {content.title || 'Contato'}
              </h3>
              {content.text && (
                <p className={`${contactTextFont.size} ${getAlignClass(contactTextFont.align)} mb-4`} style={{ color: contactTextFont.color }}>
                  {content.text}
                </p>
              )}
              {config?.whatsapp_numero && (
                <div className={getAlignClass(contactTextFont.align)}>
                  <a
                    href={`https://wa.me/${config.whatsapp_numero}`}
                    className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    📱 Falar no WhatsApp
                  </a>
                </div>
              )}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: config?.cor_fundo || '#fff', color: config?.cor_texto }}>
      <Header config={config} sections={sections} storeSlug={storeSlug} />
      
      {sections.length > 0 ? (
        sections
          .filter(section => section.section_type !== 'header')
          .map(renderSection)
      ) : (
        <section className="py-16 px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: config?.cor_texto }}>
            Bem-vindo
          </h2>
          <p className="text-gray-600">Site em construção</p>
        </section>
      )}
      
      <Footer config={config} />
    </div>
  );
}