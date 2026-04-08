// frontend/src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/apiClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storeSlug, setStoreSlug] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin';

  // 🔍 Tenta recuperar o slug da loja (para o botão "Ver Site")
  useEffect(() => {
    const loadStoreSlug = async () => {
      // 1º: Tenta pegar do localStorage (se já foi salvo antes)
      const savedSlug = localStorage.getItem('storeSlug');
      if (savedSlug) {
        setStoreSlug(savedSlug);
        return;
      }
      
      // 2º: Tenta pegar da URL (ex: /login?store=minha-loja)
      const params = new URLSearchParams(location.search);
      const urlSlug = params.get('store');
      if (urlSlug) {
        setStoreSlug(urlSlug);
        localStorage.setItem('storeSlug', urlSlug);
        return;
      }
      
      // 3º: Tenta buscar pelo email (se o usuário já digitou)
      if (email) {
        try {
          // Busca perfil público por email (rota da sua API)
          const profile = await apiRequest(`/api/profile/by-email/${email}`)
            .catch(() => null);
          if (profile?.slug) {
            setStoreSlug(profile.slug);
            localStorage.setItem('storeSlug', profile.slug);
          }
        } catch (e) {
          console.log('⚠️ Não foi possível recuperar o slug');
        }
      }
    };
    
    loadStoreSlug();
  }, [email, location.search]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      if (session) {
        // ✅ Salva o slug no localStorage após login bem-sucedido
        if (storeSlug) {
          localStorage.setItem('storeSlug', storeSlug);
        }
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Função para navegar para o site público
  const handleViewSite = () => {
    const targetUrl = storeSlug ? `/${storeSlug}` : '/';
    navigate(targetUrl);
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
        
        {/* 🔘 Botões de navegação */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          {/* ✅ Botão "Ver Site" - Navega para o site público */}
          <button
            onClick={handleViewSite}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm"
          >
            👁️ Ver Site
          </button>
          
          {/* ✅ Botão "Voltar" - Fallback simples */}
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition text-sm"
          >
            ← Voltar
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-4">
          Não consegue acessar? <br />
          <button 
            onClick={handleViewSite}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Clique aqui para visitar seu site público
          </button>
        </p>
      </div>
    </div>
  );
}