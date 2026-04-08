// frontend/src/components/site/Sections/ContentSection.jsx
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ContentSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';
  const imageLayout = styles?.imageLayout || 'center';

  // 🔹 Tamanhos de Fonte do Título (5 opções)
  const getTitleClasses = () => {
    const sizes = {
      pequeno: 'text-xl md:text-2xl',
      medio: 'text-2xl md:text-3xl',
      grande: 'text-3xl md:text-4xl',
      extra_grande: 'text-4xl md:text-5xl',
      mega_grande: 'text-5xl md:text-6xl'
    };
    const weights = {
      normal: 'font-normal',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold'
    };
    return `${sizes[styles?.titleFontSize || 'medio']} ${weights[styles?.titleFontWeight || 'bold']} ${getAlignClass(styles?.titleAlign || 'center')}`;
  };

  // 🔹 Tamanhos de Fonte do Texto (5 opções)
  const getTextClasses = () => {
    const sizes = {
      pequeno: 'text-sm md:text-base',
      medio: 'text-base md:text-lg',
      grande: 'text-lg md:text-xl',
      extra_grande: 'text-xl md:text-2xl',
      mega_grande: 'text-2xl md:text-3xl'
    };
    return `${sizes[styles?.textFontSize || 'medio']} ${getAlignClass(styles?.textAlign || 'center')} leading-relaxed`;
  };

  // 🔹 Tamanhos de Imagem (5 opções) - SEM CORTAR
  const getImageSizeClasses = () => {
    const sizes = {
      pequeno: 'max-h-48',
      medio: 'max-h-64',
      grande: 'max-h-80',
      extra_grande: 'max-h-96',
      mega_grande: 'max-h-[32rem]'
    };
    return sizes[styles?.imageSize || 'medio'];
  };

  // ✅ Helper para imagem otimizada (dimensões + lazy + priority)
  const renderOptimizedImage = (src, alt, className, isLCP = false) => {
    if (!src) return null;
    
    // Dimensões aproximadas para evitar CLS (ajustar conforme suas imagens reais)
    const getDimensions = () => {
      if (className?.includes('max-h-48')) return { width: 192, height: 192 };
      if (className?.includes('max-h-64')) return { width: 256, height: 256 };
      if (className?.includes('max-h-80')) return { width: 320, height: 320 };
      if (className?.includes('max-h-96')) return { width: 384, height: 384 };
      if (className?.includes('max-h-[32rem]')) return { width: 512, height: 512 };
      if (className?.includes('h-32')) return { width: 320, height: 180 };
      if (className?.includes('h-40')) return { width: 400, height: 225 };
      if (className?.includes('h-48')) return { width: 480, height: 270 };
      if (className?.includes('max-h-96') && className?.includes('rounded-lg')) return { width: 400, height: 300 };
      return { width: 800, height: 450 }; // fallback
    };
    
    const { width, height } = getDimensions();
    
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={isLCP ? 'eager' : 'lazy'}
        fetchPriority={isLCP ? 'high' : 'auto'}
        decoding={isLCP ? 'sync' : 'async'}
      />
    );
  };

  // 🔘 Função para renderizar botão
  const renderButton = (btn, index) => {
    if (!btn?.text) return null;
    const isWhatsapp = btn.link?.includes('wa.me') || btn.link?.includes('whatsapp');
    const defaultColor = isWhatsapp ? '#25D366' : styles?.buttonColor || config?.cor_botao || '#000000';
    const bgColor = btn.color || defaultColor;
    
    return (
      <a
        key={index}
        href={btn.link || '#'}
        target={btn.link?.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="inline-block px-6 md:px-8 py-3 md:py-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base"
        style={{ backgroundColor: bgColor }}
      >
        {btn.text}
      </a>
    );
  };

  // 📐 Alinhamento dos botões
  const getButtonsAlignClass = () => {
    const align = styles?.buttonsAlign || 'center';
    if (align === 'left') return 'justify-start';
    if (align === 'right') return 'justify-end';
    return 'justify-center';
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8" style={backgroundStyle}>
      <div className="max-w-6xl mx-auto">
        {/* 🎯 LAYOUT CENTRALIZADO */}
        {imageLayout === 'center' && (
          <div className={`${getAlignClass(styles?.titleAlign || 'center')} space-y-6 md:space-y-8`}>
            {/* Imagem Acima */}
            {content.image && styles?.imagePosition === 'above' && (
              <div className="mb-6 md:mb-10 lg:mb-12 flex justify-center">
                {renderOptimizedImage(content.image, content.title, `${getImageSizeClasses()} object-contain mx-auto drop-shadow-xl`, true)}
              </div>
            )}

            {/* Título */}
            <h3 className={`${getTitleClasses()} mb-4 md:mb-6 lg:mb-8`} style={{ color: titleColor }}>
              {content.title || 'Seção'}
            </h3>

            {/* Imagem Entre */}
            {content.image && styles?.imagePosition === 'between' && (
              <div className="my-6 md:my-10 lg:my-12 flex justify-center">
                {renderOptimizedImage(content.image, content.title, `${getImageSizeClasses()} object-contain mx-auto drop-shadow-xl`, false)}
              </div>
            )}

            {/* Texto */}
            {content.text && (
              <div className="mb-8 md:mb-12 lg:mb-16">
                <p className={`${getTextClasses()} max-w-4xl mx-auto`} style={{ color: textColor }}>
                  {content.text}
                </p>
              </div>
            )}

            {/* Imagem Abaixo */}
            {content.image && styles?.imagePosition === 'below' && (
              <div className="mt-6 md:mt-10 lg:mt-12 mb-8 md:mb-12 flex justify-center">
                {renderOptimizedImage(content.image, content.title, `${getImageSizeClasses()} object-contain mx-auto drop-shadow-xl`, false)}
              </div>
            )}

            {/* Botões */}
            {content.buttons?.length > 0 && (
              <div className={`${getButtonsAlignClass()} flex flex-wrap gap-3 md:gap-4 lg:gap-6 mt-8 md:mt-12`}>
                {content.buttons.map((btn, index) => renderButton(btn, index))}
              </div>
            )}
          </div>
        )}

        {/* 🎯 LAYOUT LATERAIS */}
        {imageLayout === 'sides' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            {/* Imagem Esquerda */}
            {content.leftImage && (
              <div className="hidden lg:block">
                {renderOptimizedImage(content.leftImage, 'Esquerda', 'w-full h-auto max-h-96 object-contain rounded-lg shadow-2xl', false)}
              </div>
            )}

            {/* Conteúdo Central */}
            <div className={`${getAlignClass(styles?.titleAlign || 'center')} space-y-6`}>
              {/* Imagem Principal Acima */}
              {content.image && styles?.imagePosition === 'above' && (
                <div className="mb-4 flex justify-center">
                  {renderOptimizedImage(content.image, content.title, `${getImageSizeClasses()} object-contain mx-auto drop-shadow-xl`, true)}
                </div>
              )}

              {/* Título */}
              <h3 className={`${getTitleClasses()} mb-4`} style={{ color: titleColor }}>
                {content.title || 'Seção'}
              </h3>

              {/* Imagem Principal Entre */}
              {content.image && styles?.imagePosition === 'between' && (
                <div className="my-4 flex justify-center">
                  {renderOptimizedImage(content.image, content.title, `${getImageSizeClasses()} object-contain mx-auto drop-shadow-xl`, false)}
                </div>
              )}

              {/* Texto */}
              {content.text && (
                <div className="mb-6">
                  <p className={`${getTextClasses()}`} style={{ color: textColor }}>
                    {content.text}
                  </p>
                </div>
              )}

              {/* Imagem Principal Abaixo */}
              {content.image && styles?.imagePosition === 'below' && (
                <div className="mt-4 flex justify-center">
                  {renderOptimizedImage(content.image, content.title, `${getImageSizeClasses()} object-contain mx-auto drop-shadow-xl`, false)}
                </div>
              )}

              {/* Botões */}
              {content.buttons?.length > 0 && (
                <div className={`${getButtonsAlignClass()} flex flex-wrap gap-3 md:gap-4 mt-6`}>
                  {content.buttons.map((btn, index) => renderButton(btn, index))}
                </div>
              )}
            </div>

            {/* Imagem Direita */}
            {content.rightImage && (
              <div className="hidden lg:block">
                {renderOptimizedImage(content.rightImage, 'Direita', 'w-full h-auto max-h-96 object-contain rounded-lg shadow-2xl', false)}
              </div>
            )}
          </div>
        )}

        {/* 🎯 LAYOUT GRID */}
        {imageLayout === 'grid' && (
          <div className={`${getAlignClass(styles?.titleAlign || 'center')} space-y-8`}>
            {/* Título */}
            <h3 className={`${getTitleClasses()} mb-6 md:mb-8 lg:mb-10`} style={{ color: titleColor }}>
              {content.title || 'Seção'}
            </h3>

            {/* Texto */}
            {content.text && (
              <div className="mb-8 md:mb-12">
                <p className={`${getTextClasses()} max-w-4xl mx-auto`} style={{ color: textColor }}>
                  {content.text}
                </p>
              </div>
            )}

            {/* Grid de Imagens */}
            {content.gridImages?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                {content.gridImages.map((img, index) => img && (
                  <img
                    key={index}
                    src={img}
                    alt={`Grid ${index}`}
                    className="w-full h-32 sm:h-40 md:h-48 object-contain rounded-lg shadow-lg hover:shadow-xl transition"
                    width={320}
                    height={180}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            )}

            {/* Botões */}
            {content.buttons?.length > 0 && (
              <div className={`${getButtonsAlignClass()} flex flex-wrap gap-3 md:gap-4 lg:gap-6 mt-8 md:mt-12`}>
                {content.buttons.map((btn, index) => renderButton(btn, index))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}