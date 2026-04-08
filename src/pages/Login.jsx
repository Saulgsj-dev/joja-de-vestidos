// frontend/src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/apiClient';

// 🔹 CONFIGURAÇÃO: Slug padrão para fallback (edite aqui!)
const DEFAULT_STORE_SLUG = 'carvalhoemartins';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storeSlug, setStoreSlug] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin';

  // 🔍 Tenta recuperar o slug em múltiplas fontes
  useEffect(() => {
    const loadStoreSlug = async () => {
      // 1º: Prioridade máxima - parâmetro na URL (?store=...)
      const params = new URLSearchParams(location.search);
      const urlSlug = params.get('store');
      if (urlSlug) {
        setStoreSlug(urlSlug);
        localStorage.setItem('storeSlug', urlSlug);
        return;
      }
      
      // 2º: localStorage (persiste entre sessões)
      const savedSlug = localStorage.getItem('storeSlug');
      if (savedSlug) {
        setStoreSlug(savedSlug);
        return;
      }
      
      // 3º: Fallback configurado (ex: 'carvalhoemartins')
      if (DEFAULT_STORE_SLUG) {
        setStoreSlug(DEFAULT_STORE_SLUG);
        console.log('🔗 Usando slug de fallback:', DEFAULT_STORE_SLUG);
      }
    };
    
    loadStoreSlug();
  }, [location.search]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const {  { session }, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (session?.user) {
        // ✅ Após login, tenta buscar o slug REAL pela API
        try {
          const profile = await apiRequest(`/api/profile/by-user/${session.user.id}`);
          if (profile?.slug) {
            setStoreSlug(profile.slug);
            localStorage.setItem('storeSlug', profile.slug); // 💾 Salva para próximas visitas
            console.log('✅ Slug oficial recuperado:', profile.slug);
          }
        } catch (err) {
          console.warn('⚠️ Não foi possível recuperar slug oficial, usando fallback');
          // Mantém o fallback se a API falhar
        }
        
        // Navega para o admin
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Função para navegar para o site público (COM FALLBACK)
  const handleViewSite = () => {
    const targetSlug = storeSlug || DEFAULT_STORE_SLUG;
    const targetUrl = `/${targetSlug}`;
    console.log('🔗 Navegando para site público:', targetUrl);
    navigate(targetUrl);
  };

  // 🔄 Função para voltar para raiz (caso precise)
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🌐 Painel do Site</h1>
          <p className="text-gray-500 mt-2">Acesse para editar seu site</p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        
        {/* 🔘 Botões de navegação - COM FALLBACK INTELIGENTE */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          {/* ✅ Botão "Ver Site" - Vai para /{slug} ou fallback */}
          <button
            onClick={handleViewSite}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm"
            title={storeSlug ? `Ir para /${storeSlug}` : `Fallback: /${DEFAULT_STORE_SLUG}`}
          >
            👁️ Ver Site
          </button>
          
          {/* ✅ Botão "Voltar" - Vai para raiz (/) */}
          <button
            onClick={handleGoHome}
            className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition text-sm"
          >
            ← Voltar
          </button>
        </div>
        
        {/* 🔗 Link direto para o site público (ajuda visual) */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Não consegue acessar?{' '}
          <a
            href={`/${DEFAULT_STORE_SLUG}`}
            onClick={(e) => { e.preventDefault(); handleViewSite(); }}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Clique aqui para visitar /{DEFAULT_STORE_SLUG}
          </a>
        </p>
        
        {/* Debug visual (apenas em desenvolvimento) */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
            <p>🔧 Debug:</p>
            <p>Slug atual: {storeSlug || 'null'}</p>
            <p>Fallback: {DEFAULT_STORE_SLUG}</p>
            <p>localStorage: {localStorage.getItem('storeSlug') || 'vazio'}</p>
          </div>
        )}
      </div>
    </div>
  );
}