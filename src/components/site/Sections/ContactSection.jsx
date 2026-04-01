// frontend/src/components/site/Sections/ContactSection.jsx
import React, { memo, useMemo } from 'react';
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

const ContactSection = memo(function ContactSection({ section = {}, config = {} }) {
  const { content = {}, styles = {} } = section;
  const backgroundStyle = useMemo(() => getBackgroundStyle(styles), [styles]);
  
  const titleColor = styles.titleColor || config.cor_texto || '#1f2937';
  const textColor = styles.textColor || '#4b5563';
  const titleAlign = styles.titleAlign || 'center';
  const textAlign = styles.textAlign || 'center';
  const whatsappNumber = config.whatsapp_numero?.replace(/\D/g, '');

  return (
    <section 
      className="py-10 sm:py-16 px-4 transition-colors duration-300" 
      style={backgroundStyle}
      aria-labelledby="contact-section-title"
    >
      <div className="max-w-4xl mx-auto">
        <h3 
          id="contact-section-title"
          className={`text-lg sm:text-2xl font-bold mb-5 transition-colors ${getAlignClass(titleAlign)}`} 
          style={{ color: titleColor }}
        >
          {content.title || 'Entre em Contato'}
        </h3>
        
        {content.text && (
          <p 
            className={`text-sm sm:text-lg leading-relaxed mb-8 ${getAlignClass(textAlign)}`} 
            style={{ color: textColor }}
          >
            {content.text}
          </p>
        )}
        
        {whatsappNumber && (
          <div className={getAlignClass(textAlign)}>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Olá!%20Gostaria%20de%20mais%20informações.`}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-500 text-white font-medium rounded-xl 
                         hover:bg-green-600 active:scale-[0.98] transition-all duration-200 shadow-lg 
                         hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar conosco no WhatsApp"
            >
              <span className="text-xl" aria-hidden="true">📱</span>
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
});

export default ContactSection;