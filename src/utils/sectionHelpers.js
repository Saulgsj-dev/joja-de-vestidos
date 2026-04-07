export const SECTION_TYPES = {
  HEADER: 'header',
  HERO: 'hero',
  PRODUCTS: 'products',
  CONTENT: 'content',
  CONTACT: 'contact',
  FOOTER: 'footer'
};

export const getSectionLabel = (type, index) => {
  // Conta apenas seções de conteúdo para a numeração
  const contentSections = ['content'];
  
  if (type === 'header') return '🔝 Header';
  if (type === 'hero') return '🎯 Hero Section';
  if (type === 'products') return '🛍️ Produtos';
  if (type === 'contact') return '📞 Contato';
  if (type === 'footer') return '🔻 Footer (Rodapé)';
  if (type === 'content') return `📄 Conteúdo ${index + 1}`;
  
  return type;
};

export const getDefaultSection = (type, order) => ({
  section_type: type,
  section_order: order,
  content: {},
  styles: {},
  is_active: 1
});