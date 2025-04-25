'use client';

import { useAuth } from '@/lib/supabase/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/app/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Separate useEffect for auth check to avoid race conditions
  useEffect(() => {
    // Only perform checks after loading is complete and we're in the browser
    if (!isLoading && isClient) {
      console.log('Dashboard Layout: Auth check completed', user ? 'User authenticated' : 'No user');
      
      if (!user) {
        console.log('Dashboard Layout: No user found, redirecting to sign-in');
        router.push('/sign-in');
      }
      
      setAuthChecked(true);
    }
  }, [isLoading, user, router, isClient]);

  // Show loading state while checking authentication
  if (isLoading || !isClient || !authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be signed in to access this page</p>
          <button 
            onClick={() => router.push('/sign-in')}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Only render the dashboard when we're sure the user is authenticated
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 