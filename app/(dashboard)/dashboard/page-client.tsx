'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';

export default function DashboardClientPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
      // Redirect if not signed in
      if (!isSignedIn) {
        router.push('/sign-in');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking authentication
  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If user isn't loaded yet or not signed in (fallback in case redirect hasn't happened)
  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName || 'User'}!</h1>
          <p className="mt-2 text-gray-600">Here's what's happening with your AI agents today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-lg shadow-md row-span-1">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                Create New Agent
              </button>
              <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition">
                Browse Marketplace
              </button>
              <button className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition">
                Manage Credentials
              </button>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Active Agents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Total Executions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Workflows</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-gray-600">Pending Approvals</p>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 italic text-center py-4">
                No recent activity to display.
              </p>
            </div>
          </div>
          
          {/* Getting Started Card */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-full mt-4">
            <div className="flex items-start">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Get Started with BizOS</h2>
                <p className="text-gray-600 mb-4">
                  Complete these steps to fully configure your AI agents and workflows.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-primary flex items-center justify-center mr-3 text-sm">1</span>
                    <span className="text-gray-700">Create your first AI agent</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-primary flex items-center justify-center mr-3 text-sm">2</span>
                    <span className="text-gray-700">Set up integrations and credentials</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-primary flex items-center justify-center mr-3 text-sm">3</span>
                    <span className="text-gray-700">Design your first workflow</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-primary flex items-center justify-center mr-3 text-sm">4</span>
                    <span className="text-gray-700">Run and monitor your workflow</span>
                  </li>
                </ul>
              </div>
              <div>
                <button className="bg-primary text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                  Start Tutorial
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
} 