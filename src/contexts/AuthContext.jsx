import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  const checkAdmin = async (userId) => {
    try {
      const { data } = await supabase.from('admin_users').select('role').eq('user_id', userId).maybeSingle();
      return !!data;
    } catch { return false; }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        setLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    initAuth();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    if (user?.id) {
      const loadProfile = async () => {
        try {
          const [userProfile, adminStatus] = await Promise.all([
            fetchProfile(user.id),
            checkAdmin(user.id)
          ]);
          if (isMounted) {
            setProfile(userProfile);
            setIsAdmin(adminStatus);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      
      loadProfile();
    }
    
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const signUp = async (data) => {
    return supabase.auth.signUp(data);
  };

  const signIn = async (data) => {
    return supabase.auth.signInWithPassword(data);
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://ala-mg.com/onboarding'
      }
    });
  };

  const signOut = async () => {
    setProfile(null);
    return supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id);
      setProfile(userProfile);
    }
  };

  const value = {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile,
    user,
    session,
    profile,
    loading,
    isAdmin,
    isOnboarded: !!profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
