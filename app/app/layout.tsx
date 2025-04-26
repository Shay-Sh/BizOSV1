'use client';

import { useAuth } from '@/lib/supabase/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/DashboardLayout';

export default function AppRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Separate useEffect for auth check to avoid race conditions
  useEffect(() => {
    // Only perform checks after loading is complete and we're in the browser
    if (!isLoading && isClient) {
      console.log('App Layout: Auth check completed', user ? 'User authenticated' : 'No user');
      
      if (!user && !redirectAttempted) {
        console.log('App Layout: No user found, redirecting to sign-in');
        setRedirectAttempted(true);
        window.location.href = '/sign-in';
        return;
      }
      
      setAuthChecked(true);
    }
  }, [isLoading, user, router, isClient, redirectAttempted]);

  // Show loading state while checking authentication
  if (isLoading || !isClient || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-white/80 mb-4">You need to be signed in to access this page</p>
          <button 
            onClick={() => {
              sessionStorage.removeItem('redirectAttempted');
              window.location.href = '/sign-in';
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-md border border-white/20"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Only render the app when we're sure the user is authenticated
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
} 