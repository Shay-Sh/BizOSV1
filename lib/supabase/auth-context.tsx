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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log('AuthContext: Initializing auth state, environment:', 
      typeof window !== 'undefined' ? window.location.hostname : 'server');
    
    const fetchSession = async () => {
      try {
        // Get initial session
        const { data, error } = await browserSupabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error fetching session', error);
        } else {
          console.log('AuthContext: Session fetched successfully', 
            data.session ? `User is authenticated: ${data.session.user.email}` : 'No active session');
          
          if (data.session) {
            console.log('AuthContext: User ID from session:', data.session.user.id);
          }
          
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error('AuthContext: Unexpected error during session fetch', err);
        
        // Retry logic for production environment
        if (retryCount < 3) {
          console.log(`AuthContext: Retrying session fetch (attempt ${retryCount + 1}/3)...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen for auth changes
    const { data: { subscription } } = browserSupabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthContext: Auth state changed', event, 
          session ? `User session exists: ${session.user.email}` : 'No session');
        
        if (session) {
          console.log('AuthContext: User ID from auth state change:', session.user.id);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [retryCount]);

  // Force refresh the session if needed
  useEffect(() => {
    const refreshSession = async () => {
      if (session) {
        try {
          const { error } = await browserSupabase.auth.refreshSession();
          if (error) {
            console.error('AuthContext: Failed to refresh session', error);
          } else {
            console.log('AuthContext: Session refreshed successfully');
          }
        } catch (err) {
          console.error('AuthContext: Unexpected error during session refresh', err);
        }
      }
    };

    // Set up periodic session refresh (every 10 minutes)
    const refreshInterval = setInterval(refreshSession, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [session]);

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext: Signing up user', email);
    const { data, error } = await browserSupabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('AuthContext: Sign up failed', error);
    } else {
      console.log('AuthContext: Sign up successful', data);
      // Immediately set user and session to avoid waiting for the auth state change
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
      }
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Signing in user', email);
    const { data, error } = await browserSupabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('AuthContext: Sign in failed', error);
    } else {
      console.log('AuthContext: Sign in successful', data.user?.id);
      // Immediately set user and session to avoid waiting for the auth state change
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('AuthContext: Signing out user');
    await browserSupabase.auth.signOut();
    // Clear user and session immediately
    setUser(null);
    setSession(null);
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