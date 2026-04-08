import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient';

export function useAuth() {
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
            setLoading(false);
          }
        });
        
        // ✅ Acesso seguro à subscription (compatível com todas as versões do Supabase)
        authSubscription = 
          authResponse?.data?.subscription || 
          authResponse?.subscription || 
          null;
          
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // ✅ Cleanup com verificação EXTRA de segurança
    return () => {
      isMounted = false;
      // ✅ Só chama unsubscribe se:
      // 1. subscription existir
      // 2. for um objeto
      // 3. tiver método unsubscribe que é uma função
      if (
        authSubscription && 
        typeof authSubscription === 'object' && 
        typeof authSubscription.unsubscribe === 'function'
      ) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      const supabase = await getSupabase();
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, loading, signOut };
}