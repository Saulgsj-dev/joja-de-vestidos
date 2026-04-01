// frontend/src/utils/styleHelpers.js
// 🔹 Funções utilitárias para estilos - Versão Otimizada

/**
 * @typedef {'left' | 'center' | 'right' | 'justify'} AlignType
 * @typedef {'small' | 'medium' | 'large' | 'xlarge'} FontSizeType
 * @typedef {'normal' | 'semibold' | 'bold' | 'extrabold'} FontWeightType
 * @typedef {'above' | 'between' | 'below'} ImagePositionType
 * @typedef {'center' | 'sides' | 'grid'} ImageLayoutType
 * @typedef {'solid' | 'gradient' | 'image'} BackgroundType
 */

/**
 * @typedef {Object} SectionStyles
 * @property {string} [titleColor]
 * @property {string} [textColor]
 * @property {string} [subtitleColor]
 * @property {string} [priceColor]
 * @property {AlignType} [titleAlign]
 * @property {AlignType} [textAlign]
 * @property {AlignType} [subtitleAlign]
 * @property {FontSizeType} [titleFontSize]
 * @property {FontSizeType} [subtitleFontSize]
 * @property {FontSizeType} [textFontSize]
 * @property {FontWeightType} [titleFontWeight]
 * @property {ImagePositionType} [imagePosition]
 * @property {ImageLayoutType} [imageLayout]
 * @property {string} [bgColor]
 * @property {string} [backgroundColor]
 * @property {BackgroundType} [bgType]
 * @property {BackgroundType} [backgroundType]
 * @property {string} [gradientStart]
 * @property {string} [gradientEnd]
 * @property {string} [backgroundImage]
 * @property {number} [backgroundOpacity]
 * @property {string} [backgroundSize]
 * @property {string} [backgroundPosition]
 * @property {string} [backgroundRepeat]
 */

/**
 * Gera objeto de estilo CSS para background (suporta cor, gradiente ou imagem)
 * @param {SectionStyles} styles - Objeto de estilos da seção
 * @returns {React.CSSProperties} Estilo CSS para aplicar no elemento
 */
export const getBackgroundStyle = (styles = {}) => {
  const backgroundStyle = {};
  
  // 🖼️ Background com IMAGEM
  if (styles.backgroundType === 'image' && styles.backgroundImage) {
    const opacity = Math.min(Math.max((styles.backgroundOpacity || 100) / 100, 0), 1);
    const overlayColor = styles.backgroundOverlayColor || '#000000';
    const overlayOpacity = (styles.backgroundOverlayOpacity || 40) / 100;
    
    backgroundStyle.backgroundImage = `url(${styles.backgroundImage})`;
    backgroundStyle.backgroundSize = styles.backgroundSize || 'cover';
    backgroundStyle.backgroundPosition = styles.backgroundPosition || 'center';
    backgroundStyle.backgroundRepeat = styles.backgroundRepeat || 'no-repeat';
    backgroundStyle.backgroundColor = `${overlayColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')}`;
    backgroundStyle.backgroundBlendMode = styles.backgroundBlendMode || 'multiply';
    
    return backgroundStyle;
  }
  
  // 🌈 Background com GRADIENTE
  if (styles.bgType === 'gradient' && styles.gradientStart && styles.gradientEnd) {
    backgroundStyle.background = `linear-gradient(135deg, ${styles.gradientStart}, ${styles.gradientEnd})`;
    return backgroundStyle;
  }
  
  // 🎨 Background com COR SÓLIDA
  backgroundStyle.backgroundColor = styles.backgroundColor || styles.bgColor || '#ffffff';
  return backgroundStyle;
};

/**
 * Retorna classe Tailwind para alinhamento de texto
 * @param {AlignType | string} align - Tipo de alinhamento
 * @param {boolean} includeFlex - Se deve incluir classes flexbox também
 * @returns {string} Classe(s) Tailwind para alinhamento
 */
export const getAlignClass = (align = 'center', includeFlex = false) => {
  const alignClasses = { 
    left: includeFlex ? 'text-left justify-start' : 'text-left', 
    center: includeFlex ? 'text-center justify-center' : 'text-center', 
    right: includeFlex ? 'text-right justify-end' : 'text-right',
    justify: 'text-justify'
  };
  return alignClasses[align] || alignClasses.center;
};

/**
 * Retorna classes de fonte para TÍTULOS
 * @param {SectionStyles} styles - Objeto de estilos da seção
 * @param {Object} [defaults] - Valores padrão opcionais
 * @returns {Object} Objeto com classes Tailwind e estilos inline
 */
export const getTitleFontClasses = (styles = {}, defaults = {}) => {
  const sizes = { 
    small: 'text-lg', 
    medium: 'text-xl', 
    large: 'text-3xl', 
    xlarge: 'text-4xl',
    '2xlarge': 'text-5xl'
  };
  const weights = { 
    normal: 'font-normal', 
    semibold: 'font-semibold', 
    bold: 'font-bold', 
    extrabold: 'font-extrabold' 
  };
  const lineHeights = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed'
  };
  
  return {
    className: `${sizes[styles.titleFontSize || defaults.size || 'large']} ${weights[styles.titleFontWeight || defaults.weight || 'bold']} ${getAlignClass(styles.titleAlign || defaults.align || 'center')} ${lineHeights[styles.titleLineHeight] || 'leading-tight'} transition-colors`,
    style: { color: styles.titleColor || defaults.color || '#1f2937' }
  };
};

