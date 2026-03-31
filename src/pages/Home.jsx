// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiClient';
import Header from '../components/Header';

export default function Home() {
  const [config, setConfig] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ID fixo para demonstração - em produção, detectar pelo domínio
  const PROFILE_ID = 'demo-profile-id'; 

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [configData, produtosData] = await Promise.all([
        apiRequest(`/api/config?profile_id=${PROFILE_ID}`),
        apiRequest(`/api/produtos?profile_id=${PROFILE_ID}`)
      ]);
      setConfig(configData || {});
      setProdutos(produtosData || []);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando loja...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: config?.cor_fundo || '#fff', color: config?.cor_texto || '#000' }}>
      <Header config={config} />
      
      {/* Hero Section */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Coleção de Vestidos</h2>
        <p className="text-lg opacity-80">Elegância e estilo para você</p>
      </section>

      {/* Grid de Produtos */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map(produto => (
            <div key={produto.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <img 
                src={produto.imagem_url} 
                alt={produto.titulo}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{produto.titulo}</h3>
                <p className="text-gray-600 mt-1">{produto.descricao}</p>
                <p className="font-bold mt-3" style={{ color: config?.cor_botao }}>
                  {produto.preco}
                </p>
                <button 
                  className="mt-4 w-full py-2 rounded text-white font-medium hover:opacity-90 transition"
                  style={{ backgroundColor: config?.cor_botao }}
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {produtos.length === 0 && (
          <p className="text-center text-gray-500 py-12">Nenhum vestido disponível no momento</p>
        )}
      </section>

      {/* Footer */}
      <footer 
        className="p-6 text-center"
        style={{ backgroundColor: config?.cor_botao, color: '#fff' }}
      >
        {config?.footer_texto || '© 2024 Minha Loja de Vestidos'}
      </footer>
    </div>
  );
}