// frontend/src/components/site/Sections/HeroSection.jsx
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function HeroSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const imagePosition = styles?.imagePosition || 'above';
  const imageLayout = styles?.imageLayout || 'center';

  // 🔹 Tamanhos de Fonte do Título (5 opções)
  const getTitleClasses = () => {
    const sizes = {
      pequeno: 'text-xl md:text-2xl',
      medio: 'text-2xl md:text-3xl',
      grande: 'text-3xl md:text-4xl lg:text-5xl',
      extra_grande: 'text-4xl md:text-5xl lg:text-6xl',
      mega_grande: 'text-5xl md:text-6xl lg:text-7xl'
    };
    const weights = {
      normal: 'font-normal',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold'
    };
    return `${sizes[styles?.titleFontSize || 'grande']} ${weights[styles?.titleFontWeight || 'bold']} ${getAlignClass(styles?.titleAlign || 'center')}`;
  };

  // 🔹 Tamanhos de Fonte do Subtítulo (5 opções)
  const getSubtitleClasses = () => {
    const sizes = {
      pequeno: 'text-sm md:text-base',
      medio: 'text-base md:text-lg',
      grande: 'text-lg md:text-xl',
      extra_grande: 'text-xl md:text-2xl',
      mega_grande: 'text-2xl md:text-3xl'
    };
    return `${sizes[styles?.subtitleFontSize || 'medio']} ${getAlignClass(styles?.subtitleAlign || 'center')}`;
  };

  // 🔹 Tamanhos de Imagem (5 opções) - SEM CORTAR
  const getImageSizeClasses = () => {
    const sizes = {
      pequeno: 'max-w-24 max-h-24 md:max-w-32 md:max-h-32',
      medio: 'max-w-32 max-h-32 md:max-w-48 md:max-h-48',
      grande: 'max-w-48 max-h-48 md:max-w-64 md:max-h-64',
      extra_grande: 'max-w-64 max-h-64 md:max-w-80 md:max-h-80',
      mega_grande: 'max-w-80 max-h-80 md:max-w-96 md:max-h-96'
    };
    return sizes[styles?.imageSize || 'grande'];
  };

  const titleColor = styles?.titleColor || '#ffffff';
  const subtitleColor = styles?.subtitleColor || '#e5e7eb';

  // 🔘 Função para renderizar botão
  const renderButton = (btn, index) => {
    if (!btn?.text) return null;
    const isWhatsapp = btn.link?.includes('wa.me') || btn.link?.includes('whatsapp');
    const defaultColor = isWhatsapp ? '#25D366' : '#f59e0b';
    const bgColor = btn.color || defaultColor;
    
    return (
      <a
        key={index}
        href={btn.link || '#'}
        target={btn.link?.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="inline-block px-8 md:px-12 py-3 md:py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
    <section
      className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        {imageLayout === 'center' && (
          <div className={`${getAlignClass(styles?.titleAlign || 'center')} space-y-6 md:space-y-8`}>
            {imagePosition === 'above' && content.image && (
              <div className="mb-4 md:mb-8 flex justify-center">
                <img
                  src={content.image}
                  alt="Logo"
                  className={`${getImageSizeClasses()} object-contain drop-shadow-2xl transition-all duration-300`}
                />
              </div>
            )}

            <h2
              className={`${getTitleClasses()} mb-4 md:mb-6 drop-shadow-lg leading-tight md:leading-snug`}
              style={{ color: titleColor }}
            >
              {content.title || 'Bem-vindo'}
            </h2>

            {imagePosition === 'between' && content.image && (
              <div className="my-4 md:my-8 flex justify-center">
                <img
                  src={content.image}
                  alt="Principal"
                  className={`${getImageSizeClasses()} object-contain drop-shadow-2xl transition-all duration-300`}
                />
              </div>
            )}

            <p
              className={`${getSubtitleClasses()} opacity-95 max-w-3xl mx-auto mb-6 md:mb-8 drop-shadow-md leading-relaxed`}
              style={{ color: subtitleColor }}
            >
              {content.subtitle || 'Sua mensagem aqui'}
            </p>

            {imagePosition === 'below' && content.image && (
              <div className="mt-4 md:mt-8 flex justify-center">
                <img
                  src={content.image}
                  alt="Principal"
                  className={`${getImageSizeClasses()} object-contain drop-shadow-2xl transition-all duration-300`}
                />
              </div>
            )}

            {content.buttons?.length > 0 && (
              <div className={`${getButtonsAlignClass()} mt-6 md:mt-10 flex flex-wrap gap-4`}>
                {content.buttons.map((btn, index) => renderButton(btn, index))}
              </div>
            )}
          </div>
        )}

        {imageLayout === 'sides' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            {content.leftImage && (
              <div className="hidden lg:block">
                <img
                  src={content.leftImage}
                  alt="Esquerda"
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}

            <div className={`${getAlignClass(styles?.titleAlign || 'center')} space-y-6`}>
              {imagePosition === 'above' && content.image && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={content.image}
                    alt="Principal"
                    className={`${getImageSizeClasses()} object-contain drop-shadow-2xl`}
                  />
                </div>
              )}

              <h2 className={`${getTitleClasses()} mb-4 drop-shadow-lg`} style={{ color: titleColor }}>
                {content.title || 'Bem-vindo'}
              </h2>

              {imagePosition === 'between' && content.image && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={content.image}
                    alt="Principal"
                    className={`${getImageSizeClasses()} object-contain drop-shadow-2xl`}
                  />
                </div>
              )}

              <p className={`${getSubtitleClasses()} opacity-95 max-w-lg mx-auto mb-6 drop-shadow-md`} style={{ color: subtitleColor }}>
                {content.subtitle || 'Sua mensagem aqui'}
              </p>

              {imagePosition === 'below' && content.image && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={content.image}
                    alt="Principal"
                    className={`${getImageSizeClasses()} object-contain drop-shadow-2xl`}
                  />
                </div>
              )}

              {content.buttons?.length > 0 && (
                <div className={`${getButtonsAlignClass()} mt-6 flex flex-wrap gap-4`}>
                  {content.buttons.map((btn, index) => renderButton(btn, index))}
                </div>
              )}
            </div>

            {content.rightImage && (
              <div className="hidden lg:block">
                <img
                  src={content.rightImage}
                  alt="Direita"
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>
        )}

        {imageLayout === 'grid' && (
          <div className={`${getAlignClass(styles?.titleAlign || 'center')} space-y-8`}>
            <h2 className={`${getTitleClasses()} mb-4 drop-shadow-lg`} style={{ color: titleColor }}>
              {content.title || 'Bem-vindo'}
            </h2>

            <p className={`${getSubtitleClasses()} opacity-95 max-w-2xl mx-auto mb-8 drop-shadow-md`} style={{ color: subtitleColor }}>
              {content.subtitle || 'Sua mensagem aqui'}
            </p>

            {content.gridImages?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {content.gridImages.map((img, index) => img && (
                  <img
                    key={index}
                    src={img}
                    alt={`Grid ${index}`}
                    className="w-full h-32 sm:h-40 md:h-48 object-contain rounded-lg shadow-lg hover:shadow-xl transition"
                  />
                ))}
              </div>
            )}

            {content.buttons?.length > 0 && (
              <div className={`${getButtonsAlignClass()} mt-8 flex flex-wrap gap-4`}>
                {content.buttons.map((btn, index) => renderButton(btn, index))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}