/**
 * Retorna classes de fonte para SUBTÍTULOS/DESCRIÇÕES
 * @param {SectionStyles} styles - Objeto de estilos da seção
 * @param {Object} [defaults] - Valores padrão opcionais
 * @returns {Object} Objeto com classes Tailwind e estilos inline
 */
export const getSubtitleFontClasses = (styles = {}, defaults = {}) => {
  const sizes = { 
    small: 'text-xs', 
    medium: 'text-sm', 
    large: 'text-base',
    xlarge: 'text-lg'
  };
  
  return {
    className: `${sizes[styles.subtitleFontSize || defaults.size || 'medium']} ${getAlignClass(styles.subtitleAlign || defaults.align || 'center')} opacity-90`,
    style: { color: styles.subtitleColor || defaults.color || '#6b7280' }
  };
};

/**
 * Retorna classes de fonte para TEXTOS GERAIS (parágrafos, descrições)
 * @param {SectionStyles} styles - Objeto de estilos da seção
 * @param {Object} [defaults] - Valores padrão opcionais
 * @returns {Object} Objeto com classes Tailwind e estilos inline
 */
export const getTextFontClasses = (styles = {}, defaults = {}) => {
  const sizes = { 
    small: 'text-xs', 
    medium: 'text-sm', 
    large: 'text-base',
    xlarge: 'text-lg'
  };
  
  return {
    className: `${sizes[styles.textFontSize || defaults.size || 'medium']} ${getAlignClass(styles.textAlign || defaults.align || 'left')} leading-relaxed`,
    style: { color: styles.textColor || defaults.color || '#374151' }
  };
};

/**
 * Helper para aplicar múltiplas classes de fonte em um elemento
 * @param {...Object} fontClasses - Objetos retornados pelas funções get*FontClasses
 * @returns {string} String de classes combinadas
 * @example
 * className={applyFontClasses(
 *   getTitleFontClasses(styles),
 *   getSubtitleFontClasses(styles)
 * )}
 */
export const applyFontClasses = (...fontClasses) => {
  return fontClasses
    .map(fc => fc?.className || '')
    .filter(Boolean)
    .join(' ')
    .trim();
};

/**
 * Gera estilo inline para cor de texto com fallback
 * @param {string} color - Cor em formato CSS
 * @param {string} [fallback='#1f2937'] - Cor de fallback
 * @returns {React.CSSProperties} Estilo CSS para color
 */
export const getTextColorStyle = (color, fallback = '#1f2937') => {
  return { color: color || fallback };
};

/**
 * Gera classes para sombras e efeitos visuais
 * @param {'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} size - Tamanho da sombra
 * @param {boolean} hover - Se deve aplicar efeito hover
 * @returns {string} Classes Tailwind para shadow
 */
export const getShadowClasses = (size = 'md', hover = false) => {
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };
  
  const base = shadows[size] || shadows.md;
  return hover ? `${base} hover:${shadows[size === 'none' ? 'md' : size]} transition-shadow duration-300` : base;
};

/**
 * Gera classes para bordas arredondadas
 * @param {'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'} radius - Raio da borda
 * @returns {string} Classes Tailwind para border-radius
 */
export const getRoundedClasses = (radius = 'lg') => {
  const radiuses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };
  return radiuses[radius] || radiuses.lg;
};

/**
 * Normaliza número de telefone para formato WhatsApp (apenas dígitos)
 * @param {string} phone - Número de telefone em qualquer formato
 * @returns {string} Número formatado apenas com dígitos
 */
export const formatWhatsAppNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

/**
 * Gera URL completa para WhatsApp com mensagem pré-preenchida
 * @param {string} phone - Número de telefone
 * @param {string} [message] - Mensagem opcional
 * @returns {string} URL formatada para wa.me
 */
export const getWhatsAppURL = (phone, message = '') => {
  const number = formatWhatsAppNumber(phone);
  if (!number) return '';
  
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  
  const encodedMessage = encodeURIComponent(message.trim());
  return `${base}?text=${encodedMessage}`;
};

/**
 * Safe getter para acessar propriedades aninhadas sem erro
 * @param {Object} obj - Objeto principal
 * @param {string} path - Caminho da propriedade (ex: 'styles.titleColor')
 * @param {*} [defaultValue] - Valor padrão se não encontrado
 * @returns {*} Valor encontrado ou default
 */
export const getSafe = (obj, path, defaultValue = undefined) => {
  try {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Merge seguro de objetos de estilo com prioridade
 * @param {Object} base - Objeto base
 * @param {Object} overrides - Objeto com sobrescritas
 * @returns {Object} Objeto mesclado
 */
export const mergeStyles = (base = {}, overrides = {}) => {
  return { ...base, ...overrides };
};

// 🎯 Exportação de constantes úteis para reuso
export const FONT_SIZES = {
  small: 'text-xs',
  medium: 'text-sm', 
  large: 'text-base',
  xlarge: 'text-lg',
  '2xlarge': 'text-xl'
};

export const FONT_WEIGHTS = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
};

export const TEXT_COLORS = {
  primary: '#1f2937',
  secondary: '#4b5563',
  muted: '#6b7280',
  light: '#f9fafb',
  white: '#ffffff'
};

export const BG_COLORS = {
  white: '#ffffff',
  gray: '#f9fafb',
  dark: '#1f2937',
  black: '#000000'
};