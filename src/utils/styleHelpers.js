// frontend/src/utils/styleHelpers.js
// 🔹 Funções utilitárias para estilos - styleHelpers.js

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
 * @param {Object} styles - Objeto de estilos da seção
 * @param {Object} defaults - Valores padrão opcionais
 */
export const getTitleFontClasses = (styles, defaults = {}) => {
  const sizes = { 
    small: 'text-lg', 
    medium: 'text-xl', 
    large: 'text-3xl', 
    xlarge: 'text-4xl' 
  };
  const weights = { 
    normal: 'font-normal', 
    semibold: 'font-semibold', 
    bold: 'font-bold', 
    extrabold: 'font-extrabold' 
  };
  
  return {
    size: sizes[styles?.titleFontSize || defaults.size || 'large'],
    weight: weights[styles?.titleFontWeight || defaults.weight || 'bold'],
    color: styles?.titleColor || defaults.color || '#ffffff',
    align: getAlignClass(styles?.titleAlign || defaults.align || 'center')
  };
};

/**
 * Retorna classes de fonte para SUBTÍTULOS/DESCRIÇÕES
 * @param {Object} styles - Objeto de estilos da seção
 * @param {Object} defaults - Valores padrão opcionais
 */
export const getSubtitleFontClasses = (styles, defaults = {}) => {
  const sizes = { 
    small: 'text-xs', 
    medium: 'text-sm', 
    large: 'text-base' 
  };
  
  return {
    size: sizes[styles?.subtitleFontSize || defaults.size || 'medium'],
    color: styles?.subtitleColor || defaults.color || '#e5e7eb',
    align: getAlignClass(styles?.subtitleAlign || defaults.align || 'center')
  };
};

/**
 * Retorna classes de fonte para TEXTOS GERAIS (seções de conteúdo)
 * @param {Object} styles - Objeto de estilos da seção
 * @param {Object} defaults - Valores padrão opcionais
 */
export const getTextFontClasses = (styles, defaults = {}) => {
  const sizes = { 
    small: 'text-xs', 
    medium: 'text-sm', 
    large: 'text-base' 
  };
  
  return {
    size: sizes[styles?.textFontSize || defaults.size || 'medium'],
    color: styles?.textColor || defaults.color || '#374151',
    align: getAlignClass(styles?.textAlign || defaults.align || 'left')
  };
};

/**
 * Helper para aplicar múltiplas classes de fonte em um elemento
 * Uso: className={`${getTitleFontClasses(styles).size} ${getTitleFontClasses(styles).weight}`}
 */
export const applyFontClasses = (fontClasses) => {
  return `${fontClasses.size || ''} ${fontClasses.weight || ''} ${fontClasses.align || ''}`.trim();
};