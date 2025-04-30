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
  const { user, signIn, signInWithGoogle } = useAuth();

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

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      console.log('SignInForm: Attempting to sign in with Google');
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('SignInForm: Google sign-in failed with error', error.message);
        setError(error.message);
        setIsLoading(false);
      }
      // No need to set success state as we're redirecting to Google auth      
    } catch (err) {
      console.error('SignInForm: Unexpected error during Google sign-in', err);
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
      
      <div className="my-4 flex items-center justify-between">
        <hr className="w-full border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">OR</span>
        <hr className="w-full border-gray-300" />
      </div>
      
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading || signInSuccess}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
        Sign in with Google
      </button>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
          Sign up
        </Link>
      </div>
    </div>
  );
} 