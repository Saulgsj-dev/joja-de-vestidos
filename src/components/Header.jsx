import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ config, onColorChange }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ CORREÇÃO: Destructuring correto - { data: { session } }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // ✅ CORREÇÃO: Destructuring correto - { data: { subscription } }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => navigate('/login');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isPublicSite = location.pathname === '/';

  // Extrai configurações do header
  const headerConfig = config?.header || {};
  const showCenterText = headerConfig.showCenterText !== false; // padrão: true
  const leftType = headerConfig.leftType || 'text'; // 'text' ou 'logo'
  const leftText = headerConfig.leftText || '';
  const leftLogo = headerConfig.leftLogo || '';
  const centerText = headerConfig.centerText || '';

  return (
    <header 
      className="p-3 sm:p-4 flex items-center shadow-md transition-colors duration-300"
      style={{ 
        backgroundColor: isPublicSite ? (config?.cor_fundo || '#ffffff') : '#f8f9fa',
        color: isPublicSite ? (config?.cor_texto || '#000000') : '#000000'
      }}
    >
      {/* 🔹 LADO ESQUERDO: Logo ou Texto */}
      <div className="flex items-center min-w-0">
        {leftType === 'logo' && leftLogo ? (
          <img 
            src={leftLogo} 
            alt="Logo" 
            className="h-8 sm:h-10 w-auto object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        ) : (
          <h1 
            className="text-lg sm:text-xl lg:text-2xl font-bold cursor-pointer truncate"
            onClick={() => navigate('/')}
          >
            {leftText || config?.nome_loja || '👗 Minha Loja'}
          </h1>
        )}
      </div>

      {/* 🔹 CENTRO: Texto opcional (oculto no mobile) */}
      {showCenterText && centerText && (
        <div className="hidden md:flex flex-1 justify-center px-4">
          <p className="text-sm sm:text-base font-medium truncate max-w-md">
            {centerText}
          </p>
        </div>
      )}

      {/* 🔹 LADO DIREITO: Botões de usuário */}
      <div className="flex gap-2 sm:gap-3 items-center ml-auto">
        {user ? (
          <>
            <span className="text-xs sm:text-sm hidden lg:inline truncate max-w-24">
              Olá, {user.email?.split('@')[0]}
            </span>
            <button 
              onClick={() => navigate('/admin')} 
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-white text-xs sm:text-sm font-medium transition hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: config?.cor_botao || '#000000' }}
            >
              Painel
            </button>
            <button 
              onClick={handleLogout} 
              className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded text-xs sm:text-sm hover:bg-red-50 hover:text-red-600 transition whitespace-nowrap"
            >
              Sair
            </button>
          </>
        ) : (
          <button 
            onClick={handleLogin} 
            className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded hover:bg-gray-100 transition text-xs sm:text-sm whitespace-nowrap"
          >
            Área do Cliente
          </button>
        )}
      </div>
    </header>
  );
}