'use client';

import { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from '@/lib/supabase/auth-context';
import DashboardClient from './dashboard-client';

export const metadata = {
  title: 'Dashboard | BizOS',
  description: 'Manage your business efficiently with BizOS dashboard',
};

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong:</h2>
      <pre className="text-sm bg-gray-100 p-4 rounded-md overflow-auto max-w-full">{error.message}</pre>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DashboardClient user={user} />
    </ErrorBoundary>
  );
} 