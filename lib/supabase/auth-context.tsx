'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { browserSupabase } from './client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing auth state');
    
    const fetchSession = async () => {
      try {
        // Get initial session
        const { data, error } = await browserSupabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error fetching session', error);
        } else {
          console.log('AuthContext: Session fetched successfully', 
            data.session ? 'User is authenticated' : 'No active session');
          
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error('AuthContext: Unexpected error during session fetch', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen for auth changes
    const { data: { subscription } } = browserSupabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthContext: Auth state changed', event, session ? 'User session exists' : 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext: Signing up user', email);
    const { error } = await browserSupabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('AuthContext: Sign up failed', error);
    } else {
      console.log('AuthContext: Sign up successful');
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Signing in user', email);
    const { error } = await browserSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('AuthContext: Sign in failed', error);
    } else {
      console.log('AuthContext: Sign in successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('AuthContext: Signing out user');
    await browserSupabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 