// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        
        return () => subscription.unsubscribe();
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