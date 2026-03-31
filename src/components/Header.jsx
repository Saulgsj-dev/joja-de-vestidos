// frontend/src/components/Header.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ config, onColorChange }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ CORRETO: { data: { session } }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // ✅ CORRETO: { data: { subscription } }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    // Redireciona para a página de login
    navigate('/login');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isPublicSite = location.pathname === '/';

  return (
    <header 
      className="p-4 flex justify-between items-center shadow-md transition-colors duration-300"
      style={{ 
        backgroundColor: isPublicSite ? (config?.cor_fundo || '#ffffff') : '#f8f9fa',
        color: isPublicSite ? (config?.cor_texto || '#000000') : '#000000'
      }}
    >
      <h1 
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate('/')}
      >
        {config?.nome_loja || '👗 Minha Loja de Vestidos'}
      </h1>
      
      {/* Login no Canto Superior Direito */}
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-sm hidden md:inline">Olá, {user.email?.split('@')[0]}</span>
            <button 
              onClick={() => navigate('/admin')} 
              className="px-4 py-2 rounded text-white font-medium transition hover:opacity-90"
              style={{ backgroundColor: config?.cor_botao || '#000000' }}
            >
              Painel
            </button>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 border rounded hover:bg-red-50 hover:text-red-600 transition"
            >
              Sair
            </button>
          </>
        ) : (
          <button 
            onClick={handleLogin} 
            className="px-4 py-2 border rounded hover:bg-gray-100 transition text-sm"
          >
            Área do Cliente
          </button>
        )}
      </div>
    </header>
  );
}