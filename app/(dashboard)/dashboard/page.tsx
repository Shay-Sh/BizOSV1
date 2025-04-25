import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardClient from './dashboard-client';
import { createServerClient } from '@/lib/supabase/client';

export const metadata: Metadata = {
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

export default async function DashboardPage() {
  // Server-side auth check
  try {
    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // We'll let the client-side handle redirects if not authenticated
    // This helps prevent redirect loops between server and client
    
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DashboardClient user={session?.user || null} />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Dashboard page error:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-5">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading dashboard</h2>
        <p className="text-gray-600 mb-6">There was a problem loading your dashboard. Please try again.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }
} 