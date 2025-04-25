import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './supabaseClient';

/**
 * Auth Context
 * Provides authentication state and methods to components
 */
export const AuthContext = createContext();

/**
 * Auth Provider Component
 * Wraps application to provide auth context
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from session
  useEffect(() => {
    // Get current session
    const initializeAuth = async () => {
      setLoading(true);
      
      // Check for existing session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
      }
      
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      
      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
            
            // Redirect to login page if not on public route
            const publicRoutes = ['/login', '/signup', '/'];
            if (!publicRoutes.includes(router.pathname)) {
              router.push('/login');
            }
          }
        }
      );
      
      setLoading(false);
      
      // Cleanup subscription
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, [router]);

  /**
   * Sign in with email and password
   */
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });
      
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Higher-order component for protected routes
 */
export function withAuth(Component) {
  const ProtectedRoute = (props) => {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Check auth after loading
      if (!loading && !isAuthenticated) {
        router.push('/login');
      }
    }, [loading, isAuthenticated, router]);

    // Show loading state
    if (loading) {
      return (
        <div className="min-h-screen glass-bg-gradient flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg text-white text-center">
            <svg className="animate-spin h-10 w-10 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading...</p>
          </div>
        </div>
      );
    }

    // Render component if authenticated
    if (isAuthenticated) {
      return <Component {...props} user={user} />;
    }

    // Return null otherwise (will redirect)
    return null;
  };

  return ProtectedRoute;
}

/**
 * Helper to check if a route is protected
 */
export function isProtectedRoute(pathname) {
  const publicRoutes = ['/login', '/signup', '/'];
  return !publicRoutes.includes(pathname);
} 