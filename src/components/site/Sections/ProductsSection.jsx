// frontend/src/components/site/Sections/ProductsSection.jsx
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ProductsSection({ section, config, produtos }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const priceColor = styles?.priceColor || config?.cor_botao || '#000000';
  const imageLayout = styles?.imageLayout || 'center';

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
        className="inline-block px-6 md:px-8 py-3 md:py-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base"
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
    <section className="py-12 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto">
        {/* 🎯 LAYOUT CENTRALIZADO */}
        {imageLayout === 'center' && (
          <>
            <h3 className={`${getTitleClasses()} mb-10 md:mb-14 lg:mb-16`} style={{ color: titleColor }}>
              {content.title || 'Nossos Produtos'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-10 md:mb-14 lg:mb-16">
              {produtos.map(produto => (
                <div key={produto.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="p-6 flex items-center justify-center bg-gray-50">
                    <img
                      src={produto.imagem_url || ''}
                      alt={produto.titulo}
                      className="w-full h-64 object-contain"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <h4 className="font-bold text-lg md:text-xl mb-2" style={{ color: titleColor }}>
                      {produto.titulo}
                    </h4>
                    {produto.preco && (
                      <p className="font-bold text-xl md:text-2xl mt-3" style={{ color: priceColor }}>
                        {produto.preco}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {content.buttons?.length > 0 && (
              <div className={`${getButtonsAlignClass()} flex flex-wrap gap-3 md:gap-4 lg:gap-6`}>
                {content.buttons.map((btn, index) => renderButton(btn, index))}
              </div>
            )}
          </>
        )}

        {/* 🎯 LAYOUT LATERAIS */}
        {imageLayout === 'sides' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            {/* Imagem Esquerda */}
            {content.leftImage && (
              <div className="hidden lg:block">
                <img
                  src={content.leftImage}
                  alt="Esquerda"
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}

            {/* Produtos */}
            <div className="lg:col-span-1">
              <h3 className={`${getTitleClasses()} mb-8`} style={{ color: titleColor }}>
                {content.title || 'Nossos Produtos'}
              </h3>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {produtos.slice(0, 2).map(produto => (
                  <div key={produto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                    <div className="p-4 flex items-center justify-center bg-gray-50">
                      <img
                        src={produto.imagem_url || ''}
                        alt={produto.titulo}
                        className="w-full h-48 object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-base sm:text-lg" style={{ color: titleColor }}>
                        {produto.titulo}
                      </h4>
                      {produto.preco && (
                        <p className="font-bold text-lg sm:text-xl mt-2" style={{ color: priceColor }}>
                          {produto.preco}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {content.buttons?.length > 0 && (
                <div className={`${getButtonsAlignClass()} flex flex-wrap gap-3 md:gap-4`}>
                  {content.buttons.map((btn, index) => renderButton(btn, index))}
                </div>
              )}
            </div>

            {/* Imagem Direita */}
            {content.rightImage && (
              <div className="hidden lg:block">
                <img
                  src={content.rightImage}
                  alt="Direita"
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}
          </div>
        )}

        {/* 🎯 LAYOUT GRID */}
        {imageLayout === 'grid' && (
          <div className={`${getAlignClass(styles?.titleAlign || 'center')} space-y-8`}>
            <h3 className={`${getTitleClasses()} mb-6 md:mb-8 lg:mb-10`} style={{ color: titleColor }}>
              {content.title || 'Nossos Produtos'}
            </h3>

            {/* Grid de Imagens */}
            {content.gridImages?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                {content.gridImages.map((img, index) => img && (
                  <img
                    key={index}
                    src={img}
                    alt={`Grid ${index}`}
                    className="w-full h-32 sm:h-40 md:h-48 object-contain rounded-lg shadow-lg hover:shadow-xl transition"
                  />
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-10 md:mb-14 lg:mb-16">
              {produtos.map(produto => (
                <div key={produto.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="p-6 flex items-center justify-center bg-gray-50">
                    <img
                      src={produto.imagem_url || ''}
                      alt={produto.titulo}
                      className="w-full h-64 object-contain"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <h4 className="font-bold text-lg md:text-xl mb-2" style={{ color: titleColor }}>
                      {produto.titulo}
                    </h4>
                    {produto.preco && (
                      <p className="font-bold text-xl md:text-2xl mt-3" style={{ color: priceColor }}>
                        {produto.preco}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {content.buttons?.length > 0 && (
              <div className={`${getButtonsAlignClass()} flex flex-wrap gap-3 md:gap-4 lg:gap-6`}>
                {content.buttons.map((btn, index) => renderButton(btn, index))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
