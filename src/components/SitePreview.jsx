import { useState } from 'react';
import Header from './Header';

export default function SitePreview({ config, sections, selectedSection }) {
  const [viewMode, setViewMode] = useState('desktop');

  const previewSections = selectedSection
    ? sections.map(s => s.id === selectedSection.id ? selectedSection : s)
    : sections;

  const headerSection = previewSections.find(s => s.section_type === 'header');
  const heroSection = previewSections.find(s => s.section_type === 'hero');
  const productsSection = previewSections.find(s => s.section_type === 'products');
  const contentSections = previewSections.filter(s => s.section_type === 'content');
  const contactSection = previewSections.find(s => s.section_type === 'contact');

  return (
    <div className="h-full flex flex-col bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
      {/* Header do Preview */}
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-sm font-semibold text-gray-700 ml-2">Preview ao vivo</span>
        </div>
        
        {/* Toggle Desktop/Mobile */}
        <div className="flex bg-gray-200 rounded-lg p-1 gap-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'desktop'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'mobile'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Área de Preview com Scroll */}
      <div className="flex-1 overflow-hidden bg-gray-200 relative">
        {viewMode === 'desktop' ? (
          /* DESKTOP PREVIEW - Largura total como o site real */
          <div className="h-full overflow-y-auto">
            <div className="min-h-full bg-white">
              {headerSection ? (
                <Header config={config} sections={[headerSection]} isPreview={true} />
              ) : (
                <div className="bg-gray-200 p-4 text-center text-sm text-gray-500">
                  Header não configurado
                </div>
              )}

              {heroSection && (
                <HeroPreview section={heroSection} config={config} />
              )}

              {productsSection && (
                <ProductsPreview section={productsSection} config={config} />
              )}

              {contentSections.map((section, index) => (
                <ContentPreview key={section.id} section={section} config={config} index={index} />
              ))}

              {contactSection && (
                <ContactPreview section={contactSection} config={config} />
              )}

              <FooterPreview config={config} />
              <div className="h-8"></div>
            </div>
          </div>
        ) : (
          /* MOBILE PREVIEW - Layout de celular */
          <div className="h-full overflow-y-auto p-4 sm:p-8">
            <div className="flex justify-center min-h-full">
              <div className="w-[375px] min-h-[667px] bg-white rounded-[3rem] border-8 border-gray-800 overflow-hidden shadow-2xl">
                {/* Barra de status do mobile */}
                <div className="bg-gray-800 h-6 flex items-center justify-center">
                  <div className="w-20 h-4 bg-black rounded-full"></div>
                </div>
                
                {/* Conteúdo do Site */}
                <div className="h-[calc(100%-1.5rem)] overflow-y-auto">
                  {headerSection ? (
                    <Header config={config} sections={[headerSection]} isPreview={true} />
                  ) : (
                    <div className="bg-gray-200 p-4 text-center text-sm text-gray-500">
                      Header não configurado
                    </div>
                  )}

                  {heroSection && (
                    <HeroPreview section={heroSection} config={config} />
                  )}

                  {productsSection && (
                    <ProductsPreview section={productsSection} config={config} />
                  )}

                  {contentSections.map((section, index) => (
                    <ContentPreview key={section.id} section={section} config={config} index={index} />
                  ))}

                  {contactSection && (
                    <ContactPreview section={contactSection} config={config} />
                  )}

                  <FooterPreview config={config} />
                  <div className="h-8"></div>
                </div>

                {/* Home indicator do mobile */}
                <div className="bg-gray-800 h-1 flex justify-center items-end pb-1">
                  <div className="w-32 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ HERO PREVIEW - Mesma estrutura do site real
function HeroPreview({ section, config }) {
  const { content, styles } = section;
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

  const imagePosition = styles?.imagePosition || 'above';
  const imageLayout = styles?.imageLayout || 'center';
  const hasLeftImage = content.leftImage;
  const hasRightImage = content.rightImage;
  const hasGridImages = content.gridImages?.length > 0;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Layout Centralizado */}
        {imageLayout === 'center' && (
          <div className="text-center">
            {imagePosition === 'above' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
            <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">
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
            <div className="text-center">
              {imagePosition === 'above' && content.image && (
                <div className="mb-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                </div>
              )}
              <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">
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
            <div className="text-center md:text-left">
              {imagePosition === 'above' && content.image && (
                <div className="mb-4 flex justify-center md:justify-start">
                  <img src={content.image} alt="Principal" className="w-full max-w-xs h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
                </div>
              )}
              <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">
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
          <div className="text-center">
            <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">
              {content.title || 'Bem-vindo'}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 text-white drop-shadow-md">
              {content.subtitle || 'Sua mensagem aqui'}
            </p>
          </div>
        )}

        {/* Layout Grid */}
        {imageLayout === 'grid' && hasGridImages && (
          <div className="text-center">
            <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">
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
          <div className="text-center">
            <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">
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
}

// ✅ PRODUCTS PREVIEW
function ProductsPreview({ section, config }) {
  const { styles, content } = section;
  const backgroundStyle = {};

  if (styles.backgroundType === 'image' && styles.backgroundImage) {
    const opacity = (styles.backgroundOpacity || 100) / 100;
    backgroundStyle.backgroundImage = `url(${styles.backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundColor = `rgba(255, 255, 255, ${0.9 * opacity})`;
  } else {
    backgroundStyle.backgroundColor = styles.backgroundColor || '#ffffff';
  }

  const titleAlign = styles?.titleAlign || 'center';
  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const priceColor = styles?.priceColor || config?.cor_botao || '#000000';

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12" style={backgroundStyle}>
      <h3 className={`sm:text-2xl font-bold mb-8 ${alignClasses[titleAlign]}`} style={{ color: titleColor }}>
        {content.title || 'Nossos Produtos'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
            <div className="aspect-square bg-gray-100">
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                Produto {i}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-base sm:text-lg" style={{ color: titleColor }}>Vestido Exemplo {i}</h4>
              <p className="font-bold text-lg sm:text-xl mt-2" style={{ color: priceColor }}>R$ 199,90</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ✅ CONTENT PREVIEW
function ContentPreview({ section, config, index }) {
  const { content, styles } = section;
  const backgroundStyle = {};

  if (styles.backgroundType === 'image' && styles.backgroundImage) {
    const opacity = (styles.backgroundOpacity || 100) / 100;
    backgroundStyle.backgroundImage = `url(${styles.backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundColor = `rgba(255, 255, 255, ${0.9 * opacity})`;
  } else {
    backgroundStyle.backgroundColor = styles.backgroundColor || '#faf5ff';
  }

  const imagePosition = styles?.imagePosition || 'above';
  const imageLayout = styles?.imageLayout || 'none';
  const hasGridImages = content.gridImages?.length > 0;
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';
  const titleAlign = styles?.titleAlign || 'left';
  const textAlign = styles?.textAlign || 'left';
  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <section className="py-8 sm:py-12 px-4" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        {imagePosition === 'above' && content.image && imageLayout !== 'side' && (
          <img 
            src={content.image} 
            alt={content.title || 'Imagem da seção'} 
            className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
          />
        )}

        <h3 className={`sm:text-xl font-semibold mb-4 ${alignClasses[titleAlign]}`} style={{ color: titleColor }}>
          {content.title || 'Seção'}
        </h3>

        {imagePosition === 'between' && content.image && imageLayout !== 'side' && (
          <img 
            src={content.image} 
            alt={content.title || 'Imagem da seção'} 
            className="w-full h-64 object-cover rounded-lg my-4 shadow-md"
          />
        )}

        {imageLayout === 'side' && content.image && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-4">
            <div className={alignClasses[textAlign]}>
              {content.text && <p className="text-sm sm:text-base" style={{ color: textColor }}>{content.text}</p>}
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

        {imageLayout === 'grid' && hasGridImages && (
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

        {imageLayout !== 'side' && content.text && (
          <p className={`text-sm sm:text-base ${alignClasses[textAlign]}`} style={{ color: textColor }}>
            {content.text}
          </p>
        )}

        {imagePosition === 'below' && content.image && imageLayout !== 'side' && (
          <img 
            src={content.image} 
            alt={content.title || 'Imagem da seção'} 
            className="w-full h-64 object-cover rounded-lg mt-4 shadow-md"
          />
        )}
      </div>
    </section>
  );
}

// ✅ CONTACT PREVIEW
function ContactPreview({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = {};

  if (styles.backgroundType === 'image' && styles.backgroundImage) {
    const opacity = (styles.backgroundOpacity || 100) / 100;
    backgroundStyle.backgroundImage = `url(${styles.backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundColor = `rgba(255, 255, 255, ${0.9 * opacity})`;
  } else {
    backgroundStyle.backgroundColor = styles.backgroundColor || '#f9fafb';
  }

  const titleAlign = styles?.titleAlign || 'center';
  const textAlign = styles?.textAlign || 'center';
  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';

  return (
    <section className="py-8 sm:py-12 px-4" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        <h3 className={`sm:text-xl font-semibold mb-4 ${alignClasses[titleAlign]}`} style={{ color: titleColor }}>
          {content.title || 'Contato'}
        </h3>
        {content.text && (
          <p className={`text-sm sm:text-base ${alignClasses[textAlign]} mb-4`} style={{ color: textColor }}>
            {content.text}
          </p>
        )}
        {config?.whatsapp_numero && (
          <div className={alignClasses[textAlign]}>
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
}

// ✅ FOOTER PREVIEW
function FooterPreview({ config }) {
  return (
    <footer className="p-4 sm:p-6 text-center" style={{ backgroundColor: config?.cor_botao || '#000', color: '#fff' }}>
      <p className="text-xs sm:text-sm">{config?.footer_texto || '© 2024 Minha Loja de Vestidos'}</p>
    </footer>
  );
}