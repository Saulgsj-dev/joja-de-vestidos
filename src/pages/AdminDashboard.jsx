// src/pages/AdminDashboard.jsx
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
  const [saving, setSaving] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    titulo: '', descricao: '', preco: '', imagem_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verificarAuth();
  }, []);

  const verificarAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.warn('Sessão não encontrada, redirecionando...');
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      await Promise.all([
        carregarConfig(session.user.id), 
        carregarProdutos(session.user.id)
      ]);
    } catch (err) {
      console.error('Erro na verificação de auth:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const carregarConfig = async (profileId) => {
    try {
      const data = await apiRequest(`/api/config?profile_id=${profileId}`);
      if (data && Object.keys(data).length > 0) {
        setConfig(data);
      }
    } catch (e) {
      console.error('Erro ao carregar config:', e);
      // Não bloqueia a UI se falhar
    }
  };

  const carregarProdutos = async () => {
    try {
      // A rota /api/meus-produtos já usa o token para identificar o usuário
      const data = await apiRequest(`/api/meus-produtos`);
      setProdutos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
      setProdutos([]);
    }
  };

  const salvarConfig = async () => {
    if (saving) return;
    setSaving(true);
    
    try {
      await apiRequest('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      alert('✅ Configurações salvas com sucesso!');
    } catch (e) {
      console.error('Erro ao salvar config:', e);
      alert('❌ Erro ao salvar: ' + (e.message || 'Verifique seu login'));
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (campo, valor) => {
    setConfig(prev => ({ ...prev, [campo]: valor }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação básica de tipo e tamanho
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('A imagem deve ter menos de 5MB.');
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setNovoProduto(prev => ({ ...prev, imagem_url: url }));
      alert('✅ Imagem enviada com sucesso!');
    } catch (e) {
      console.error('Erro no upload:', e);
      alert('❌ Erro no upload: ' + (e.message || 'Tente novamente'));
    } finally {
      setUploading(false);
      // Limpa o input para permitir reupload do mesmo arquivo
      e.target.value = '';
    }
  };

  const criarProduto = async () => {
    if (!novoProduto.titulo?.trim() || !novoProduto.imagem_url) {
      alert('⚠️ Preencha pelo menos o título e envie uma imagem.');
      return;
    }

    try {
      await apiRequest('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: novoProduto.titulo.trim(),
          descricao: novoProduto.descricao?.trim() || '',
          preco: novoProduto.preco?.trim() || '',
          imagem_url: novoProduto.imagem_url,
          destaque: false
        })
      });
      
      setNovoProduto({ titulo: '', descricao: '', preco: '', imagem_url: '' });
      await carregarProdutos();
      alert('✅ Produto criado com sucesso!');
    } catch (e) {
      console.error('Erro ao criar produto:', e);
      alert('❌ Erro ao criar produto: ' + (e.message || 'Tente novamente'));
    }
  };

  const deletarProduto = async (id) => {
    if (!confirm('⚠️ Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await apiRequest(`/api/produtos/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      await carregarProdutos();
      alert('✅ Produto excluído com sucesso!');
    } catch (e) {
      console.error('Erro ao excluir produto:', e);
      alert('❌ Erro ao excluir: ' + (e.message || 'Tente novamente'));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen" 
      style={{ 
        backgroundColor: config.cor_fundo, 
        color: config.cor_texto,
        transition: 'background-color 0.3s, color 0.3s'
      }}
    >
      <Header config={config} onLogout={handleLogout} />
      
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">🎛️ Painel Administrativo</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition"
          >
            🔐 Sair
          </button>
        </div>
        
        {/* Editor de Cores */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-4">🎨 Personalizar Loja</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
              <input 
                type="color" 
                value={config.cor_fundo}
                onChange={(e) => handleColorChange('cor_fundo', e.target.value)}
                className="w-full h-12 rounded cursor-pointer border"
                aria-label="Selecionar cor de fundo"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cor do Texto</label>
              <input 
                type="color" 
                value={config.cor_texto}
                onChange={(e) => handleColorChange('cor_texto', e.target.value)}
                className="w-full h-12 rounded cursor-pointer border"
                aria-label="Selecionar cor do texto"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Cor do Botão</label>
              <input 
                type="color" 
                value={config.cor_botao}
                onChange={(e) => handleColorChange('cor_botao', e.target.value)}
                className="w-full h-12 rounded cursor-pointer border"
                aria-label="Selecionar cor do botão"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Texto do Footer</label>
            <input 
              type="text" 
              value={config.footer_texto}
              onChange={(e) => setConfig(prev => ({ ...prev, footer_texto: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="© 2024 Minha Loja"
              maxLength={100}
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">WhatsApp (com DDD)</label>
            <input 
              type="tel" 
              value={config.whatsapp_numero}
              onChange={(e) => setConfig(prev => ({ ...prev, whatsapp_numero: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Ex: 5511999999999"
              maxLength={20}
            />
          </div>

          <button 
            onClick={salvarConfig}
            disabled={saving}
            className={`mt-6 px-6 py-3 text-white font-bold rounded transition flex items-center gap-2
              ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
            style={{ backgroundColor: config.cor_botao }}
          >
            {saving ? (
              <>
                <span className="animate-spin">⏳</span> Salvando...
              </>
            ) : (
              <>💾 Salvar Alterações</>
            )}
          </button>
        </section>

        {/* Gerenciador de Produtos */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-semibold mb-4">👗 Gerenciar Vestidos</h3>
          
          {/* Formulário de Novo Produto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <input 
              type="text"
              placeholder="Título do vestido *"
              value={novoProduto.titulo}
              onChange={(e) => setNovoProduto(p => ({...p, titulo: e.target.value}))}
              className="p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              maxLength={100}
            />
            <input 
              type="text"
              placeholder="Preço (ex: R$ 199,90)"
              value={novoProduto.preco}
              onChange={(e) => setNovoProduto(p => ({...p, preco: e.target.value}))}
              className="p-2 border rounded dark:bg-gray-600 dark:border-gray-500"
              maxLength={20}
            />
            <textarea 
              placeholder="Descrição"
              value={novoProduto.descricao}
              onChange={(e) => setNovoProduto(p => ({...p, descricao: e.target.value}))}
              className="p-2 border rounded md:col-span-2 dark:bg-gray-600 dark:border-gray-500"
              rows="2"
              maxLength={500}
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Imagem do Produto *</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 disabled:opacity-50"
              />
              {uploading && (
                <span className="text-sm text-blue-600 mt-2 inline-block">
                  ⏳ Enviando imagem...
                </span>
              )}
              {novoProduto.imagem_url && (
                <div className="mt-2 relative inline-block">
                  <img 
                    src={novoProduto.imagem_url} 
                    alt="Preview" 
                    className="h-20 rounded object-cover border" 
                  />
                  <button
                    type="button"
                    onClick={() => setNovoProduto(p => ({...p, imagem_url: ''}))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                    aria-label="Remover imagem"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={criarProduto}
              disabled={uploading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 md:col-span-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              + Adicionar Produto
            </button>
          </div>

          {/* Lista de Produtos */}
          <div className="space-y-3">
            {produtos.map(produto => (
              <div 
                key={produto.id} 
                className="flex items-center gap-4 p-3 border rounded hover:shadow-sm transition bg-white dark:bg-gray-700"
              >
                <img 
                  src={produto.imagem_url} 
                  alt={produto.titulo} 
                  className="w-16 h-16 object-cover rounded flex-shrink-0" 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64?text=Sem+imagem';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{produto.titulo}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{produto.preco}</p>
                  {produto.descricao && (
                    <p className="text-xs text-gray-400 truncate mt-1">{produto.descricao}</p>
                  )}
                </div>
                <button 
                  onClick={() => deletarProduto(produto.id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm transition"
                >
                  Excluir
                </button>
              </div>
            ))}
            {produtos.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhum produto cadastrado ainda. Adicione o primeiro acima! 👆
              </p>
            )}
          </div>
        </section>

        {/* Preview do Footer */}
        <footer 
          className="p-4 text-center mt-8 rounded-lg shadow"
          style={{ 
            backgroundColor: config.cor_botao, 
            color: '#ffffff',
            transition: 'background-color 0.3s'
          }}
        >
          {config.footer_texto}
        </footer>
      </main>
    </div>
  );
}