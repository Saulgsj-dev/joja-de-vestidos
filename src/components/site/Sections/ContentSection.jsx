import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ContentSection({ section, config }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const textColor = styles?.textColor || '#374151';

  return (
    <section className="py-8 sm:py-12 px-4" style={backgroundStyle}>
      <div className="max-w-4xl mx-auto">
        {content.image && styles?.imagePosition !== 'below' && (
          <img src={content.image} alt={content.title} className="w-full h-64 object-cover rounded-lg mb-4 shadow-md" />
        )}
        <h3 className={`sm:text-xl font-semibold mb-4 ${getAlignClass(styles?.titleAlign || 'left')}`} style={{ color: titleColor }}>
          {content.title || 'Seção'}
        </h3>
        {content.text && (
          <p className={`text-sm sm:text-base ${getAlignClass(styles?.textAlign || 'left')}`} style={{ color: textColor }}>
            {content.text}
          </p>
        )}
        {content.image && styles?.imagePosition === 'below' && (
          <img src={content.image} alt={content.title} className="w-full h-64 object-cover rounded-lg mt-4 shadow-md" />
        )}
      </div>
    </section>
  );
}