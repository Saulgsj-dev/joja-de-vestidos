// frontend/src/components/site/Sections/ContactSection.jsx
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ContactSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';

  // 🔹 Tamanhos de Fonte do Título (5 opções)
  const getTitleClasses = () => {
    const sizes = {
      pequeno: 'text-lg md:text-xl',
      medio: 'text-xl md:text-2xl',
      grande: 'text-2xl md:text-3xl',
      extra_grande: 'text-3xl md:text-4xl',
      mega_grande: 'text-4xl md:text-5xl'
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
      pequeno: 'text-sm',
      medio: 'text-base',
      grande: 'text-lg',
      extra_grande: 'text-xl',
      mega_grande: 'text-2xl'
    };
    return `${sizes[styles?.textFontSize || 'medio']} ${getAlignClass(styles?.textAlign || 'center')}`;
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
        className="inline-block px-6 md:px-8 py-2.5 md:py-3 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
    <section className="py-8 sm:py-12 px-4" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        <h3 className={`${getTitleClasses()} mb-4`} style={{ color: titleColor }}>
          {content.title || 'Contato'}
        </h3>
        {content.text && (
          <p className={`${getTextClasses()} mb-6`} style={{ color: textColor }}>
            {content.text}
          </p>
        )}
        {content.buttons?.length > 0 ? (
          <div className={`${getButtonsAlignClass()} flex flex-wrap gap-4`}>
            {content.buttons.map((btn, index) => renderButton(btn, index))}
          </div>
        ) : (
          config?.whatsapp_numero && (
            <div className={getAlignClass(styles?.textAlign || 'center')}>
              <a
                href={`https://wa.me/${config.whatsapp_numero}`}
                className="inline-block px-6 md:px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition shadow-md"
              >
                📱 Falar no WhatsApp
              </a>
            </div>
          )
        )}
      </div>
    </section>
  );
}