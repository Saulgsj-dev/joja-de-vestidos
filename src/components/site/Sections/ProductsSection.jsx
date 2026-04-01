// frontend/src/components/site/Sections/ProductsSection.jsx
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

export default function ProductsSection({ section, config, produtos }) {
  const { content, styles } = section;
  const backgroundStyle = getBackgroundStyle(styles);
  const titleColor = styles?.titleColor || config?.cor_texto || '#000000';
  const priceColor = styles?.priceColor || config?.cor_botao || '#000000';

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12" style={backgroundStyle}>
      <h3 className={`sm:text-2xl font-bold mb-8 ${getAlignClass(styles?.titleAlign || 'center')}`} style={{ color: titleColor }}>
        {content.title || 'Nossos Produtos'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </section>
  );
}