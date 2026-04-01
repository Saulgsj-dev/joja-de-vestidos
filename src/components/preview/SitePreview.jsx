import { useState } from 'react';
import Header from '../site/Header';
import Footer from '../site/Footer';
import PreviewFrame from './PreviewFrame';
// Importe as seções se necessário

export default function SitePreview({ config, sections, selectedSection }) {
  const [viewMode, setViewMode] = useState('desktop');

  const previewSections = selectedSection
    ? sections.map(s => s.id === selectedSection.id ? selectedSection : s)
    : sections;

  const headerSection = previewSections.find(s => s.section_type === 'header');
  const heroSection = previewSections.find(s => s.section_type === 'hero');
  // ... outras seções

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

      <div className="flex-1 overflow-hidden bg-gray-200 relative">
        <PreviewFrame viewMode={viewMode}>
          {headerSection && <Header config={config} sections={[headerSection]} isPreview={true} />}
          {heroSection && <HeroPreview section={heroSection} config={config} />}
          {/* ... outras seções */}
          <Footer config={config} />
          <div className="h-8"></div>
        </PreviewFrame>
      </div>
    </div>
  );
}

// ✅ HERO PREVIEW - MESMA LÓGICA DO HeroSection
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

  // 🔹 Funções para aplicar estilos dinâmicos (IGUAIS AO HeroSection)
  const getTitleClasses = () => {
    const sizes = { small: 'text-lg', medium: 'text-xl', large: 'text-3xl', xlarge: 'text-4xl' };
    const weights = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold', extrabold: 'font-extrabold' };
    return `${sizes[styles?.titleFontSize || 'large']} ${weights[styles?.titleFontWeight || 'bold']} ${getAlignClass(styles?.titleAlign || 'center')}`;
  };

  const getSubtitleClasses = () => {
    const sizes = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };
    return `${sizes[styles?.subtitleFontSize || 'medium']} ${getAlignClass(styles?.subtitleAlign || 'center')}`;
  };

  const getAlignClass = (align) => {
    const classes = { left: 'text-left', center: 'text-center', right: 'text-right' };
    return classes[align] || 'text-center';
  };

  const titleColor = styles?.titleColor || '#ffffff';
  const subtitleColor = styles?.subtitleColor || '#e5e7eb';

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {imageLayout === 'center' && (
          <div className={getAlignClass(styles?.titleAlign || 'center')}>
            {imagePosition === 'above' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
            <h2 className={`${getTitleClasses()} mb-4 drop-shadow-lg`} style={{ color: titleColor }}>
              {content.title || 'Bem-vindo'}
            </h2>
            {imagePosition === 'between' && content.image && (
              <div className="mb-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
            <p className={`${getSubtitleClasses()} opacity-90 max-w-2xl mx-auto mb-6 drop-shadow-md`} style={{ color: subtitleColor }}>
              {content.subtitle || 'Sua mensagem aqui'}
            </p>
            {imagePosition === 'below' && content.image && (
              <div className="mt-4 flex justify-center">
                <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
              </div>
            )}
          </div>
        )}
        {/* Layout laterais e grid seguem mesma lógica... */}
      </div>
    </section>
  );
}