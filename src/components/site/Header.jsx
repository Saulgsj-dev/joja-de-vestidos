// frontend/src/components/site/Header.jsx
import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = memo(function Header({ 
  config = {}, 
  sections = [], 
  isPreview = false, 
  storeSlug = null 
}) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Auth State Management
  useEffect(() => {
    let subscription;
    
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        subscription = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        }).data.subscription;
      } catch (error) {
        console.error('Erro ao inicializar auth no header:', error);
      }
    };
    
    initAuth();
    return () => subscription?.unsubscribe();
  }, []);

  // 🔹 Handlers
  const handleLogin = useCallback(() => navigate('/login'), [navigate]);
  
  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [navigate]);

  const navigateHome = useCallback(() => {
    if (storeSlug) {
      navigate(`/${storeSlug}`);
    } else {
      navigate('/');
    }
  }, [navigate, storeSlug]);

  // 🔹 Configuração do Header
  const headerSection = useMemo(
    () => sections?.find(s => s.section_type === 'header'),
    [sections]
  );
  
  const headerConfig = useMemo(() => ({
    ...(config?.header || {}),
    ...(headerSection?.styles || {}),
    ...(headerSection?.content || {})
  }), [config, headerSection]);

  // 🔹 Estilos Dinâmicos
  const leftType = headerConfig.leftType || 'text';
  const leftText = headerConfig.leftText || headerConfig.title || '';
  const leftLogo = headerConfig.leftLogo || headerConfig.logo || '';
  const bgType = headerConfig.bgType || 'solid';
  const bgColor = headerConfig.bgColor || config?.cor_fundo || '#ffffff';
  const gradientStart = headerConfig.gradientStart || '#667eea';
  const gradientEnd = headerConfig.gradientEnd || '#764ba2';
  const textColor = headerConfig.textColor || config?.cor_texto || '#1f2937';
  const buttonColor = headerConfig.buttonColor || config?.cor_botao || '#000000';

  const backgroundStyle = useMemo(() => {
    if (bgType === 'gradient') {
      return { background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})` };
    }
    return { backgroundColor: bgColor };
  }, [bgType, bgColor, gradientStart, gradientEnd]);

  const userDisplayName = user?.email?.split('@')[0] || 'Usuário';
  const isHome = location.pathname === '/' || location.pathname === `/${storeSlug}`;

  // 🔹 Componentes Internos
  const LeftContent = () => {
    const commonProps = {
      onClick: navigateHome,
      className: `cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${
        isPreview ? 'text-xs sm:text-sm' : 'text-lg sm:text-xl lg:text-2xl'
      } font-bold truncate`,
      style: { color: textColor },
      'aria-label': 'Voltar para página inicial'
    };

    if (leftType === 'logo' && leftLogo) {
      return (
        <img
          src={leftLogo}
          alt={config?.nome_loja || 'Logo da loja'}
          className={`w-auto object-contain ${commonProps.className} ${
            isPreview ? 'h-6 sm:h-8' : 'h-8 sm:h-10 lg:h-12'
          }`}
          {...commonProps}
        />
      );
    }

    return (
      <h1 {...commonProps}>
        {leftText || config?.nome_loja || '👗 Minha Loja'}
      </h1>
    );
  };

  const AuthButtons = () => {
    const buttonBase = `rounded font-medium transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap ${
      isPreview ? 'px-2 py-1 text-xs' : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
    }`;

    if (isPreview) {
      return (
        <>
          <span 
            className={`hidden lg:inline truncate opacity-80 ${
              isPreview ? 'text-xs max-w-16' : 'text-xs sm:text-sm max-w-24'
            }`} 
            style={{ color: textColor }}
          >
            Olá, teste
          </span>
          <button
            className={`${buttonBase} text-white`}
            style={{ backgroundColor: buttonColor }}
            disabled
            aria-label="Painel (preview)"
          >
            Painel
          </button>
          <button
            className={`${buttonBase} border hover:bg-red-50`}
            style={{ borderColor: textColor, color: textColor }}
            disabled
            aria-label="Sair (preview)"
          >
            Sair
          </button>
        </>
      );
    }

    if (user) {
      return (
        <>
          <span 
            className={`hidden lg:inline truncate opacity-80 ${
              isPreview ? 'text-xs max-w-16' : 'text-xs sm:text-sm max-w-24'
            }`} 
            style={{ color: textColor }}
            aria-label={`Logado como ${userDisplayName}`}
          >
            Olá, {userDisplayName}
          </span>
          <button
            onClick={() => navigate('/admin')}
            className={`${buttonBase} text-white hover:opacity-90`}
            style={{ backgroundColor: buttonColor }}
            aria-label="Acessar painel administrativo"
          >
            Painel
          </button>
          <button
            onClick={handleLogout}
            className={`${buttonBase} border hover:bg-red-50 transition-colors`}
            style={{ borderColor: textColor, color: textColor }}
            aria-label="Sair da conta"
          >
            Sair
          </button>
        </>
      );
    }

    return (
      <button
        onClick={handleLogin}
        className={`${buttonBase} border transition-colors hover:opacity-90`}
        style={{ borderColor: buttonColor, color: buttonColor }}
        aria-label="Acessar área do cliente"
      >
        Área do Cliente
      </button>
    );
  };

  return (
    <header
      className={`p-3 sm:p-4 flex items-center shadow-md sticky top-0 z-50 transition-all duration-300 ${
        isPreview ? 'text-xs' : ''
      }`}
      style={{ ...backgroundStyle, color: textColor }}
      role="banner"
    >
      {/* Lado Esquerdo - Logo/Título */}
      <div className="flex items-center min-w-0 flex-1 lg:flex-none">
        <LeftContent />
      </div>

      {/* Lado Direito - Auth */}
      <nav className="flex items-center gap-2 sm:gap-3 ml-auto" aria-label="Navegação principal">
        <AuthButtons />
      </nav>
    </header>
  );
});

export default Header;