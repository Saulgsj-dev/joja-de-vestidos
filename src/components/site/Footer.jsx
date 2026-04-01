// frontend/src/components/site/Footer.jsx
import React, { memo, useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Footer = memo(function Footer({ config = {}, isPreview = false }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
        console.error('Erro ao inicializar auth no footer:', error);
      }
    };
    
    initAuth();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = () => navigate('/login');
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const footerBgColor = useMemo(() => config.cor_botao || '#1f2937', [config.cor_botao]);
  const footerTextColor = '#ffffff';
  const userDisplayName = user?.email?.split('@')[0] || 'Usuário';

  return (
    <footer
      className="p-4 sm:p-6 text-center mt-12 transition-colors duration-300"
      style={{ backgroundColor: footerBgColor, color: footerTextColor }}
      role="contentinfo"
    >
      {/* Botões de Auth - Apenas no site real */}
      {!isPreview && (
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {user ? (
            <>
              <span className="text-sm opacity-90" aria-label={`Logado como ${userDisplayName}`}>
                Olá, {userDisplayName}
              </span>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => navigate('/admin')}
                  className="px-5 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-label="Acessar painel administrativo"
                >
                  Painel Admin
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-gray-900 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-label="Sair da conta"
                >
                  Sair
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="px-7 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label="Acessar área do cliente"
            >
              👤 Área do Cliente
            </button>
          )}
        </div>
      )}

      {/* Texto do Footer */}
      <p className="text-sm sm:text-base opacity-90">
        {config.footer_texto || `© ${new Date().getFullYear()} Minha Loja de Vestidos`}
      </p>
      
      {/* Links úteis (opcional) */}
      {config.footer_links?.length > 0 && (
        <nav className="mt-3 flex flex-wrap justify-center gap-4 text-sm opacity-80" aria-label="Links do rodapé">
          {config.footer_links.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              className="hover:opacity-100 transition-opacity hover:underline"
              target={link.openInNewTab ? "_blank" : "_self"}
              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </footer>
  );
});

export default Footer;