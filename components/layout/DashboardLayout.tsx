'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/classnames';
import SideNav, { NavItem } from '@/components/ui/SideNav';
import TopNav from '@/components/ui/TopNav';
import { useAuth } from '@/lib/supabase/auth-context';
import { useRouter } from 'next/navigation';

// Import icons
import {
  MdDashboard,
  MdPeople,
  MdSettings,
  MdInsights,
  MdGridView,
  MdMessage,
  MdCalendarToday,
  MdApproval,
  MdFolderShared,
  MdChat,
  MdWorkspaces
} from 'react-icons/md';

// Helper function to transform react-icons to match the expected IconType
const iconComponent = (Icon: React.ComponentType<any>) => (
  <Icon className="h-5 w-5" />
);

// Define navigation items for sidebar
const navigationItems: NavItem[] = [
  {
    href: '/app',
    label: 'Home',
    icon: () => iconComponent(MdDashboard)
  },
  {
    href: '/app/dashboard',
    label: 'Dashboard',
    icon: () => iconComponent(MdInsights)
  },
  {
    href: '/app/agents',
    label: 'Agents',
    icon: () => iconComponent(MdPeople)
  },
  {
    href: '/app/analytics',
    label: 'Analytics',
    icon: () => iconComponent(MdInsights)
  },
  {
    href: '/app/workflows',
    label: 'Workflows',
    icon: () => iconComponent(MdGridView)
  },
  {
    href: '/app/messages',
    label: 'Messages',
    icon: () => iconComponent(MdMessage)
  },
  {
    href: '/app/calendar',
    label: 'Calendar',
    icon: () => iconComponent(MdCalendarToday)
  },
  {
    href: '/app/settings',
    label: 'Settings',
    icon: () => iconComponent(MdSettings)
  }
];

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

/**
 * AppLayout component - Provides a complete layout for app pages
 * with sidebar navigation, top bar, and main content area using glassmorphism styling
 */
const AppLayout = ({
  children,
  pageTitle = 'App'
}: AppLayoutProps) => {
  // Get user data from auth context
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // State for sidebar collapsed status
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Sample credit balance - in a real app, you would fetch this from your backend
  const [creditBalance, setCreditBalance] = useState(750);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Handle profile click
  const handleProfileClick = () => {
    router.push('/app/settings/profile');
  };
  
  // Handle notifications click
  const handleNotificationsClick = () => {
    // Navigate to notifications page or open notifications panel
    console.log('Notifications clicked');
  };
  
  // Handle credit click
  const handleCreditClick = () => {
    router.push('/app/settings/credits');
  };
  
  // Handle sign out click
  const handleSignOut = async () => {
    await signOut();
    // Redirect to sign in page will be handled by the auth context
  };
  
  // User info from auth
  const userInfo = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    role: 'User'
  } : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800">
      {/* Side Navigation */}
      <SideNav
        items={navigationItems}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        userInfo={userInfo}
      />
      
      {/* Top Bar */}
      <TopNav
        onSearch={(query) => console.log('Search:', query)}
        notificationCount={2}
        userInfo={userInfo}
        onSettings={handleProfileClick}
        onSignOut={handleSignOut}
      />
      
      {/* Main Content */}
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300 ease-in-out",
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout; 