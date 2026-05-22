import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { fetchProfile } from '../services/supabaseOrders';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // If we have a user, fetch their profile role, fallback to metadata role
      if (session?.user) {
        const metadataRole = session.user.user_metadata?.role;
        fetchProfile(session.user.id)
          .then(p => setRole(p?.role || metadataRole || 'customer'))
          .catch(() => setRole(metadataRole || 'customer'));
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const metadataRole = session.user.user_metadata?.role;
        fetchProfile(session.user.id)
          .then(p => setRole(p?.role || metadataRole || 'customer'))
          .catch(() => setRole(metadataRole || 'customer'));
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, role }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
