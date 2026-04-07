// frontend/src/components/site/Footer.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { getAlignClass } from '../../utils/styleHelpers';

export default function Footer({ config, sections, isPreview = false }) {
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

  const handleLogin = () => navigate('/login');
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Buscar seção footer
  const footerSection = sections?.find(s => s.section_type === 'footer');

  // Configurações do footer
  const backgroundColor = footerSection?.styles?.backgroundColor || config?.cor_botao || '#000000';
  const textColor = footerSection?.styles?.textColor || '#ffffff';
  const textFontSize = footerSection?.styles?.textFontSize || 'medio';
  const paddingTop = footerSection?.styles?.paddingTop || 'py-12';
  const paddingBottom = footerSection?.styles?.paddingBottom || 'py-8';

  // Tamanhos de fonte
  const textSizeClasses = {
    pequeno: 'text-sm md:text-base',
    medio: 'text-base md:text-lg',
    grande: 'text-lg md:text-xl'
  };

  // Renderizar botão
  const renderButton = (button, index) => {
    if (!button?.text) return null;
    const isWhatsapp = button.link?.includes('wa.me') || button.link?.includes('whatsapp');
    const bgColor = button.color || (isWhatsapp ? '#25D366' : config?.cor_botao || '#000000');
    
    return (
      <a
        key={index}
        href={button.link || '#'}
        target={button.link?.startsWith('http') ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="inline-block px-6 md:px-8 py-3 md:py-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mt-4 text-sm md:text-base"
        style={{ backgroundColor: bgColor }}
      >
        {button.text}
      </a>
    );
  };

  return (
    <footer
      className={`${paddingTop} ${paddingBottom} px-4 md:px-6 lg:px-8 w-full`}
      style={{ backgroundColor }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Blocos do Footer */}
        {footerSection?.content?.blocks?.length > 0 ? (
          <div className="space-y-6 md:space-y-8">
            {footerSection.content.blocks.map((block, index) => (
              <div key={index} className={getAlignClass(block.align || 'center')}>
                {block.title && (
                  <p
                    className={`${textSizeClasses[textFontSize]} font-semibold mb-3 md:mb-4`}
                    style={{ color: textColor }}
                  >
                    {block.title}
                  </p>
                )}
                {block.text && (
                  <p
                    className={`${textSizeClasses[textFontSize]} opacity-90 mb-3 md:mb-4 max-w-3xl mx-auto`}
                    style={{ color: textColor }}
                  >
                    {block.text}
                  </p>
                )}
                {block.button && renderButton(block.button, index)}
              </div>
            ))}
          </div>
        ) : (
          // Footer padrão (fallback)
          <div className="text-center">
            <p className={`${textSizeClasses[textFontSize]} opacity-90`} style={{ color: textColor }}>
              {config?.footer_texto || '© 2024 Minha Loja de Vestidos'}
            </p>
          </div>
        )}

        {/* Botões de Auth - Apenas no site real */}
        {!isPreview && (
          <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-white/20">
            {user ? (
              <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
                <span className={`${textSizeClasses[textFontSize]} opacity-90`} style={{ color: textColor }}>
                  Olá, {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => navigate('/admin')}
                  className="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition text-sm md:text-base"
                >
                  Painel Admin
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-black transition text-sm md:text-base"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-8 md:px-10 py-4 md:py-5 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg text-base md:text-lg"
              >
                👤 Área do Cliente
              </button>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}