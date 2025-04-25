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

  useEffect(() => {
    setIsClient(true);
    
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      if (!isLoading && !user) {
        console.log('No user detected in dashboard layout, redirecting to sign-in');
        // Use window.location for a hard redirect that resets authentication state
        window.location.href = '/sign-in';
      }
    }
  }, [isLoading, user, router]);

  // Show loading state while checking authentication
  if (isLoading || !isClient) {
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
            onClick={() => window.location.href = '/sign-in'} 
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 