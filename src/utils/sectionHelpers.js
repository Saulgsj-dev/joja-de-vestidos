// frontend/src/utils/sectionHelpers.js
export const SECTION_TYPES = {
  HEADER: 'header',
  HERO: 'hero',
  PRODUCTS: 'products',
  CONTENT: 'content',
  CONTACT: 'contact',
  FOOTER: 'footer'
};

export const getSectionLabel = (type, index) => {
  const labels = {
    [SECTION_TYPES.HEADER]: 'Header',
    [SECTION_TYPES.HERO]: 'Hero Section',
    [SECTION_TYPES.PRODUCTS]: 'Produtos',
    [SECTION_TYPES.CONTENT]: `Conteúdo ${index + 1}`,
    [SECTION_TYPES.CONTACT]: 'Contato',
    [SECTION_TYPES.FOOTER]: 'Footer'
  };
  
  return labels[type] || type;
};

export const getDefaultSection = (type, order) => ({
  section_type: type,
  section_order: order,
  content: {},
  styles: {},
  is_active: 1
});