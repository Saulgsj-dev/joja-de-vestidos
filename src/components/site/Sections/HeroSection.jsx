// frontend/src/components/site/Sections/HeroSection.jsx
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function HeroSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const imagePosition = styles?.imagePosition || 'above';
  const imageLayout = styles?.imageLayout || 'center';

  // 🔹 Funções para aplicar estilos dinâmicos
  const getTitleClasses = () => {
    const sizes = { small: 'text-lg', medium: 'text-xl', large: 'text-3xl', xlarge: 'text-4xl' };
    const weights = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold', extrabold: 'font-extrabold' };
    return `${sizes[styles?.titleFontSize || 'large']} ${weights[styles?.titleFontWeight || 'bold']} ${getAlignClass(styles?.titleAlign || 'center')}`;
  };

  const getSubtitleClasses = () => {
    const sizes = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };
    return `${sizes[styles?.subtitleFontSize || 'medium']} ${getAlignClass(styles?.subtitleAlign || 'center')}`;
  };

  const titleColor = styles?.titleColor || '#ffffff';
  const subtitleColor = styles?.subtitleColor || '#e5e7eb';

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {imageLayout === 'center' && (
          <div className={getAlignClass(styles?.titleAlign || 'center')}>
            {/* Imagem ACIMA */}
            {imagePosition === 'above' && content.image && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={content.image} 
                  alt="Principal" 
                  className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" 
                  style={{ maxHeight: '300px' }} 
                />
              </div>
            )}
            
            {/* Título com estilos dinâmicos */}
            <h2 
              className={`${getTitleClasses()} mb-4 drop-shadow-lg`}
              style={{ color: titleColor }}
            >
              {content.title || 'Bem-vindo'}
            </h2>
            
            {/* Imagem ENTRE */}
            {imagePosition === 'between' && content.image && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={content.image} 
                  alt="Principal" 
                  className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" 
                  style={{ maxHeight: '300px' }} 
                />
              </div>
            )}
            
            {/* Subtítulo com estilos dinâmicos */}
            <p 
              className={`${getSubtitleClasses()} opacity-90 max-w-2xl mx-auto mb-6 drop-shadow-md`}
              style={{ color: subtitleColor }}
            >
              {content.subtitle || 'Sua mensagem aqui'}
            </p>
            
            {/* Imagem ABAIXO */}
            {imagePosition === 'below' && content.image && (
              <div className="mt-4 flex justify-center">
                <img 
                  src={content.image} 
                  alt="Principal" 
                  className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" 
                  style={{ maxHeight: '300px' }} 
                />
              </div>
            )}
          </div>
        )}

        {/* Layout Laterais */}
        {imageLayout === 'sides' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
            {content.leftImage && <div className="hidden lg:block"><img src={content.leftImage} alt="Esquerda" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl" /></div>}
            
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
              <p className={`${getSubtitleClasses()} opacity-90 max-w-lg mx-auto mb-6 drop-shadow-md`} style={{ color: subtitleColor }}>
                {content.subtitle || 'Sua mensagem aqui'}
              </p>
              {imagePosition === 'below' && content.image && (
                <div className="mt-4 flex justify-center">
                  <img src={content.image} alt="Principal" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl" style={{ maxHeight: '300px' }} />
                </div>
              )}
            </div>
            
            {content.rightImage && <div className="hidden lg:block"><img src={content.rightImage} alt="Direita" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl" /></div>}
          </div>
        )}

        {/* Layout Grid */}
        {imageLayout === 'grid' && (
          <div className={getAlignClass(styles?.titleAlign || 'center')}>
            <h2 className={`${getTitleClasses()} mb-4 drop-shadow-lg`} style={{ color: titleColor }}>
              {content.title || 'Bem-vindo'}
            </h2>
            <p className={`${getSubtitleClasses()} opacity-90 max-w-2xl mx-auto mb-6 drop-shadow-md`} style={{ color: subtitleColor }}>
              {content.subtitle || 'Sua mensagem aqui'}
            </p>
            {content.gridImages?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {content.gridImages.map((img, index) => img && (
                  <img key={index} src={img} alt={`Grid ${index}`} className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}