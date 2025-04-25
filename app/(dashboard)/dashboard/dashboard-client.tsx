'use client';

import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardClientProps {
  user: User | null;
}

// Error fallback component for client-side errors
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

// The main dashboard content component
function DashboardContent({ user }: { user: User | null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [renderAttempt, setRenderAttempt] = useState(0);

  useEffect(() => {
    console.log('DashboardClient: Component mounted, user:', user?.email);
    
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('DashboardClient: Finished loading');
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  // Force re-render if needed
  useEffect(() => {
    if (!isLoading && renderAttempt < 1) {
      // Try one more render attempt after a short delay
      const timer = setTimeout(() => {
        console.log('DashboardClient: Attempting re-render');
        setRenderAttempt(renderAttempt + 1);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, renderAttempt]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Make sure we have a user before rendering
  if (!user || !user.email) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">User data not available</h1>
        <p className="text-gray-600 mb-4">There was a problem loading your profile data.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard, {user.email?.split('@')[0]}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Create New Project
            </button>
            <button className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
              View Analytics
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <p className="text-gray-600">No recent activity to display</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type:</span>
              <span className="font-medium">Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the dashboard content with error boundary
export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DashboardContent user={user} />
    </ErrorBoundary>
  );
} 