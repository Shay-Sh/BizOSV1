'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

interface HeaderProps {
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const { user, isSignedIn } = useUser();
  
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-primary">BizOS</span>
          </Link>
          
          {isSignedIn && (
            <nav className="ml-10 flex space-x-4">
              <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-primary">
                Dashboard
              </Link>
              <Link href="/dashboard/agents" className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-primary">
                Agents
              </Link>
              <Link href="/dashboard/workflows" className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-primary">
                Workflows
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center">
          {isSignedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : showAuth ? (
            <div className="flex items-center">
              <Link 
                href="/sign-in" 
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
} 