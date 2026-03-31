import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ config }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ Destructuring correto: { data: { session } }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

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
  
  // Lado esquerdo
  const leftType = headerConfig.leftType || 'text';
  const leftText = headerConfig.leftText || '';
  const leftLogo = headerConfig.leftLogo || '';
  
  // Centro
  const showCenterText = headerConfig.showCenterText !== false;
  const centerText = headerConfig.centerText || '';
  
  // Lado direito
  const rightType = headerConfig.rightType || 'button';
  const rightText = headerConfig.rightText || 'Área do Cliente';
  const rightLogo = headerConfig.rightLogo || '';
  
  // Fundo
  const bgType = headerConfig.bgType || 'solid';
  const bgColor = headerConfig.bgColor || config?.cor_fundo || '#ffffff';
  const gradientStart = headerConfig.gradientStart || '#667eea';
  const gradientEnd = headerConfig.gradientEnd || '#764ba2';
  
  // Cores
  const textColor = headerConfig.textColor || config?.cor_texto || '#000000';
  const buttonColor = headerConfig.buttonColor || config?.cor_botao || '#000000';

  // Calcula estilo de fundo
  const backgroundStyle = {};
  if (bgType === 'gradient') {
    backgroundStyle.background = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
  } else {
    backgroundStyle.backgroundColor = bgColor;
  }

  return (
    <header 
      className="p-3 sm:p-4 flex items-center shadow-md transition-all duration-300"
      style={{ ...backgroundStyle, color: textColor }}
    >
      {/* 🔹 LADO ESQUERDO */}
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
            style={{ color: textColor }}
          >
            {leftText || config?.nome_loja || '👗 Minha Loja'}
          </h1>
        )}
      </div>

      {/* 🔹 CENTRO (oculto no mobile) */}
      {showCenterText && centerText && (
        <div className="hidden md:flex flex-1 justify-center px-4">
          <p className="text-sm sm:text-base font-medium truncate max-w-md" style={{ color: textColor }}>
            {centerText}
          </p>
        </div>
      )}

      {/* 🔹 LADO DIREITO */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {rightType === 'logo' && rightLogo ? (
          <img 
            src={rightLogo} 
            alt="Logo Direita" 
            className="h-8 sm:h-10 w-auto object-contain cursor-pointer"
            onClick={() => navigate('/login')}
          />
        ) : rightType === 'text' ? (
          <span className="text-xs sm:text-sm font-medium truncate max-w-32 hidden sm:inline" style={{ color: textColor }}>
            {rightText}
          </span>
        ) : (
          <>
            {user ? (
              <>
                <span className="text-xs sm:text-sm hidden lg:inline truncate max-w-24" style={{ color: textColor }}>
                  Olá, {user.email?.split('@')[0]}
                </span>
                <button 
                  onClick={() => navigate('/admin')} 
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-white text-xs sm:text-sm font-medium transition hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: buttonColor }}
                >
                  Painel
                </button>
                <button 
                  onClick={handleLogout} 
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded text-xs sm:text-sm hover:bg-red-50 transition whitespace-nowrap"
                  style={{ borderColor: textColor, color: textColor }}
                >
                  Sair
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin} 
                className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded text-xs sm:text-sm whitespace-nowrap transition hover:opacity-90"
                style={{ borderColor: buttonColor, color: buttonColor }}
              >
                {rightText || 'Área do Cliente'}
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}