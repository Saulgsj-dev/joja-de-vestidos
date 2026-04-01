import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Footer({ config, isPreview = false }) {
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

  const footerBgColor = config?.cor_botao || '#000000';
  const footerTextColor = '#ffffff';

  return (
    <footer
      className="p-4 sm:p-6 text-center mt-12"
      style={{ backgroundColor: footerBgColor, color: footerTextColor }}
    >
      {/* Botões de Auth - Apenas no site real, não no preview */}
      {!isPreview && (
        <div className="mb-4">
          {user ? (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-sm">Olá, {user.email?.split('@')[0]}</span>
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Painel Admin
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-black transition"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="px-8 py-3 bg-white text-black rounded-lg font-semibold text-base hover:bg-gray-100 transition shadow-lg"
            >
              👤 Área do Cliente
            </button>
          )}
        </div>
      )}

      {/* Texto do Footer */}
      <p className="text-sm sm:text-base opacity-90">
        {config?.footer_texto || '© 2024 Minha Loja de Vestidos'}
      </p>
    </footer>
  );
}