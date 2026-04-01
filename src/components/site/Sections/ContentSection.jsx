// frontend/src/components/site/Sections/ContentSection.jsx
import React, { memo, useState, useMemo } from 'react';
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

const ContentSection = memo(function ContentSection({ section = {}, config = {} }) {
  const { content = {}, styles = {} } = section;
  const backgroundStyle = useMemo(() => getBackgroundStyle(styles), [styles]);
  
  const titleColor = styles.titleColor || config.cor_texto || '#1f2937';
  const textColor = styles.textColor || '#4b5563';
  const titleAlign = styles.titleAlign || 'left';
  const textAlign = styles.textAlign || 'left';
  const imagePosition = styles.imagePosition || 'above';
  
  const [imageError, setImageError] = useState(false);
  const sectionId = section?.id || `content-${Math.random().toString(36).substr(2, 9)}`;

  const handleImageError = () => {
    console.warn('Falha ao carregar imagem:', content.image);
    setImageError(true);
  };

  const ImageComponent = ({ src, alt, positionClass }) => {
    if (!src || imageError) return null;
    return (
      <div className={positionClass}>
        <img 
          src={src} 
          alt={alt || 'Imagem da seção'} 
          className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
          loading="lazy"
          width="800"
          height="400"
          onError={handleImageError}
        />
      </div>
    );
  };

  return (
    <section 
      className="py-10 sm:py-16 px-4 transition-colors duration-300" 
      style={backgroundStyle}
      aria-labelledby={`content-section-${sectionId}`}
    >
      <article className="max-w-4xl mx-auto">
        {content.image && imagePosition !== 'below' && (
          <ImageComponent 
            src={content.image} 
            alt={content.imageAlt || content.title} 
            positionClass="mb-6" 
          />
        )}

        <h3 
          id={`content-section-${sectionId}`}
          className={`text-lg sm:text-2xl font-bold mb-4 ${getAlignClass(titleAlign)}`} 
          style={{ color: titleColor }}
        >
          {content.title || 'Conteúdo'}
        </h3>
        
        {content.text && (
          <p 
            className={`text-sm sm:text-lg leading-relaxed ${getAlignClass(textAlign)}`} 
            style={{ color: textColor }}
          >
            {content.text}
          </p>
        )}

        {content.image && imagePosition === 'below' && (
          <ImageComponent 
            src={content.image} 
            alt={content.imageAlt || content.title} 
            positionClass="mt-6" 
          />
        )}
      </article>
    </section>
  );
});

export default ContentSection;