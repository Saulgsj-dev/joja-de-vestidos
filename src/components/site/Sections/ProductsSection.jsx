import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ProductsSection({ section, config, produtos }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const priceColor = styles?.priceColor || config?.cor_botao || '#000000';

  // 🔹 Tamanhos de Fonte do Título (5 opções)
  const getTitleClasses = () => {
    const sizes = {
      pequeno: 'text-xl md:text-2xl',
      medio: 'text-2xl md:text-3xl',
      grande: 'text-3xl md:text-4xl',
      extra_grande: 'text-4xl md:text-5xl',
      mega_grande: 'text-5xl md:text-6xl'
    };
    const weights = {
      normal: 'font-normal',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold'
    };
    return `${sizes[styles?.titleFontSize || 'grande']} ${weights[styles?.titleFontWeight || 'bold']} ${getAlignClass(styles?.titleAlign || 'center')}`;
  };

  // 🔘 Função para renderizar botão
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

  // 📐 Alinhamento dos botões
  const getButtonsAlignClass = () => {
    const align = styles?.buttonsAlign || 'center';
    if (align === 'left') return 'justify-start';
    if (align === 'right') return 'justify-end';
    return 'justify-center';
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12" style={backgroundStyle}>
      <h3 className={`${getTitleClasses()} mb-8`} style={{ color: titleColor }}>
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
      {content.buttons?.length > 0 && (
        <div className={`${getButtonsAlignClass()} flex flex-wrap gap-4`}>
          {content.buttons.map((btn, index) => renderButton(btn, index))}
        </div>
      )}
    </section>
  );
}