import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Header({ config }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Extrai configurações do header
  const headerConfig = config?.header || {};

  // Lado esquerdo
  const leftType = headerConfig.leftType || 'text';
  const leftText = headerConfig.leftText || '';
  const leftLogo = headerConfig.leftLogo || '';

  // Centro
  const showCenterText = headerConfig.showCenterText !== false;
  const centerText = headerConfig.centerText || '';

  // Fundo
  const bgType = headerConfig.bgType || 'solid';
  const bgColor = headerConfig.bgColor || config?.cor_fundo || '#ffffff';
  const gradientStart = headerConfig.gradientStart || '#667eea';
  const gradientEnd = headerConfig.gradientEnd || '#764ba2';

  // Cores
  const textColor = headerConfig.textColor || config?.cor_texto || '#000000';

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
      <div className="flex items-center min-w-0 flex-1">
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

      {/* 🔹 LADO DIREITO (Espaço vazio para equilibrar) */}
      <div className="flex-1"></div>
    </header>
  );
}