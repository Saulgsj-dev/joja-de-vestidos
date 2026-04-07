// frontend/src/components/site/Sections/ContentSection.jsx
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ContentSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';

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
        {/* ✅ IMAGEM ACIMA DO TÍTULO - SEM CORTAR */}
        {content.image && styles?.imagePosition === 'above' && (
          <div className="mb-6 md:mb-10 lg:mb-12">
            <img
              src={content.image}
              alt={content.title}
              className={`w-full ${getImageSizeClasses()} object-contain mx-auto`}
            />
          </div>
        )}

        {/* ✅ TÍTULO */}
        <h3 className={`${getTitleClasses()} mb-4 md:mb-6 lg:mb-8`} style={{ color: titleColor }}>
          {content.title || 'Seção'}
        </h3>

        {/* ✅ IMAGEM ENTRE TÍTULO E TEXTO - SEM CORTAR */}
        {content.image && styles?.imagePosition === 'between' && (
          <div className="my-6 md:my-10 lg:my-12">
            <img
              src={content.image}
              alt={content.title}
              className={`w-full ${getImageSizeClasses()} object-contain mx-auto`}
            />
          </div>
        )}

        {/* ✅ TEXTO/DESCRIÇÃO */}
        {content.text && (
          <div className="mb-8 md:mb-12 lg:mb-16">
            <p className={`${getTextClasses()} max-w-4xl mx-auto`} style={{ color: textColor }}>
              {content.text}
            </p>
          </div>
        )}

        {/* ✅ IMAGEM ABAIXO DO TEXTO - SEM CORTAR */}
        {content.image && styles?.imagePosition === 'below' && (
          <div className="mt-6 md:mt-10 lg:mt-12 mb-8 md:mb-12">
            <img
              src={content.image}
              alt={content.title}
              className={`w-full ${getImageSizeClasses()} object-contain mx-auto`}
            />
          </div>
        )}

        {/* ✅ BOTÕES */}
        {content.buttons?.length > 0 && (
          <div className={`${getButtonsAlignClass()} flex flex-wrap gap-3 md:gap-4 lg:gap-6 mt-8 md:mt-12`}>
            {content.buttons.map((btn, index) => renderButton(btn, index))}
          </div>
        )}
      </div>
    </section>
  );
}