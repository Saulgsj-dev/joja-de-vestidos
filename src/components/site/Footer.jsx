// frontend/src/components/site/Footer.jsx
import { getAlignClass } from '../../utils/styleHelpers';

export default function Footer({ config, sections, isPreview = false }) {
  const footerSection = sections?.find(s => s.section_type === 'footer');
  
  const backgroundColor = footerSection?.styles?.backgroundColor || config?.cor_botao || '#000000';
  const textColor = footerSection?.styles?.textColor || '#ffffff';
  const backgroundType = footerSection?.styles?.backgroundType || 'color';
  const backgroundImage = footerSection?.styles?.backgroundImage || '';
  const backgroundOpacity = (footerSection?.styles?.backgroundOpacity || 100) / 100;
  
  const paddingTop = footerSection?.styles?.paddingTop || 'py-12';
  const paddingBottom = footerSection?.styles?.paddingBottom || 'py-8';
  
  const iconPosition = footerSection?.styles?.iconPosition || 'top';
  const iconSize = footerSection?.styles?.iconSize || 'medio';
  const titleFontSize = footerSection?.styles?.titleFontSize || 'medio';
  const titleFontWeight = footerSection?.styles?.titleFontWeight || 'bold';
  const titleAlign = footerSection?.styles?.titleAlign || 'center';
  
  const descriptionFontSize = footerSection?.styles?.descriptionFontSize || 'pequeno';
  const descriptionAlign = footerSection?.styles?.descriptionAlign || 'center';
  const descriptionColor = footerSection?.styles?.descriptionColor || '#9ca3af';
  
  const buttonPosition = footerSection?.styles?.buttonPosition || 'bottom';
  const buttonSize = footerSection?.styles?.buttonSize || 'medio';
  
  const icon = footerSection?.content?.icon || '';
  const title = footerSection?.content?.title || '© 2024 Minha Loja';
  const description = footerSection?.content?.description || '';
  const button = footerSection?.content?.button || null;
  
  const backgroundStyle = {};
  if (backgroundType === 'image' && backgroundImage) {
    backgroundStyle.backgroundImage = `url(${backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundColor = `rgba(0, 0, 0, ${0.6 * backgroundOpacity})`;
    backgroundStyle.backgroundBlendMode = 'multiply';
  } else {
    backgroundStyle.backgroundColor = backgroundColor;
  }
  
  const getIconSizeClasses = () => {
    const sizes = {
      pequeno: 'w-8 h-8',
      medio: 'w-12 h-12',
      grande: 'w-16 h-16',
      extra_grande: 'w-24 h-24'
    };
    return sizes[iconSize] || sizes.medio;
  };
  
  const getTitleFontSizeClasses = () => {
    const sizes = {
      pequeno: 'text-sm md:text-base',
      medio: 'text-base md:text-lg',
      grande: 'text-lg md:text-xl',
      extra_grande: 'text-xl md:text-2xl'
    };
    return sizes[titleFontSize] || sizes.medio;
  };
  
  const getTitleFontWeightClasses = () => {
    const weights = {
      normal: 'font-normal',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold'
    };
    return weights[titleFontWeight] || weights.bold;
  };
  
  const getDescriptionFontSizeClasses = () => {
    const sizes = {
      pequeno: 'text-xs md:text-sm',
      medio: 'text-sm md:text-base',
      grande: 'text-base md:text-lg'
    };
    return sizes[descriptionFontSize] || sizes.pequeno;
  };
  
  const getButtonSizeClasses = () => {
    const sizes = {
      pequeno: 'px-4 py-2 text-sm',
      medio: 'px-6 py-3 text-base',
      grande: 'px-8 py-4 text-lg'
    };
    return sizes[buttonSize] || sizes.medio;
  };
  
  const renderButton = () => {
    if (!button?.text) return null;
    const isWhatsapp = button.link?.includes('wa.me') || button.link?.includes('whatsapp');
    const bgColor = button.color || (isWhatsapp ? '#25D366' : '#ffffff');
    const textColorButton = isWhatsapp || button.color ? '#ffffff' : '#000000';
    
    return (
      <a
        href={button.link || '#'}
        target={button.link?.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className={`inline-block rounded-lg font-medium transition-all duration-300 hover:opacity-90 ${getButtonSizeClasses()}`}
        style={{ backgroundColor: bgColor, color: textColorButton }}
      >
        {button.text}
      </a>
    );
  };
  
  const renderIcon = () => {
    if (!icon) return null;
    return (
      <div className={`mb-4 ${getAlignClass(titleAlign)}`}>
        <img
          src={icon}
          alt="Logo"
          className={`${getIconSizeClasses()} object-contain mx-auto`}
        />
      </div>
    );
  };
  
  return (
    <footer
      className={`${paddingTop} ${paddingBottom} px-4 md:px-6 lg:px-8 w-full`}
      style={backgroundStyle}
    >
      <div className="max-w-6xl mx-auto">
        {/* Layout com ícone na esquerda/direita */}
        {(iconPosition === 'left' || iconPosition === 'right') && icon ? (
          <div className={`flex items-center gap-6 ${
            iconPosition === 'left' ? 'flex-row' : 'flex-row-reverse'
          } ${getAlignClass(titleAlign)}`}>
            {renderIcon()}
            <div className="flex-1 space-y-2">
              {buttonPosition === 'top' && renderButton()}
              <h3
                className={`${getTitleFontSizeClasses()} ${getTitleFontWeightClasses()} ${getAlignClass(titleAlign)}`}
                style={{ color: textColor }}
              >
                {title}
              </h3>
              {description && (
                <p
                  className={`${getDescriptionFontSizeClasses()} ${getAlignClass(descriptionAlign)}`}
                  style={{ color: descriptionColor }}
                >
                  {description}
                </p>
              )}
              {buttonPosition === 'bottom' && renderButton()}
            </div>
          </div>
        ) : (
          /* Layout com ícone no topo ou sem ícone */
          <div className={`space-y-4 ${getAlignClass(titleAlign)}`}>
            {iconPosition === 'top' && renderIcon()}
            {buttonPosition === 'top' && (
              <div className="mb-4">{renderButton()}</div>
            )}
            <h3
              className={`${getTitleFontSizeClasses()} ${getTitleFontWeightClasses()}`}
              style={{ color: textColor }}
            >
              {title}
            </h3>
            {description && (
              <p
                className={`${getDescriptionFontSizeClasses()}`}
                style={{ color: descriptionColor }}
              >
                {description}
              </p>
            )}
            {buttonPosition === 'bottom' && (
              <div className="mt-4">{renderButton()}</div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}