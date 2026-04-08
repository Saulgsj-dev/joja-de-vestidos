// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSupabase } from './lib/supabaseClient'; // ✅ Usar getSupabase para lazy loading
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let authSubscription = null;

    const initAuth = async () => {
      try {
        const supabase = await getSupabase();
        
        // Get initial session
        const sessionResponse = await supabase.auth.getSession();
        if (isMounted) {
          setUser(sessionResponse?.data?.session?.user ?? null);
          setLoading(false);
        }

        // Subscribe to auth changes - SEM desestruturação perigosa
        const authResponse = supabase.auth.onAuthStateChange((_event, session) => {
          if (isMounted) {
            setUser(session?.user ?? null);
          }
        });
        
        // ✅ Acesso seguro à subscription
        authSubscription = 
          authResponse?.data?.subscription || 
          authResponse?.subscription || 
          null;
      } catch (error) {
        console.error('ProtectedRoute auth error:', error);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // ✅ Cleanup com verificação EXTRA de segurança
    return () => {
      isMounted = false;
      if (
        authSubscription && 
        typeof authSubscription === 'object' && 
        typeof authSubscription.unsubscribe === 'function'
      ) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Rota pública com SLUG da loja */}
        <Route path="/:storeId" element={<Home />} />
        
        {/* ✅ Rota raiz (pode redirecionar ou mostrar landing) */}
        <Route path="/" element={<Home />} />
        
        {/* ✅ Login (SEM cadastro) */}
        <Route path="/login" element={<Login />} />
        
        {/* ✅ Admin (Protegido) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;