// frontend/src/components/site/Sections/ProductsSection.jsx
import React, { memo, useMemo, useState } from 'react';
import { getBackgroundStyle, getAlignClass } from '../../../utils/styleHelpers';

const ProductCard = memo(function ProductCard({ produto, titleColor, priceColor }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article 
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-400"
      itemScope 
      itemType="https://schema.org/Product"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {!imageError && produto.imagem_url ? (
          <img 
            src={produto.imagem_url} 
            alt={produto.titulo || 'Produto'} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            width="400"
            height="400"
            onError={() => setImageError(true)}
            itemProp="image"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
            <span className="text-4xl" aria-hidden="true">🛍️</span>
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-5">
        <h4 
          className="font-bold text-base sm:text-lg line-clamp-2 min-h-[2.5rem]" 
          style={{ color: titleColor }}
          itemProp="name"
        >
          {produto.titulo || 'Sem título'}
        </h4>
        
        {produto.preco && (
          <p 
            className="font-bold text-lg sm:text-xl mt-2" 
            style={{ color: priceColor }}
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <span itemProp="priceCurrency" content="BRL">R$</span>
            <span itemProp="price">{produto.preco.replace(/\D/g, '')}</span>
          </p>
        )}
        
        {produto.descricao && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2" itemProp="description">
            {produto.descricao}
          </p>
        )}
      </div>
    </article>
  );
});

const ProductsSection = memo(function ProductsSection({ section = {}, config = {}, produtos = [] }) {
  const { content = {}, styles = {} } = section;
  const backgroundStyle = useMemo(() => getBackgroundStyle(styles), [styles]);
  
  const titleColor = styles.titleColor || config.cor_texto || '#1f2937';
  const priceColor = styles.priceColor || config.cor_botao || '#059669';
  const titleAlign = styles.titleAlign || 'center';

  const hasProducts = produtos?.length > 0;

  return (
    <section 
      className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 transition-colors duration-300" 
      style={backgroundStyle}
      aria-labelledby="products-section-title"
    >
      <h3 
        id="products-section-title"
        className={`text-xl sm:text-3xl font-bold mb-8 sm:mb-10 ${getAlignClass(titleAlign)}`} 
        style={{ color: titleColor }}
      >
        {content.title || 'Nossos Produtos'}
      </h3>
      
      {!hasProducts ? (
        <div className={`text-center py-12 ${getAlignClass(titleAlign)}`}>
          <p className="text-gray-500 text-lg">Nenhum produto cadastrado ainda.</p>
          <p className="text-gray-400 text-sm mt-2">Volte em breve para conferir nossas novidades! ✨</p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          role="list"
        >
          {produtos.map((produto) => (
            <ProductCard 
              key={produto.id || produto.titulo} 
              produto={produto} 
              titleColor={titleColor} 
              priceColor={priceColor} 
            />
          ))}
        </div>
      )}
    </section>
  );
});

export default ProductsSection;