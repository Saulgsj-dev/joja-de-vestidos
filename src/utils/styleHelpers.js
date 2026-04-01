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

export const getFontClasses = (styles, defaultSize = 'medium', defaultWeight = 'normal') => {
  const fontSizes = { small: 'text-sm', medium: 'text-base', large: 'text-lg', xlarge: 'text-xl' };
  const fontWeights = { normal: 'font-normal', semibold: 'font-semibold', bold: 'font-bold', extrabold: 'font-extrabold' };
  return {
    size: fontSizes[styles?.fontSize || defaultSize],
    weight: fontWeights[styles?.fontWeight || defaultWeight]
  };
};

export const getAlignClass = (align) => {
  const alignClasses = { left: 'text-left', center: 'text-center', right: 'text-right' };
  return alignClasses[align] || 'text-center';
};