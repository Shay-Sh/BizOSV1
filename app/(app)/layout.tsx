'use client';

import { useAuth } from '@/lib/supabase/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SideNav from '@/components/ui/SideNav';
import TopNav from '@/components/ui/TopNav';
import { cn } from '@/utils/classnames';
import { 
  Home, 
  BarChart2, 
  Users, 
  GitBranch, 
  MessageSquare, 
  Calendar, 
  Settings 
} from 'lucide-react';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  // User data - in a real app, this would come from authentication
  const userInfo = {
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    avatarUrl: '',
    role: 'User'
  };

  const handleSignOut = () => {
    // In a real app, this would sign the user out
    console.log('Sign out clicked');
  };

  const handleSettings = () => {
    // In a real app, this would navigate to settings
    console.log('Settings clicked');
    router.push('/app/settings');
  };

  // Navigation items - create the objects with the correct Icon components
  const navItems = [
    { href: '/app', label: 'Home', icon: () => <Home className="h-5 w-5" /> },
    { href: '/app/dashboard', label: 'Dashboard', icon: () => <BarChart2 className="h-5 w-5" /> },
    { href: '/app/agents', label: 'Agents', icon: () => <Users className="h-5 w-5" /> },
    { href: '/app/analytics', label: 'Analytics', icon: () => <BarChart2 className="h-5 w-5" /> },
    { href: '/app/workflows', label: 'Workflows', icon: () => <GitBranch className="h-5 w-5" /> },
    { href: '/app/messages', label: 'Messages', icon: () => <MessageSquare className="h-5 w-5" /> },
    { href: '/app/calendar', label: 'Calendar', icon: () => <Calendar className="h-5 w-5" /> },
    { href: '/app/settings', label: 'Settings', icon: () => <Settings className="h-5 w-5" /> }
  ];

  // Only render the app when we're sure the user is authenticated
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SideNav 
        items={navItems}
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        userInfo={userInfo}
        onSignOut={handleSignOut}
        onSettings={handleSettings}
        logoText="BizOS"
      />
      
      <div className={cn(
        "transition-all duration-300 ease-in-out min-h-screen",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <TopNav 
          notificationCount={3}
          userInfo={userInfo}
          onSignOut={handleSignOut}
          onSettings={handleSettings}
        />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 