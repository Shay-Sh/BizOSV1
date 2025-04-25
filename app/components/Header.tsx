'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/supabase/auth-context';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">BizOS</span>
            </Link>
            <nav className="ml-6 flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
              >
                Dashboard
              </Link>
              <Link 
                href="/agents" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
              >
                Agents
              </Link>
            </nav>
          </div>
        
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary"
                >
                  Sign Out
                </button>
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
      </div>
    </header>
  );
} 