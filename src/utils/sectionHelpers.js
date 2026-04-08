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
  if (type === 'header') return '🔝 Header';
  if (type === 'hero') return '🎯 Hero Section';
  if (type === 'products') return '🛍️ Produtos';
  if (type === 'contact') return '📞 Contato';
  if (type === 'footer') return '🔻 Footer (Rodapé)';  // ✅ Footer com label próprio
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
