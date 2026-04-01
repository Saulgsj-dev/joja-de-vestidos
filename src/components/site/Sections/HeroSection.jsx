// frontend/src/components/site/Sections/HeroSection.jsx
import React, { memo, useMemo, useState } from 'react';
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

const HeroSection = memo(function HeroSection({ section = {}, config = {} }) {
  const { content = {}, styles = {} } = section;
  const backgroundStyle = useMemo(() => getBackgroundStyle(styles), [styles]);
  
  const imagePosition = styles.imagePosition || 'above';
  const imageLayout = styles.imageLayout || 'center';
  
  const titleColor = styles.titleColor || '#ffffff';
  const subtitleColor = styles.subtitleColor || '#e5e7eb';
  
  const [imageErrors, setImageErrors] = useState({});

  // 🔹 Mapeamentos de estilos
  const titleSizeMap = { small: 'text-lg', medium: 'text-xl', large: 'text-3xl', xlarge: 'text-4xl' };
  const titleWeightMap = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold', extrabold: 'font-extrabold' };
  const subtitleSizeMap = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };

  const titleClasses = useMemo(() => 
    `${titleSizeMap[styles.titleFontSize || 'large']} ${titleWeightMap[styles.titleFontWeight || 'bold']} ${getAlignClass(styles.titleAlign || 'center')}`,
    [styles]
  );

  const subtitleClasses = useMemo(() => 
    `${subtitleSizeMap[styles.subtitleFontSize || 'medium']} ${getAlignClass(styles.subtitleAlign || 'center')}`,
    [styles]
  );

  const handleImageError = (key) => {
    console.warn(`Falha ao carregar imagem: ${key}`);
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  // 🔹 Componente de imagem reutilizável
  const HeroImage = ({ src, alt, position, layout, index = 0 }) => {
    if (!src || imageErrors[`${position}-${index}`]) return null;
    
    const baseClasses = "w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl transition-transform duration-300 hover:scale-[1.02]";
    const positionClass = position === 'below' ? 'mt-4' : 'mb-4';
    
    return (
      <div className={`${positionClass} flex justify-center`}>
        <img 
          src={src} 
          alt={alt || 'Imagem principal'} 
          className={baseClasses}
          style={{ maxHeight: '300px' }}
          loading={index === 0 ? 'eager' : 'lazy'}
          width="400"
          height="300"
          onError={() => handleImageError(`${position}-${index}`)}
        />
      </div>
    );
  };

  // 🔹 Conteúdo centralizado (títulos + subtítulo)
  const HeroContent = ({ hasLeftImage = false, hasRightImage = false }) => (
    <div className={getAlignClass(styles.titleAlign || 'center')}>
      {imagePosition === 'above' && content.image && (
        <HeroImage src={content.image} alt={content.imageAlt} position="above" layout={imageLayout} />
      )}
      
      <h2 className={`${titleClasses} mb-4 drop-shadow-lg`} style={{ color: titleColor }}>
        {content.title || 'Bem-vindo'}
      </h2>
      
      {imagePosition === 'between' && content.image && (
        <HeroImage src={content.image} alt={content.imageAlt} position="between" layout={imageLayout} />
      )}
      
      {content.subtitle && (
        <p className={`${subtitleClasses} opacity-90 max-w-2xl mx-auto mb-6 drop-shadow-md`} style={{ color: subtitleColor }}>
          {content.subtitle}
        </p>
      )}
      
      {imagePosition === 'below' && content.image && (
        <HeroImage src={content.image} alt={content.imageAlt} position="below" layout={imageLayout} />
      )}
    </div>
  );

  return (
    <section 
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden" 
      style={backgroundStyle}
      aria-labelledby="hero-section-title"
    >
      {/* Overlay para melhor contraste */}
      <div className="absolute inset-0 bg-black/30 sm:bg-black/20 lg:bg-black/10 pointer-events-none" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Layout: Centro */}
        {imageLayout === 'center' && <HeroContent />}

        {/* Layout: Laterais */}
        {imageLayout === 'sides' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
            {content.leftImage && !imageErrors['left'] && (
              <div className="hidden lg:block">
                <img 
                  src={content.leftImage} 
                  alt={content.leftImageAlt || 'Imagem lateral esquerda'} 
                  className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl transition-transform hover:scale-[1.02]"
                  loading="lazy"
                  onError={() => handleImageError('left')}
                />
              </div>
            )}
            
            <HeroContent hasLeftImage={!!content.leftImage} hasRightImage={!!content.rightImage} />
            
            {content.rightImage && !imageErrors['right'] && (
              <div className="hidden lg:block">
                <img 
                  src={content.rightImage} 
                  alt={content.rightImageAlt || 'Imagem lateral direita'} 
                  className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl transition-transform hover:scale-[1.02]"
                  loading="lazy"
                  onError={() => handleImageError('right')}
                />
              </div>
            )}
          </div>
        )}

        {/* Layout: Grid de Imagens */}
        {imageLayout === 'grid' && (
          <div className={getAlignClass(styles.titleAlign || 'center')}>
            <h2 id="hero-section-title" className={`${titleClasses} mb-4 drop-shadow-lg`} style={{ color: titleColor }}>
              {content.title || 'Bem-vindo'}
            </h2>
            
            {content.subtitle && (
              <p className={`${subtitleClasses} opacity-90 max-w-2xl mx-auto mb-6 drop-shadow-md`} style={{ color: subtitleColor }}>
                {content.subtitle}
              </p>
            )}
            
            {content.gridImages?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {content.gridImages.map((img, index) => {
                  const key = `grid-${index}`;
                  if (!img || imageErrors[key]) return null;
                  return (
                    <img 
                      key={key} 
                      src={img} 
                      alt={`Galeria ${index + 1}`} 
                      className="w-full h-32 sm:h-40 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      onError={() => handleImageError(key)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
});

export default HeroSection;