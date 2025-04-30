'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getBrowserSupabase, browserSupabase } from './client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Supabase client
    const supabase = getBrowserSupabase();
    
    if (!supabase) {
      console.error('AuthContext: Unable to initialize Supabase client');
      setIsLoading(false);
      return;
    }

    // Get initial session
    const initUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error('AuthContext: Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log('AuthContext: Auth state changed', event, 
          session ? `User session exists: ${session.user.email}` : 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('AuthContext: Error during sign up:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error('AuthContext: Error during sign in:', error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      return { error };
    } catch (error) {
      console.error('AuthContext: Error during Google sign in:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const supabase = getBrowserSupabase();
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client');
      }
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error('AuthContext: Error during sign out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 