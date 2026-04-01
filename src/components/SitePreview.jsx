// frontend/src/components/SitePreview.jsx
import { useState } from 'react';
import Header from './Header';

export default function SitePreview({ config, sections, selectedSection }) {
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile'

  // Merge das sections com a seção sendo editada (se houver)
  const previewSections = selectedSection
    ? sections.map(s => s.id === selectedSection.id ? selectedSection : s)
    : sections;

  const headerSection = previewSections.find(s => s.section_type === 'header');
  const heroSection = previewSections.find(s => s.section_type === 'hero');
  const productsSection = previewSections.find(s => s.section_type === 'products');
  const contentSections = previewSections.filter(s => s.section_type === 'content');

  // Largura do container baseado no modo
  const containerWidth = viewMode === 'mobile' ? 'max-w-md' : 'w-full';

  return (
    <div className="h-full flex flex-col bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
      {/* Barra de Controle - Desktop/Mobile */}
      <div className="bg-white px-4 py-3 border-b flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-sm font-semibold text-gray-700 ml-2">Preview ao vivo</span>
        </div>

        {/* Toggle Desktop/Mobile */}
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

      {/* Área do Preview - Scrollável */}
      <div className="flex-1 overflow-y-auto bg-gray-200 p-4">
        <div className={`${containerWidth} mx-auto bg-white shadow-2xl transition-all duration-300`}>
          {/* Header */}
          {headerSection ? (
            <Header config={config} sections={[headerSection]} isPreview={true} />
          ) : (
            <div className="bg-gray-200 p-4 text-center text-sm text-gray-500">
              Header não configurado
            </div>
          )}

          {/* Hero Section */}
          {heroSection && (
            <HeroPreview section={heroSection} config={config} />
          )}

          {/* Products Section */}
          {productsSection && (
            <ProductsPreview section={productsSection} config={config} />
          )}

          {/* Content Sections */}
          {contentSections.map((section, index) => (
            <ContentPreview key={section.id} section={section} config={config} index={index} />
          ))}

          {/* Footer */}
          <FooterPreview config={config} />

          {/* Espaço extra no final */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
}

// Componente Hero Preview
function HeroPreview({ section, config }) {
  const { content, styles } = section;
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
    <section className="py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
      <div className="relative z-10">
        {hasLeftImage && hasRightImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="hidden lg:block">
              <img src={content.leftImage} alt="Esquerda" className="w-full h-auto max-h-64 object-contain rounded-lg shadow-xl" />
            </div>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-white drop-shadow-lg">
                {content.title || 'Coleção de Vestidos'}
              </h2>
              <p className="text-xs sm:text-sm opacity-90 text-white drop-shadow-md px-2">
                {content.subtitle || 'Elegância e estilo para você'}
              </p>
              {content.image && (
                <div className="mt-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '200px' }} />
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <img src={content.rightImage} alt="Direita" className="w-full h-auto max-h-64 object-contain rounded-lg shadow-xl" />
            </div>
          </div>
        ) : hasLeftImage || hasRightImage ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white drop-shadow-lg">
                {content.title || 'Coleção de Vestidos'}
              </h2>
              <p className="text-xs sm:text-sm opacity-90 text-white drop-shadow-md">
                {content.subtitle || 'Elegância e estilo para você'}
              </p>
              {content.image && (
                <div className="mt-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-xs h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '150px' }} />
                </div>
              )}
            </div>
            <div>
              <img src={hasLeftImage ? content.leftImage : content.rightImage} alt="Lateral" className="w-full h-40 object-cover rounded-lg shadow-xl" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-white drop-shadow-lg px-2">
              {content.title || 'Coleção de Vestidos'}
            </h2>
            <p className="text-xs sm:text-sm opacity-90 text-white drop-shadow-md px-4">
              {content.subtitle || 'Elegância e estilo para você'}
            </p>
            {content.image && (
              <div className="mt-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '250px' }} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Componente Products Preview
function ProductsPreview({ section, config }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h3 className="text-lg sm:text-xl font-bold text-center mb-6" style={{ color: config?.cor_texto }}>
        {section.content.title || 'Nossos Vestidos'}
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
              <h4 className="font-semibold text-sm" style={{ color: config?.cor_texto }}>Vestido Exemplo {i}</h4>
              <p className="font-bold text-sm mt-1" style={{ color: config?.cor_botao }}>R$ 199,90</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Componente Content Preview
function ContentPreview({ section, config, index }) {
  return (
    <section className="py-6 px-4 bg-gradient-to-r from-green-50 to-blue-100">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: config?.cor_texto }}>
          {section.content.title || `Sessão ${index + 1}`}
        </h3>
        {section.content.text && (
          <p className="text-gray-700 text-xs sm:text-sm">{section.content.text}</p>
        )}
      </div>
    </section>
  );
}

// Componente Footer Preview
function FooterPreview({ config }) {
  return (
    <footer className="p-4 sm:p-6 text-center" style={{ backgroundColor: config?.cor_botao || '#000', color: '#fff' }}>
      <p className="text-xs sm:text-sm">{config?.footer_texto || '© 2024 Minha Loja de Vestidos'}</p>
    </footer>
  );
}