// 🔹 Funções utilitárias para estilos - styleHelpers.js

/**
 * Calcula contraste entre duas cores hex (WCAG 2.1)
 * @param {string} hex1 - Cor em hex (#RRGGBB)
 * @param {string} hex2 - Cor em hex (#RRGGBB)
 * @returns {number} - Ratio de contraste (1-21)
 */
export const getContrastRatio = (hex1, hex2) => {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const getLuminance = ({ r, g, b }) => {
    const [R, G, B] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;
  
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Valida se as cores têm contraste suficiente para acessibilidade
 * @param {string} fg - Cor do texto
 * @param {string} bg - Cor de fundo
 * @param {string} level - 'AA' (4.5:1) ou 'AAA' (7:1)
 * @returns {boolean}
 */
export const validateContrast = (fg, bg, level = 'AA') => {
  const ratio = getContrastRatio(fg, bg);
  const minRatio = level === 'AAA' ? 7 : 4.5;
  return ratio >= minRatio;
};

/**
 * Gera objeto de estilo para background (cor ou imagem)
 */
export const getBackgroundStyle = (styles) => {
  const backgroundStyle = {};
  
  if (styles?.backgroundType === 'image' && styles?.backgroundImage) {
    const opacity = (styles.backgroundOpacity || 100) / 100;
    backgroundStyle.backgroundImage = `url(${styles.backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundRepeat = 'no-repeat';
    backgroundStyle.backgroundColor = `rgba(0, 0, 0, ${0.4 * opacity})`;
    backgroundStyle.backgroundBlendMode = 'multiply';
  } else {
    backgroundStyle.backgroundColor = styles?.backgroundColor || '#ffffff';
  }
  
  return backgroundStyle;
};

/**
 * Retorna classe Tailwind para alinhamento de texto
 */
export const getAlignClass = (align) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  return alignClasses[align] || 'text-center';
};

/**
 * Retorna classes de fonte para TÍTULOS
 */
export const getTitleFontClasses = (styles, defaults = {}) => {
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
  
  return {
    size: sizes[styles?.titleFontSize || defaults.size || 'medio'],
    weight: weights[styles?.titleFontWeight || defaults.weight || 'bold'],
    color: styles?.titleColor || defaults.color || '#ffffff',
    align: getAlignClass(styles?.titleAlign || defaults.align || 'center')
  };
};

/**
 * Retorna classes de fonte para SUBTÍTULOS/DESCRIÇÕES
 */
export const getSubtitleFontClasses = (styles, defaults = {}) => {
  const sizes = {
    pequeno: 'text-sm md:text-base',
    medio: 'text-base md:text-lg',
    grande: 'text-lg md:text-xl',
    extra_grande: 'text-xl md:text-2xl',
    mega_grande: 'text-2xl md:text-3xl'
  };
  
  return {
    size: sizes[styles?.subtitleFontSize || defaults.size || 'medio'],
    color: styles?.subtitleColor || defaults.color || '#e5e7eb',
    align: getAlignClass(styles?.subtitleAlign || defaults.align || 'center')
  };
};

/**
 * Retorna classes de fonte para TEXTOS GERAIS
 */
export const getTextFontClasses = (styles, defaults = {}) => {
  const sizes = {
    pequeno: 'text-sm',
    medio: 'text-base',
    grande: 'text-lg',
    extra_grande: 'text-xl',
    mega_grande: 'text-2xl'
  };
  
  return {
    size: sizes[styles?.textFontSize || defaults.size || 'medio'],
    color: styles?.textColor || defaults.color || '#374151',
    align: getAlignClass(styles?.textAlign || defaults.align || 'left')
  };
};

/**
 * Helper para aplicar múltiplas classes de fonte
 */
export const applyFontClasses = (fontClasses) => {
  return `${fontClasses.size || ''} ${fontClasses.weight || ''} ${fontClasses.align || ''}`.trim();
};