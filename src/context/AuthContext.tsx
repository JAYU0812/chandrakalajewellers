import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ENV } from '../lib/env';

export type UserRole = 'super_admin' | 'catalog_manager' | 'store_manager';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isMockUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockUser, setIsMockUser] = useState(false);

  // Check if credentials are placeholder defaults
  const isPlaceholderConfig = 
    ENV.VITE_SUPABASE_URL.includes('placeholder-project') || 
    ENV.VITE_SUPABASE_ANON_KEY.includes('placeholder-anon-key');

  useEffect(() => {
    if (isPlaceholderConfig) {
      // Mock Auth initialization for local development out-of-the-box
      const savedSession = localStorage.getItem('aurum_mock_session') || sessionStorage.getItem('aurum_mock_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          setUser(parsed.user);
          setSession(parsed.session);
          setRole(parsed.role);
          setIsMockUser(true);
        } catch (e) {
          console.error("Failed to parse mock session:", e);
        }
      }
      setLoading(false);
      return;
    }

    // Standard Supabase Auth initialization
    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchUserRole(initialSession.user.id);
        }
      } catch (err: any) {
        console.error("Supabase session initialization failed:", err);
        setError(err.message || "Failed to initialize session");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserRole(currentSession.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isPlaceholderConfig]);

  // Query database admin_roles table
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error: roleError } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleError) throw roleError;
      if (data) {
        setRole(data.role as UserRole);
      }
    } catch (err) {
      console.warn("Could not fetch database role, user lacks admin profile mappings:", err);
      setRole(null);
    }
  };

  const login = async (email: string, password: string, remember: boolean): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setLoading(true);

    // Mock Login Trigger
    if (isPlaceholderConfig || email === 'admin@chandrakalajewellers.com') {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (email === 'admin@chandrakalajewellers.com' && password === 'Password123') {
            const mockUser = {
              id: 'mock-uuid-super-admin-0000-1111',
              email: 'admin@chandrakalajewellers.com',
              user_metadata: { name: 'Super Admin Concierge' },
              aud: 'authenticated',
              role: 'authenticated',
              created_at: new Date().toISOString(),
            } as unknown as User;

            const mockSession = {
              access_token: 'mock-jwt-token-aurum-session',
              token_type: 'bearer',
              expires_in: 3600,
              user: mockUser,
            } as unknown as Session;

            const mockRole = 'super_admin' as UserRole;

            setUser(mockUser);
            setSession(mockSession);
            setRole(mockRole);
            setIsMockUser(true);
            
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem('aurum_mock_session', JSON.stringify({ user: mockUser, session: mockSession, role: mockRole }));
            
            setLoading(false);
            resolve({ success: true });
          } else {
            setLoading(false);
            resolve({ success: false, error: "Invalid credentials. Use admin@chandrakalajewellers.com / Password123 for local review." });
          }
        }, 1000);
      });
    }

    // Standard Supabase login
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      if (data.user) {
        await fetchUserRole(data.user.id);
      }
      return { success: true };
    } catch (err: any) {
      const errMsg = err.message || "Invalid credentials";
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    setLoading(true);
    if (isMockUser) {
      setUser(null);
      setSession(null);
      setRole(null);
      setIsMockUser(false);
      localStorage.removeItem('aurum_mock_session');
      sessionStorage.removeItem('aurum_mock_session');
      setLoading(false);
      return;
    }

    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
    } catch (err: any) {
      console.error("Signout operation encountered errors:", err);
    } finally {
      setUser(null);
      setSession(null);
      setRole(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, error, login, logout, isMockUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider context wrapper.');
  }
  return context;
};
