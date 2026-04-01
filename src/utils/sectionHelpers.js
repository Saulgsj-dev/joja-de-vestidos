export const SECTION_TYPES = {
  HEADER: 'header',
  HERO: 'hero',
  PRODUCTS: 'products',
  CONTENT: 'content',
  CONTACT: 'contact'
};

export const getSectionLabel = (type, index) => {
  const labels = {
    [SECTION_TYPES.HEADER]: 'Header',
    [SECTION_TYPES.HERO]: 'Hero Section',
    [SECTION_TYPES.PRODUCTS]: 'Produtos',
    [SECTION_TYPES.CONTENT]: `Conteúdo ${index + 1}`,
    [SECTION_TYPES.CONTACT]: 'Contato'
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