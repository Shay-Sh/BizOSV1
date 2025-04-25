'use client';

import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from '@/lib/supabase/auth-context';
import { browserSupabase } from '@/lib/supabase/client';

// Empty props interface since we'll use the auth context directly
interface DashboardClientProps {}

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
function DashboardContent() {
  const { user, isLoading, session } = useAuth();
  const [contentLoading, setContentLoading] = useState(true);
  const [renderAttempt, setRenderAttempt] = useState(0);
  const [directUser, setDirectUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get user directly from Supabase as a fallback
  useEffect(() => {
    const getDirectUser = async () => {
      try {
        const { data, error } = await browserSupabase.auth.getUser();
        if (error) {
          console.error('DashboardClient: Error fetching user directly:', error);
          setError(`Auth error: ${error.message}`);
        } else if (data.user) {
          console.log('DashboardClient: Got user directly from Supabase:', data.user.email);
          setDirectUser(data.user);
        }
      } catch (err) {
        console.error('DashboardClient: Unexpected error fetching user:', err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    if (!user && !isLoading) {
      console.log('DashboardClient: No user in context, trying direct approach');
      getDirectUser();
    }
  }, [user, isLoading]);

  // Determine which user object to use
  const displayUser = user || directUser;

  // Log the user data to help debug
  useEffect(() => {
    console.log('DashboardContent: Auth context user data:', 
      user ? `User found: ${user.email} (ID: ${user.id})` : 'No user in auth context');
    
    if (session) {
      console.log('DashboardContent: Session exists, expires at:', new Date(session.expires_at! * 1000).toISOString());
    } else {
      console.log('DashboardContent: No session available');
    }

    if (directUser) {
      console.log('DashboardContent: Direct user found:', directUser.email);
    }

    // Log environment info
    console.log('DashboardContent: Running in environment:', 
      typeof window !== 'undefined' ? window.location.hostname : 'server');
  }, [user, session, directUser]);

  useEffect(() => {
    // Only start loading content after we have confirmed auth
    if (!isLoading) {
      console.log('DashboardClient: Component mounted, loading content...');
      console.log('DashboardClient: User state:', displayUser ? `Found: ${displayUser.email}` : 'Not found');
      
      // Simulate data loading
      const timer = setTimeout(() => {
        setContentLoading(false);
        console.log('DashboardClient: Finished loading content');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, displayUser]);

  // Force re-render if needed
  useEffect(() => {
    if (!contentLoading && renderAttempt < 1) {
      // Try one more render attempt after a short delay
      const timer = setTimeout(() => {
        console.log('DashboardClient: Attempting re-render');
        setRenderAttempt(renderAttempt + 1);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [contentLoading, renderAttempt]);

  // Show any errors
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.href = '/sign-in'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-4"
        >
          Sign In Again
        </button>
      </div>
    );
  }

  // Auth is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Content is still loading
  if (contentLoading) {
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
  if (!displayUser || !displayUser.email) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">User data not available</h1>
        <p className="text-gray-600 mb-4">There was a problem loading your profile data.</p>
        <p className="text-gray-500 mb-6">This could be due to an authentication issue.</p>
        <button 
          onClick={() => window.location.href = '/sign-in'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-4"
        >
          Sign In Again
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard, {displayUser.email?.split('@')[0]}</h1>
      
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
              <span className="font-medium">{displayUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User ID:</span>
              <span className="font-medium text-xs overflow-ellipsis overflow-hidden">{displayUser.id}</span>
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
export default function DashboardClient() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <DashboardContent />
    </ErrorBoundary>
  );
} 