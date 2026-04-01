// frontend/src/components/Header.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ config, sections, isPreview = false }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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

  // ✅ ENCONTRAR A SEÇÃO HEADER nas sections
  const headerSection = sections?.find(s => s.section_type === 'header');
  
  // ✅ MERGE das configurações: header section tem prioridade
  const headerConfig = {
    ...(config?.header || {}),
    ...(headerSection?.styles || {}),
    ...(headerSection?.content || {})
  };

  // Lado esquerdo
  const leftType = headerConfig.leftType || 'text';
  const leftText = headerConfig.leftText || headerConfig.title || '';
  const leftLogo = headerConfig.leftLogo || headerConfig.logo || '';

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
    className={`p-3 sm:p-4 flex items-center shadow-md transition-all duration-300 ${
      isPreview ? 'text-xs' : ''
    }`}
    style={{ ...backgroundStyle, color: textColor }}
  >
    {/* 🔹 LADO ESQUERDO */}
    <div className="flex items-center min-w-0">
      {leftType === 'logo' && leftLogo ? (
        <img
          src={leftLogo}
          alt="Logo"
          className={`w-auto object-contain cursor-pointer ${
            isPreview ? 'h-6 sm:h-8' : 'h-8 sm:h-10'
          }`}
          onClick={() => navigate('/')}
        />
      ) : (
        <h1
          className={`font-bold cursor-pointer truncate ${
            isPreview 
              ? 'text-sm sm:text-base' 
              : 'text-lg sm:text-xl lg:text-2xl'
          }`}
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
        <p className={`font-medium truncate max-w-md ${
          isPreview ? 'text-xs' : 'text-sm sm:text-base'
        }`} style={{ color: textColor }}>
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
          className={`w-auto object-contain cursor-pointer ${
            isPreview ? 'h-6 sm:h-8' : 'h-8 sm:h-10'
          }`}
          onClick={() => navigate('/login')}
        />
      ) : rightType === 'text' ? (
        <span className={`font-medium truncate hidden sm:inline ${
          isPreview ? 'text-xs max-w-24' : 'text-xs sm:text-sm max-w-32'
        }`} style={{ color: textColor }}>
          {rightText}
        </span>
      ) : (
        <>
          {user ? (
            <>
              <span className={`hidden lg:inline truncate ${
                isPreview ? 'text-xs max-w-16' : 'text-xs sm:text-sm max-w-24'
              }`} style={{ color: textColor }}>
                Olá, {user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => navigate('/admin')}
                className={`rounded text-white font-medium transition hover:opacity-90 whitespace-nowrap ${
                  isPreview 
                    ? 'px-2 py-1 text-xs' 
                    : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
                }`}
                style={{ backgroundColor: buttonColor }}
              >
                Painel
              </button>
              <button
                onClick={handleLogout}
                className={`border rounded transition whitespace-nowrap ${
                  isPreview 
                    ? 'px-2 py-1 text-xs' 
                    : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
                } hover:bg-red-50`}
                style={{ borderColor: textColor, color: textColor }}
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className={`border rounded whitespace-nowrap transition hover:opacity-90 ${
                isPreview 
                  ? 'px-2 py-1 text-xs' 
                  : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
              }`}
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