import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ContactSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';

  return (
    <section className="py-8 sm:py-12 px-4" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        <h3 className={`sm:text-xl font-semibold mb-4 ${getAlignClass(styles?.titleAlign || 'center')}`} style={{ color: titleColor }}>
          {content.title || 'Contato'}
        </h3>
        {content.text && (
          <p className={`text-sm sm:text-base ${getAlignClass(styles?.textAlign || 'center')} mb-4`} style={{ color: textColor }}>
            {content.text}
          </p>
        )}
        {config?.whatsapp_numero && (
          <div className={getAlignClass(styles?.textAlign || 'center')}>
            <a
              href={`https://wa.me/${config.whatsapp_numero}`}
              className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              📱 Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}