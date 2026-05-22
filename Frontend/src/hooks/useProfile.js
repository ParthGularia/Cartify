// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { fetchProfile, upsertProfile } from '../services/supabaseOrders';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ address: '', contact: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load profile on mount or when user changes
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const data = await fetchProfile(user.id);
        if (data) setProfile({ address: data.address || '', contact: data.contact || '', role: data.role || '' });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const saveProfile = async (updated) => {
    if (!user) return;
    setLoading(true);
      try {
        const data = await upsertProfile(user.id, { ...updated, role: updated.role ?? profile.role });
        if (data) {
          setProfile({ address: data.address || '', contact: data.contact || '', role: data.role || '' });
        } else {
          // No data returned, reset to empty profile
          setProfile({ address: '', contact: '' });
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
  };

  return { profile, setProfile, saveProfile, loading, error };
};
