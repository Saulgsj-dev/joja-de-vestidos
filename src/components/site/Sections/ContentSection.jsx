import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ContentSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';

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

  return (
    <section className="py-8 sm:py-12 px-4" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        {content.image && styles?.imagePosition !== 'below' && (
          <img src={content.image} alt={content.title} className="w-full h-64 object-cover rounded-lg mb-4 shadow-md" />
        )}
        
        <h3 className={`text-xl sm:text-2xl font-semibold mb-4 ${getAlignClass(styles?.titleAlign || 'left')}`} style={{ color: titleColor }}>
          {content.title || 'Seção'}
        </h3>
        
        {content.text && (
          <p className={`text-sm sm:text-base ${getAlignClass(styles?.textAlign || 'left')} mb-6`} style={{ color: textColor }}>
            {content.text}
          </p>
        )}
        
        {content.image && styles?.imagePosition === 'below' && (
          <img src={content.image} alt={content.title} className="w-full h-64 object-cover rounded-lg mt-4 shadow-md" />
        )}
        
        {/* 🔘 BOTÕES */}
        {content.buttons?.length > 0 && (
          <div className={`${getAlignClass(styles?.titleAlign || 'left')} mt-6 flex flex-wrap gap-4`}>
            {content.buttons.map((btn, index) => renderButton(btn, index))}
          </div>
        )}
      </div>
    </section>
  );
}