import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { apiRequest, uploadImage } from '../lib/apiClient';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [config, setConfig] = useState({
    cor_fundo: '#ffffff',
    cor_texto: '#000000',
    cor_botao: '#000000',
    footer_texto: '© 2024 Minha Loja',
    whatsapp_numero: ''
  });
  const [produtos, setProdutos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [novoProduto, setNovoProduto] = useState({
    titulo: '', descricao: '', preco: '', imagem_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verificarAuth();
  }, []);

  const verificarAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    setUser(session.user);
    await Promise.all([carregarConfig(session.user.id), carregarProdutos(session.user.id)]);
    setLoading(false);
  };

  const carregarConfig = async (profileId) => {
    try {
      const data = await apiRequest(`/api/config?profile_id=${profileId}`);
      if (data) setConfig(data);
    } catch (e) {
      console.error('Erro ao carregar config:', e);
    }
  };

  const carregarProdutos = async (profileId) => {
    try {
      const data = await apiRequest(`/api/meus-produtos`);
      setProdutos(data || []);
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
    }
  };

  const salvarConfig = async () => {
    try {
      await apiRequest('/api/config', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      alert('✅ Configurações salvas!');
    } catch (e) {
      alert('Erro: ' + e.message);
    }
  };

  const handleColorChange = (campo, valor) => {
    setConfig(prev => ({ ...prev, [campo]: valor }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setNovoProduto(prev => ({ ...prev, imagem_url: url }));
      alert('✅ Imagem enviada!');
    } catch (e) {
      alert('Erro no upload: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const criarProduto = async () => {
    if (!novoProduto.titulo || !novoProduto.imagem_url) {
      alert('Preencha título e imagem');
      return;
    }

    try {
      await apiRequest('/api/produtos', {
        method: 'POST',
        body: JSON.stringify({
          ...novoProduto,
          destaque: false
        })
      });
      setNovoProduto({ titulo: '', descricao: '', preco: '', imagem_url: '' });
      await carregarProdutos(user.id);
      alert('✅ Produto criado!');
    } catch (e) {
      alert('Erro: ' + e.message);
    }
  };

  const deletarProduto = async (id) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    
    try {
      await apiRequest(`/api/produtos/${id}`, { method: 'DELETE' });
      await carregarProdutos(user.id);
      alert('✅ Produto excluído!');
    } catch (e) {
      alert('Erro: ' + e.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: config.cor_fundo, color: config.cor_texto }}>
      <Header config={config} />
      
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8">🎛️ Painel Administrativo</h2>
        
        {/* Editor de Cores */}
        <section className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-4">🎨 Personalizar Loja</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
              <input 
                type="color" 
                value={config.cor_fundo}
                onChange={(e) => handleColorChange('cor_fundo', e.target.value)}
                className="w-full h-12 rounded cursor-pointer border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cor do Texto</label>
              <input 
                type="color" 
                value={config.cor_texto}
                onChange={(e) => handleColorChange('cor_texto', e.target.value)}
                className="w-full h-12 rounded cursor-pointer border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cor do Botão</label>
              <input 
                type="color" 
                value={config.cor_botao}
                onChange={(e) => handleColorChange('cor_botao', e.target.value)}
                className="w-full h-12 rounded cursor-pointer border"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Texto do Footer</label>
            <input 
              type="text" 
              value={config.footer_texto}
              onChange={(e) => setConfig(prev => ({ ...prev, footer_texto: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="© 2024 Minha Loja"
            />
          </div>

          <button 
            onClick={salvarConfig}
            className="mt-6 px-6 py-3 text-white font-bold rounded hover:opacity-90 transition"
            style={{ backgroundColor: config.cor_botao }}
          >
            💾 Salvar Alterações
          </button>
        </section>

        {/* Gerenciador de Produtos */}
        <section className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-4">👗 Gerenciar Vestidos</h3>
          
          {/* Formulário de Novo Produto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded">
            <input 
              type="text"
              placeholder="Título do vestido"
              value={novoProduto.titulo}
              onChange={(e) => setNovoProduto(p => ({...p, titulo: e.target.value}))}
              className="p-2 border rounded"
            />
            <input 
              type="text"
              placeholder="Preço (ex: R$ 199,90)"
              value={novoProduto.preco}
              onChange={(e) => setNovoProduto(p => ({...p, preco: e.target.value}))}
              className="p-2 border rounded"
            />
            <textarea 
              placeholder="Descrição"
              value={novoProduto.descricao}
              onChange={(e) => setNovoProduto(p => ({...p, descricao: e.target.value}))}
              className="p-2 border rounded md:col-span-2"
              rows="2"
            />
            <div className="md:col-span-2">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              />
              {uploading && <span className="text-sm text-gray-500">Enviando...</span>}
              {novoProduto.imagem_url && (
                <img src={novoProduto.imagem_url} alt="Preview" className="mt-2 h-20 rounded" />
              )}
            </div>
            <button 
              onClick={criarProduto}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 md:col-span-2"
            >
              + Adicionar Produto
            </button>
          </div>

          {/* Lista de Produtos */}
          <div className="space-y-3">
            {produtos.map(produto => (
              <div key={produto.id} className="flex items-center gap-4 p-3 border rounded">
                <img src={produto.imagem_url} alt={produto.titulo} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{produto.titulo}</p>
                  <p className="text-sm text-gray-500">{produto.preco}</p>
                </div>
                <button 
                  onClick={() => deletarProduto(produto.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                >
                  Excluir
                </button>
              </div>
            ))}
            {produtos.length === 0 && (
              <p className="text-center text-gray-500 py-4">Nenhum produto cadastrado</p>
            )}
          </div>
        </section>

        {/* Preview do Footer */}
        <footer 
          className="p-4 text-center mt-8 rounded"
          style={{ backgroundColor: config.cor_botao, color: '#ffffff' }}
        >
          {config.footer_texto}
        </footer>
      </main>
    </div>
  );
}