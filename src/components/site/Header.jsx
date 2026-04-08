// frontend/src/components/site/Header.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ config, sections, isPreview = false, storeSlug = null }) {
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
    navigate('/login');
  };

  const headerSection = sections?.find(s => s.section_type === 'header');
  const headerConfig = {
    ...(config?.header || {}),
    ...(headerSection?.styles || {}),
    ...(headerSection?.content || {})
  };

  const leftType = headerConfig.leftType || 'text';
  const leftText = headerConfig.leftText || headerConfig.title || '';
  const leftLogo = headerConfig.leftLogo || headerConfig.logo || '';
  const centerText = headerConfig.centerText || '';
  const rightType = headerConfig.rightType || 'none';
  const rightButton = headerConfig.rightButton || { text: '', link: '', color: config?.cor_botao || '#000000' };
  
  const bgType = headerConfig.bgType || 'solid';
  const bgColor = headerConfig.bgColor || config?.cor_fundo || '#ffffff';
  const gradientStart = headerConfig.gradientStart || '#667eea';
  const gradientEnd = headerConfig.gradientEnd || '#764ba2';
  const textColor = headerConfig.textColor || config?.cor_texto || '#000000';
  const centerTextColor = headerConfig.centerTextColor || textColor;
  const rightTextColor = headerConfig.rightTextColor || textColor;

  const backgroundStyle = {};
  if (bgType === 'gradient') {
    backgroundStyle.background = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
  } else {
    backgroundStyle.backgroundColor = bgColor;
  }

  const navigateHome = () => {
    if (storeSlug) {
      navigate(`/${storeSlug}`);
    } else {
      navigate('/');
    }
  };

  const handleRightClick = () => {
    if (rightType === 'button' && rightButton.link) {
      if (rightButton.link.startsWith('http')) {
        window.open(rightButton.link, '_blank');
      } else {
        navigate(rightButton.link);
      }
    }
  };

  return (
    <header
      className={`p-3 sm:p-4 flex items-center shadow-md transition-all duration-300 ${
        isPreview ? 'text-xs' : ''
      }`}
      style={{ ...backgroundStyle, color: textColor }}
    >
      {/* Lado Esquerdo */}
      <div className="flex items-center min-w-0 flex-1">
        {leftType === 'logo' && leftLogo ? (
          <img
            src={leftLogo}
            alt="Logo"
            className={`w-auto object-contain cursor-pointer ${
              isPreview ? 'h-6 sm:h-8' : 'h-8 sm:h-10'
            }`}
            onClick={navigateHome}
          />
        ) : (
          <h1
            className={`font-bold cursor-pointer truncate ${
              isPreview ? 'text-sm sm:text-base' : 'text-lg sm:text-xl lg:text-2xl'
            }`}
            onClick={navigateHome}
            style={{ color: textColor }}
          >
            {leftText || config?.nome_loja || '👗 Minha Loja'}
          </h1>
        )}
      </div>

      {/* Centro */}
      {centerText && (
        <div className="hidden md:flex items-center justify-center flex-1">
          <span
            className={`font-medium ${
              isPreview ? 'text-xs' : 'text-sm sm:text-base'
            }`}
            style={{ color: centerTextColor }}
          >
            {centerText}
          </span>
        </div>
      )}

      {/* Lado Direito */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-1 justify-end">
        {rightType === 'text' && rightButton.text ? (
          <span
            className={`font-medium whitespace-nowrap ${
              isPreview ? 'text-xs' : 'text-sm sm:text-base'
            }`}
            style={{ color: rightTextColor }}
          >
            {rightButton.text}
          </span>
        ) : rightType === 'button' && rightButton.text ? (
          <button
            onClick={handleRightClick}
            className={`rounded font-medium transition hover:opacity-90 whitespace-nowrap ${
              isPreview ? 'px-2 py-1 text-xs' : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
            }`}
            style={{ 
              backgroundColor: rightButton.color || config?.cor_botao || '#000000',
              color: '#ffffff'
            }}
          >
            {rightButton.text}
          </button>
        ) : isPreview ? (
          // No preview, mostra botões simulados
          <>
            <span className={`hidden lg:inline truncate ${
              isPreview ? 'text-xs max-w-16' : 'text-xs sm:text-sm max-w-24'
            }`} style={{ color: textColor }}>
              Olá, teste
            </span>
            <button
              className={`rounded text-white font-medium transition hover:opacity-90 whitespace-nowrap ${
                isPreview ? 'px-2 py-1 text-xs' : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
              }`}
              style={{ backgroundColor: config?.cor_botao || '#000000' }}
            >
              Painel
            </button>
            <button
              className={`border rounded transition whitespace-nowrap ${
                isPreview ? 'px-2 py-1 text-xs' : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
              } hover:bg-red-50`}
              style={{ borderColor: textColor, color: textColor }}
            >
              Sair
            </button>
          </>
        ) : user ? (
          // Usuário logado (site real)
          <>
            <span className={`hidden lg:inline truncate ${
              isPreview ? 'text-xs max-w-16' : 'text-xs sm:text-sm max-w-24'
            }`} style={{ color: textColor }}>
              Olá, {user.email?.split('@')[0]}
            </span>
            <button
              onClick={() => navigate('/admin')}
              className={`rounded text-white font-medium transition hover:opacity-90 whitespace-nowrap ${
                isPreview ? 'px-2 py-1 text-xs' : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
              }`}
              style={{ backgroundColor: config?.cor_botao || '#000000' }}
            >
              Painel
            </button>
            <button
              onClick={handleLogout}
              className={`border rounded transition whitespace-nowrap ${
                isPreview ? 'px-2 py-1 text-xs' : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
              } hover:bg-red-50`}
              style={{ borderColor: textColor, color: textColor }}
            >
              Sair
            </button>
          </>
        ) : (
          // Usuário não logado
          <button
            onClick={handleLogin}
            className={`border rounded whitespace-nowrap transition hover:opacity-90 ${
              isPreview ? 'px-2 py-1 text-xs' : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm'
            }`}
            style={{ borderColor: config?.cor_botao || '#000000', color: config?.cor_botao || '#000000' }}
          >
            Área do Cliente
          </button>
        )}
      </div>
    </header>
  );
}