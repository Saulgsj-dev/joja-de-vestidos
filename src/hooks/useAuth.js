// frontend/src/hooks/useAuth.js
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
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (isMounted) {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        });
        
        authSubscription = subscription;
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // ✅ Cleanup com verificação de segurança (optional chaining)
    return () => {
      isMounted = false;
      authSubscription?.unsubscribe?.();
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