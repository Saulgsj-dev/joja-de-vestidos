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

  const containerWidth = viewMode === 'mobile' ? 'max-w-md' : 'w-full';

  return (
    <div className="h-full flex flex-col bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-sm font-semibold text-gray-700 ml-2">Preview ao vivo</span>
        </div>
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'desktop'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'mobile'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-200 p-4">
        <div className={`${containerWidth} mx-auto bg-white shadow-2xl transition-all duration-300`}>
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
    </div>
  );
}

// ✅ HERO PREVIEW COM CORES, ALINHAMENTOS E POSIÇÃO DE IMAGEM
function HeroPreview({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = {};

  // Configurar fundo
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

  // Configurar fontes
  const titleFontSizes = { small: 'text-lg', medium: 'text-xl', large: 'text-2xl', xlarge: 'text-3xl' };
  const titleFontWeights = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold', extrabold: 'font-extrabold' };
  const subtitleFontSizes = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };

  const titleSize = titleFontSizes[styles?.titleFontSize || 'large'];
  const titleWeight = titleFontWeights[styles?.titleFontWeight || 'bold'];
  const titleColor = styles?.titleColor || '#ffffff';
  const titleAlign = styles?.titleAlign || 'center';

  const subtitleSize = subtitleFontSizes[styles?.subtitleFontSize || 'medium'];
  const subtitleColor = styles?.subtitleColor || '#e5e7eb';
  const subtitleAlign = styles?.subtitleAlign || 'center';

  // Posição da imagem
  const imagePosition = styles?.imagePosition || 'above';
  const imageLayout = styles?.imageLayout || 'center';
  const hasLeftImage = content.leftImage;
  const hasRightImage = content.rightImage;
  const hasGridImages = content.gridImages?.length > 0;

  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
      <div className="relative z-10">
        {/* Layout Centralizado */}
        {imageLayout === 'center' && (
          <div className={alignClasses[titleAlign]}>
            {/* Imagem ACIMA do título */}
            {imagePosition === 'above' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
              </div>
            )}

            <h2 className={`${titleSize} ${titleWeight} mb-2 drop-shadow-lg`} style={{ color: titleColor }}>
              {content.title || 'Coleção de Vestidos'}
            </h2>

            {/* Imagem ENTRE título e descrição */}
            {imagePosition === 'between' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
              </div>
            )}

            <p className={`${subtitleSize} opacity-90 drop-shadow-md px-2`} style={{ color: subtitleColor }}>
              {content.subtitle || 'Elegância e estilo para você'}
            </p>

            {/* Imagem ABAIXO da descrição */}
            {imagePosition === 'below' && content.image && (
              <div className="mt-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
              </div>
            )}
          </div>
        )}

        {/* Layout Laterais */}
        {imageLayout === 'sides' && hasLeftImage && hasRightImage && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="hidden lg:block">
              <img src={content.leftImage} alt="Esquerda" className="w-full h-auto max-h-64 object-contain rounded-lg shadow-xl" />
            </div>
            <div className={alignClasses[titleAlign]}>
              {imagePosition === 'above' && content.image && (
                <div className="mb-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
                </div>
              )}
              <h2 className={`${titleSize} ${titleWeight} mb-2 drop-shadow-lg`} style={{ color: titleColor }}>
                {content.title || 'Coleção de Vestidos'}
              </h2>
              {imagePosition === 'between' && content.image && (
                <div className="mb-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
                </div>
              )}
              <p className={`${subtitleSize} opacity-90 drop-shadow-md px-2`} style={{ color: subtitleColor }}>
                {content.subtitle || 'Elegância e estilo para você'}
              </p>
              {imagePosition === 'below' && content.image && (
                <div className="mt-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <img src={content.rightImage} alt="Direita" className="w-full h-auto max-h-64 object-contain rounded-lg shadow-xl" />
            </div>
          </div>
        )}

        {imageLayout === 'sides' && (hasLeftImage || hasRightImage) && !(hasLeftImage && hasRightImage) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className={alignClasses[titleAlign]}>
              {imagePosition === 'above' && content.image && (
                <div className="mb-4 flex justify-center md:justify-start">
                  <img src={content.image} alt="Principal" className="w-full max-w-xs h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '150px' }} />
                </div>
              )}
              <h2 className={`${titleSize} ${titleWeight} mb-2 drop-shadow-lg`} style={{ color: titleColor }}>
                {content.title || 'Coleção de Vestidos'}
              </h2>
              {imagePosition === 'between' && content.image && (
                <div className="mb-4 flex justify-center md:justify-start">
                  <img src={content.image} alt="Principal" className="w-full max-w-xs h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '150px' }} />
                </div>
              )}
              <p className={`${subtitleSize} opacity-90 drop-shadow-md`} style={{ color: subtitleColor }}>
                {content.subtitle || 'Elegância e estilo para você'}
              </p>
              {imagePosition === 'below' && content.image && (
                <div className="mt-4 flex justify-center md:justify-start">
                  <img src={content.image} alt="Principal" className="w-full max-w-xs h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '150px' }} />
                </div>
              )}
            </div>
            <div>
              <img src={hasLeftImage ? content.leftImage : content.rightImage} alt="Lateral" className="w-full h-40 object-cover rounded-lg shadow-xl" />
            </div>
          </div>
        )}

        {imageLayout === 'sides' && !hasLeftImage && !hasRightImage && (
          <div className={alignClasses[titleAlign]}>
            {imagePosition === 'above' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '250px' }} />
              </div>
            )}
            <h2 className={`${titleSize} ${titleWeight} mb-2 drop-shadow-lg px-2`} style={{ color: titleColor }}>
              {content.title || 'Coleção de Vestidos'}
            </h2>
            {imagePosition === 'between' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '250px' }} />
              </div>
            )}
            <p className={`${subtitleSize} opacity-90 drop-shadow-md px-4`} style={{ color: subtitleColor }}>
              {content.subtitle || 'Elegância e estilo para você'}
            </p>
            {imagePosition === 'below' && content.image && (
              <div className="mt-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '250px' }} />
              </div>
            )}
          </div>
        )}

        {/* Layout Grid */}
        {imageLayout === 'grid' && hasGridImages && (
          <div className={alignClasses[titleAlign]}>
            <h2 className={`${titleSize} ${titleWeight} mb-2 drop-shadow-lg`} style={{ color: titleColor }}>
              {content.title || 'Coleção de Vestidos'}
            </h2>
            <p className={`${subtitleSize} opacity-90 drop-shadow-md px-2 mb-4`} style={{ color: subtitleColor }}>
              {content.subtitle || 'Elegância e estilo para você'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
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
          <div className={alignClasses[titleAlign]}>
            <h2 className={`${titleSize} ${titleWeight} mb-2 drop-shadow-lg px-2`} style={{ color: titleColor }}>
              {content.title || 'Coleção de Vestidos'}
            </h2>
            <p className={`${subtitleSize} opacity-90 drop-shadow-md px-4`} style={{ color: subtitleColor }}>
              {content.subtitle || 'Elegância e estilo para você'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ✅ PRODUCTS PREVIEW COM CORES E ALINHAMENTOS
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

  const titleFontSizes = { small: 'text-base', medium: 'text-lg', large: 'text-xl' };
  const titleFontWeights = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold' };
  const titleSize = titleFontSizes[styles?.titleFontSize || 'medium'];
  const titleWeight = titleFontWeights[styles?.titleFontWeight || 'bold'];
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const titleAlign = styles?.titleAlign || 'center';
  const priceColor = styles?.priceColor || config?.cor_botao || '#000000';

  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8" style={backgroundStyle}>
      <h3 className={`${titleSize} ${titleWeight} mb-6 ${alignClasses[titleAlign]}`} style={{ color: titleColor }}>
        {content.title || 'Nossos Vestidos'}
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="aspect-square bg-gray-100">
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                Produto {i}
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm" style={{ color: titleColor }}>Vestido Exemplo {i}</h4>
              <p className="font-bold text-sm mt-1" style={{ color: priceColor }}>R$ 199,90</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ✅ CONTENT PREVIEW COM CORES, ALINHAMENTOS E POSIÇÃO DE IMAGEM
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

  const titleFontSizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
  const titleFontWeights = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold' };
  const textFontSizes = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };

  const titleSize = titleFontSizes[styles?.titleFontSize || 'medium'];
  const titleWeight = titleFontWeights[styles?.titleFontWeight || 'normal'];
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const titleAlign = styles?.titleAlign || 'left';

  const textSize = textFontSizes[styles?.textFontSize || 'medium'];
  const textColor = styles?.textColor || '#374151';
  const textAlign = styles?.textAlign || 'left';

  const imagePosition = styles?.imagePosition || 'above';
  const imageLayout = styles?.imageLayout || 'none';
  const hasGridImages = content.gridImages?.length > 0;

  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <section className="py-6 px-4" style={backgroundStyle}>
      <div className="max-w-3xl mx-auto">
        {/* Imagem ACIMA do título */}
        {imagePosition === 'above' && content.image && imageLayout !== 'side' && (
          <img 
            src={content.image} 
            alt={content.title || 'Imagem'} 
            className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
          />
        )}

        <h3 className={`${titleSize} ${titleWeight} mb-2 ${alignClasses[titleAlign]}`} style={{ color: titleColor }}>
          {content.title || `Sessão ${index + 1}`}
        </h3>

        {/* Imagem ENTRE título e texto */}
        {imagePosition === 'between' && content.image && imageLayout !== 'side' && (
          <img 
            src={content.image} 
            alt={content.title || 'Imagem'} 
            className="w-full h-48 object-cover rounded-lg my-4 shadow-md"
          />
        )}

        {/* Layout Lateral */}
        {imageLayout === 'side' && content.image && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
            <div className={alignClasses[textAlign]}>
              <p className={`${textSize}`} style={{ color: textColor }}>{content.text}</p>
            </div>
            <div>
              <img 
                src={content.image} 
                alt={content.title || 'Imagem'} 
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        )}

        {/* Layout Grid */}
        {imageLayout === 'grid' && hasGridImages && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 mb-4">
            {content.gridImages.map((img, i) => (
              img && (
                <img
                  key={i}
                  src={img}
                  alt={`Grid ${i}`}
                  className="w-full h-24 object-cover rounded shadow"
                />
              )
            ))}
          </div>
        )}

        {/* Texto (exceto quando layout side) */}
        {imageLayout !== 'side' && content.text && (
          <p className={`${textSize} ${alignClasses[textAlign]}`} style={{ color: textColor }}>
            {content.text}
          </p>
        )}

        {/* Imagem ABAIXO do texto */}
        {imagePosition === 'below' && content.image && imageLayout !== 'side' && (
          <img 
            src={content.image} 
            alt={content.title || 'Imagem'} 
            className="w-full h-48 object-cover rounded-lg mt-4 shadow-md"
          />
        )}
      </div>
    </section>
  );
}

// ✅ CONTACT PREVIEW COM CORES E ALINHAMENTOS
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

  const titleFontSizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg' };
  const titleFontWeights = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold' };
  const textFontSizes = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };

  const titleSize = titleFontSizes[styles?.titleFontSize || 'medium'];
  const titleWeight = titleFontWeights[styles?.titleFontWeight || 'semibold'];
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const titleAlign = styles?.titleAlign || 'center';

  const textSize = textFontSizes[styles?.textFontSize || 'medium'];
  const textColor = styles?.textColor || '#374151';
  const textAlign = styles?.textAlign || 'center';

  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <section className="py-8 px-4" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        <h3 className={`${titleSize} ${titleWeight} mb-4 ${alignClasses[titleAlign]}`} style={{ color: titleColor }}>
          {content.title || 'Contato'}
        </h3>
        {content.text && (
          <p className={`${textSize} ${alignClasses[textAlign]} mb-4`} style={{ color: textColor }}>
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