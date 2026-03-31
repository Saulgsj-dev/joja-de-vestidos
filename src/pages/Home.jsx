// src/pages/Home.jsx - COMPATÍVEL COM BACKEND ATUAL
import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiClient';
import Header from '../components/Header';

export default function Home() {
  const [config, setConfig] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ID fixo para demonstração - em produção, detectar pelo domínio/subdomínio
  const PROFILE_ID = 'demo-profile-id'; 

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // ✅ Apenas rotas que EXISTEM no backend atual
      const [configData, produtosData] = await Promise.all([
        apiRequest(`/api/config?profile_id=${PROFILE_ID}`),
        apiRequest(`/api/produtos?profile_id=${PROFILE_ID}`)
      ]);
      
      setConfig(configData || {});
      setProdutos(produtosData || []);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
      // ✅ Fallback: não quebra a página se falhar
      setConfig({});
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando loja...</p>
        </div>
      </div>
    );
  }

  // ✅ Placeholder SVG para imagens quebradas (sem dependência externa)
  const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESem imagem%3C/text%3E%3C/svg%3E`;

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: config?.cor_fundo || '#ffffff', 
        color: config?.cor_texto || '#000000' 
      }}
    >
      <Header config={config} />
      
      {/* Hero Section */}
      <section className="py-16 px-4 text-center bg-gradient-to-b from-purple-50 to-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Coleção de Vestidos
        </h2>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
          Elegância e estilo para você. Descubra peças exclusivas feitas com amor.
        </p>
      </section>

      {/* Grid de Produtos */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-center mb-8">Nossos Vestidos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map(produto => (
            <div 
              key={produto.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-square bg-gray-100">
                <img 
                  src={produto.imagem_url || PLACEHOLDER} 
                  alt={produto.titulo}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (!e.target.dataset.fallback) {
                      e.target.dataset.fallback = 'true';
                      e.target.src = PLACEHOLDER;
                    }
                  }}
                />
                {produto.destaque && (
                  <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    Destaque
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="font-bold text-lg mb-1 truncate">{produto.titulo}</h4>
                {produto.descricao && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{produto.descricao}</p>
                )}
                {produto.preco && (
                  <p className="font-bold text-xl" style={{ color: config?.cor_botao || '#000' }}>
                    {produto.preco}
                  </p>
                )}
                
                {config?.whatsapp_numero && (
                  <a
                    href={`https://wa.me/${config.whatsapp_numero}?text=Olá, gostaria de saber mais sobre: ${produto.titulo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full block py-2 px-4 rounded-lg text-white font-medium text-center transition hover:opacity-90"
                    style={{ backgroundColor: config?.cor_botao || '#000' }}
                  >
                    Comprar no WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {produtos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">👗 Nenhum vestido disponível no momento</p>
            <p className="text-gray-400">Volte em breve para ver nossa coleção!</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer 
        className="p-6 text-center mt-12"
        style={{ 
          backgroundColor: config?.cor_botao || '#000', 
          color: '#fff' 
        }}
      >
        <p>{config?.footer_texto || '© 2024 Minha Loja de Vestidos'}</p>
        {config?.whatsapp_numero && (
          <p className="text-sm opacity-90 mt-2">
            📱 WhatsApp: ({config.whatsapp_numero})
          </p>
        )}
      </footer>
    </div>
  );
}