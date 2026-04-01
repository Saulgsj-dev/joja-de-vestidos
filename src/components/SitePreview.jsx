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

  // 🎨 Funções auxiliares para preview
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

  const getSectionPadding = (styles, defaultPadding = 'py-8') => {
    if (styles?.padding?.top && styles?.padding?.bottom) {
      return `${styles.padding.top} ${styles.padding.bottom}`;
    }
    if (styles?.padding?.vertical) {
      return styles.padding.vertical;
    }
    return defaultPadding;
  };

  const getContainerClasses = (config) => {
    const widthClasses = {
      full: 'max-w-none',
      narrow: 'max-w-7xl',
      compact: 'max-w-4xl'
    };
    const paddingClasses = {
      none: 'px-0',
      small: 'px-4',
      normal: 'px-4 sm:px-6',
      large: 'px-6 sm:px-8'
    };
    return {
      width: widthClasses[config?.site_container_width || 'full'] || 'max-w-none',
      padding: paddingClasses[config?.site_side_padding || 'normal'] || 'px-4 sm:px-6'
    };
  };

  const getAlignClass = (align) => {
    const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };
    return alignClasses[align] || 'text-center';
  };

  const renderButton = (button, config) => {
    if (!button?.text || !button?.link) return null;
    const isWhatsApp = button.type === 'whatsapp' || button.link.includes('wa.me');
    const href = isWhatsApp && !button.link.startsWith('http') 
      ? `https://wa.me/${button.link.replace(/\D/g, '')}` 
      : button.link;
    return (
      <a
        href={href}
        target={isWhatsApp ? '_blank' : '_self'}
        rel={isWhatsApp ? 'noopener noreferrer' : ''}
        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-lg hover:shadow-xl"
      >
        {isWhatsApp && '📱'}
        {button.text}
      </a>
    );
  };

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
        <div className="flex bg-gray-200 rounded-lg p-1 gap-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'desktop' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
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
              viewMode === 'mobile' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Área de Preview */}
      <div className="flex-1 overflow-hidden bg-gray-200 relative">
        {viewMode === 'desktop' ? (
          <div className="h-full overflow-y-auto">
            <div className="min-h-full bg-white">
              {headerSection && <Header config={config} sections={[headerSection]} isPreview={true} />}
              {heroSection && <HeroPreview section={heroSection} config={config} getBackgroundStyle={getBackgroundStyle} getSectionPadding={getSectionPadding} getContainerClasses={getContainerClasses} getAlignClass={getAlignClass} renderButton={renderButton} />}
              {productsSection && <ProductsPreview section={productsSection} config={config} getBackgroundStyle={getBackgroundStyle} getSectionPadding={getSectionPadding} getContainerClasses={getContainerClasses} getAlignClass={getAlignClass} renderButton={renderButton} />}
              {contentSections.map((section) => <ContentPreview key={section.id} section={section} config={config} getBackgroundStyle={getBackgroundStyle} getSectionPadding={getSectionPadding} getContainerClasses={getContainerClasses} getAlignClass={getAlignClass} renderButton={renderButton} />)}
              {contactSection && <ContactPreview section={contactSection} config={config} getBackgroundStyle={getBackgroundStyle} getSectionPadding={getSectionPadding} getContainerClasses={getContainerClasses} getAlignClass={getAlignClass} renderButton={renderButton} />}
              <FooterPreview config={config} />
              <div className="h-8"></div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 sm:p-8">
            <div className="flex justify-center min-h-full">
              <div className="w-[375px] min-h-[667px] bg-white rounded-[3rem] border-8 border-gray-800 overflow-hidden shadow-2xl">
                <div className="bg-gray-800 h-6 flex items-center justify-center">
                  <div className="w-20 h-4 bg-black rounded-full"></div>
                </div>
                <div className="h-[calc(100%-1.5rem)] overflow-y-auto">
                  {headerSection && <Header config={config} sections={[headerSection]} isPreview={true} />}
                  {heroSection && <HeroPreview section={heroSection} config={config} getBackgroundStyle={getBackgroundStyle} getSectionPadding={getSectionPadding} getContainerClasses={getContainerClasses} getAlignClass={getAlignClass} renderButton={renderButton} />}
                  {productsSection && <ProductsPreview section={productsSection} config={config} getBackgroundStyle={getBackgroundStyle} getSectionPadding={getSectionPadding} getContainerClasses={getContainerClasses} getAlignClass={getAlignClass} renderButton={renderButton} />}
                  {contentSections.map((section) => <ContentPreview key={section.id} section={section} config={config} getBackgroundStyle={getBackgroundStyle} getSectionPadding={getSectionPadding} getContainerClasses={getContainerClasses} getAlignClass={getAlignClass} renderButton={renderButton} />)}
                  {contactSection && <ContactPreview section={contactSection} config={config} getBackgroundStyle={getBackgroundStyle} getSectionPadding={getSectionPadding} getContainerClasses={getContainerClasses} getAlignClass={getAlignClass} renderButton={renderButton} />}
                  <FooterPreview config={config} />
                  <div className="h-8"></div>
                </div>
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

// ✅ HERO PREVIEW ATUALIZADO
function HeroPreview({ section, config, getBackgroundStyle, getSectionPadding, getContainerClasses, getAlignClass, renderButton }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const paddingClass = getSectionPadding(styles);
  const containerClasses = getContainerClasses(config);
  const imagePosition = styles?.imagePosition || 'above';
  const imageLayout = styles?.imageLayout || 'center';
  const hasLeftImage = content.leftImage;
  const hasRightImage = content.rightImage;
  const hasGridImages = content.gridImages?.length > 0;

  return (
    <section className={`${paddingClass} px-4 sm:px-6 relative overflow-hidden`} style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
      <div className={`mx-auto relative z-10 ${containerClasses.width} ${containerClasses.padding}`}>
        {imageLayout === 'center' && (
          <div className={getAlignClass(styles?.titleAlign || 'center')}>
            {imagePosition === 'above' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
            <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">{content.title || 'Bem-vindo'}</h2>
            {imagePosition === 'between' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
            <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 text-white drop-shadow-md">{content.subtitle || 'Sua mensagem aqui'}</p>
            {imagePosition === 'below' && content.image && (
              <div className="mt-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
            {renderButton(content.button, config)}
          </div>
        )}
        {/* ... outros layouts (sides, grid) seguem mesma lógica com botão ... */}
        {imageLayout === 'sides' && hasLeftImage && hasRightImage && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
            <div className="hidden lg:block">
              <img src={content.leftImage} alt="Lateral Esquerda" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl" />
            </div>
            <div className={getAlignClass(styles?.titleAlign || 'center')}>
              {imagePosition === 'above' && content.image && (
                <div className="mb-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                </div>
              )}
              <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">{content.title || 'Bem-vindo'}</h2>
              {imagePosition === 'between' && content.image && (
                <div className="mb-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                </div>
              )}
              <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-lg mx-auto mb-6 text-white drop-shadow-md">{content.subtitle || 'Sua mensagem aqui'}</p>
              {imagePosition === 'below' && content.image && (
                <div className="mt-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                </div>
              )}
              {renderButton(content.button, config)}
            </div>
            <div className="hidden lg:block">
              <img src={content.rightImage} alt="Lateral Direita" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl" />
            </div>
          </div>
        )}
        {/* Layout Grid simplificado para preview */}
        {imageLayout === 'grid' && hasGridImages && (
          <div className={getAlignClass(styles?.titleAlign || 'center')}>
            <h2 className="sm:text-3xl lg:text-4xl font-bold mb-4 text-white drop-shadow-lg">{content.title || 'Bem-vindo'}</h2>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl mx-auto mb-6 text-white drop-shadow-md">{content.subtitle || 'Sua mensagem aqui'}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {content.gridImages.map((img, index) => img && <img key={index} src={img} alt={`Grid ${index}`} className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg" />)}
            </div>
            {renderButton(content.button, config)}
          </div>
        )}
      </div>
    </section>
  );
}

// ✅ PRODUCTS PREVIEW ATUALIZADO
function ProductsPreview({ section, config, getBackgroundStyle, getSectionPadding, getContainerClasses, getAlignClass, renderButton }) {
  const { styles, content } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const paddingClass = getSectionPadding(styles, 'py-12');
  const containerClasses = getContainerClasses(config);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const priceColor = styles?.priceColor || config?.cor_botao || '#000000';

  return (
    <section className={`mx-auto px-4 sm:px-6 ${paddingClass}`} style={backgroundStyle}>
      <div className={`${containerClasses.width} ${containerClasses.padding}`}>
        <h3 className={`sm:text-2xl font-bold mb-8 ${getAlignClass(styles?.titleAlign || 'center')}`} style={{ color: titleColor }}>
          {content.title || 'Nossos Produtos'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="aspect-square bg-gray-100">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Produto {i}</div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-base sm:text-lg" style={{ color: titleColor }}>Vestido Exemplo {i}</h4>
                <p className="font-bold text-lg sm:text-xl mt-2" style={{ color: priceColor }}>R$ 199,90</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">{renderButton(content.button, config)}</div>
      </div>
    </section>
  );
}

// ✅ CONTENT PREVIEW ATUALIZADO
function ContentPreview({ section, config, getBackgroundStyle, getSectionPadding, getContainerClasses, getAlignClass, renderButton }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const paddingClass = getSectionPadding(styles);
  const containerClasses = getContainerClasses(config);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';

  return (
    <section className={`${paddingClass} px-4`} style={backgroundStyle}>
      <div className={`mx-auto ${containerClasses.width} ${containerClasses.padding}`}>
        <div className="max-w-4xl mx-auto">
          {styles?.imagePosition === 'above' && content.image && styles?.imageLayout !== 'side' && (
            <img src={content.image} alt={content.title || 'Imagem'} className="w-full h-64 object-cover rounded-lg mb-4 shadow-md" />
          )}
          <h3 className={`sm:text-xl font-semibold mb-4 ${getAlignClass(styles?.titleAlign || 'left')}`} style={{ color: titleColor }}>{content.title || 'Seção'}</h3>
          {styles?.imagePosition === 'between' && content.image && styles?.imageLayout !== 'side' && (
            <img src={content.image} alt={content.title || 'Imagem'} className="w-full h-64 object-cover rounded-lg my-4 shadow-md" />
          )}
          {content.text && <p className={`text-sm sm:text-base ${getAlignClass(styles?.textAlign || 'left')}`} style={{ color: textColor }}>{content.text}</p>}
          {styles?.imagePosition === 'below' && content.image && styles?.imageLayout !== 'side' && (
            <img src={content.image} alt={content.title || 'Imagem'} className="w-full h-64 object-cover rounded-lg mt-4 shadow-md" />
          )}
          <div className="mt-6">{renderButton(content.button, config)}</div>
        </div>
      </div>
    </section>
  );
}

// ✅ CONTACT PREVIEW ATUALIZADO
function ContactPreview({ section, config, getBackgroundStyle, getSectionPadding, getContainerClasses, getAlignClass, renderButton }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const paddingClass = getSectionPadding(styles);
  const containerClasses = getContainerClasses(config);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';

  return (
    <section className={`${paddingClass} px-4`} style={backgroundStyle}>
      <div className={`mx-auto ${containerClasses.width} ${containerClasses.padding}`}>
        <div className="max-w-4xl mx-auto">
          <h3 className={`sm:text-xl font-semibold mb-4 ${getAlignClass(styles?.titleAlign || 'center')}`} style={{ color: titleColor }}>{content.title || 'Contato'}</h3>
          {content.text && <p className={`text-sm sm:text-base ${getAlignClass(styles?.textAlign || 'center')} mb-4`} style={{ color: textColor }}>{content.text}</p>}
          <div className={getAlignClass(styles?.textAlign || 'center')}>
            {renderButton(content.button, config)}
            {!content.button?.text && config?.whatsapp_numero && (
              <a href={`https://wa.me/${config.whatsapp_numero}`} className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">📱 Falar no WhatsApp</a>
            )}
          </div>
        </div>
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