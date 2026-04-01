import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ProductsSection({ section, config, produtos }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const priceColor = styles?.priceColor || config?.cor_botao || '#000000';

  const renderButton = (btn, index) => {
    if (!btn?.text) return null;
    
    const isWhatsapp = btn.link?.includes('wa.me') || btn.link?.includes('whatsapp');
    const defaultColor = isWhatsapp ? '#25D366' : styles?.buttonColor || config?.cor_botao || '#000000';
    const bgColor = btn.color || defaultColor;
    
    return (
      <a
        key={index}
        href={btn.link || '#'}
        target={btn.link?.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="inline-block px-6 md:px-8 py-2.5 md:py-3 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        style={{ backgroundColor: bgColor }}
      >
        {btn.text}
      </a>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12" style={backgroundStyle}>
      <h3 className={`text-2xl sm:text-3xl font-bold mb-8 ${getAlignClass(styles?.titleAlign || 'center')}`} style={{ color: titleColor }}>
        {content.title || 'Nossos Produtos'}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {produtos.map(produto => (
          <div key={produto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
            <div className="aspect-square bg-gray-100">
              <img src={produto.imagem_url || ''} alt={produto.titulo} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-base sm:text-lg" style={{ color: titleColor }}>{produto.titulo}</h4>
              {produto.preco && (
                <p className="font-bold text-lg sm:text-xl mt-2" style={{ color: priceColor }}>{produto.preco}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 🔘 BOTÕES DA SEÇÃO */}
      {content.buttons?.length > 0 && (
        <div className={`${getAlignClass(styles?.titleAlign || 'center')} flex flex-wrap gap-4 justify-center`}>
          {content.buttons.map((btn, index) => renderButton(btn, index))}
        </div>
      )}
    </section>
  );
}