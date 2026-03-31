// src/pages/Login.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [nomeLoja, setNomeLoja] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin';

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Cadastro
        const { data: { user }, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nome_loja: nomeLoja }
          }
        });
        
        if (error) throw error;
        
        if (user) {
          alert('✅ Conta criada! Faça login para continuar.');
          setIsSignUp(false);
        }
      } else {
        // Login
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (session) {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
      alert('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">👗 Minha Loja</h1>
          <p className="text-gray-500 mt-2">
            {isSignUp ? 'Crie sua conta' : 'Acesse seu painel'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Campo Nome da Loja (apenas no cadastro) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Loja
              </label>
              <input
                type="text"
                value={nomeLoja}
                onChange={(e) => setNomeLoja(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Ex: Vestidos da Ana"
                required={isSignUp}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {/* Mensagem de erro */}
          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? 'Carregando...' 
              : isSignUp 
                ? 'Criar Conta' 
                : 'Entrar'
            }
          </button>
        </form>

        {/* Toggle Login/Cadastro */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignUp ? 'Já tem conta?' : 'Não tem conta?'}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-pink-600 font-medium hover:underline"
          >
            {isSignUp ? 'Fazer Login' : 'Cadastrar'}
          </button>
        </p>

        {/* Link para voltar ao site */}
        <p className="text-center text-sm text-gray-400 mt-4">
          <button
            onClick={() => navigate('/')}
            className="hover:text-gray-600"
          >
            ← Voltar para o site
          </button>
        </p>
      </div>
    </div>
  );
}