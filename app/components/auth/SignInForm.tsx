'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/auth-context';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, signIn } = useAuth();

  // Automatically redirect if user is already logged in
  // But only do this once to prevent loops
  useEffect(() => {
    // Prevent redirect loop by tracking if we've already tried to redirect
    const hasAttemptedRedirect = sessionStorage.getItem('redirectAttempted');
    
    if (user && !hasAttemptedRedirect && pathname === '/sign-in') {
      console.log('SignInForm: User already authenticated, redirecting to dashboard once');
      sessionStorage.setItem('redirectAttempted', 'true');
      window.location.href = '/dashboard';
    }
    
    // Clean up redirect flag when component unmounts
    return () => {
      // Only clean up if we're not on the sign-in page anymore
      if (pathname !== '/sign-in') {
        sessionStorage.removeItem('redirectAttempted');
      }
    };
  }, [user, router, pathname]);

  // Handle successful sign-in with a delay to ensure auth context updates
  useEffect(() => {
    if (signInSuccess) {
      console.log('SignInForm: Navigating to dashboard after successful sign-in');
      // Use direct window.location change to ensure a full page reload
      window.location.href = '/dashboard';
    }
  }, [signInSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('SignInForm: Attempting to sign in user', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('SignInForm: Sign-in failed with error', error.message);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Successful sign-in
      console.log('SignInForm: Sign-in successful, preparing to redirect');
      setSignInSuccess(true);
      
    } catch (err) {
      console.error('SignInForm: Unexpected error during sign-in', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In to BizOS</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || signInSuccess}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : signInSuccess ? 'Redirecting...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
          Sign up
        </Link>
      </div>
    </div>
  );
} 