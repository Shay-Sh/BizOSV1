'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/classnames';
import SideNav, { NavItem } from '@/components/ui/SideNav';
import TopNav from '@/components/ui/TopNav';
import { useAuth } from '@/lib/supabase/auth-context';

// Import icons
import {
  MdDashboard,
  MdPeople,
  MdSettings,
  MdInsights,
  MdGridView,
  MdMessage,
  MdCalendarToday
} from 'react-icons/md';

// Define navigation items for sidebar
const navigationItems: NavItem[] = [
  {
    href: '/app',
    label: 'Home',
    icon: MdDashboard
  },
  {
    href: '/app/agents',
    label: 'Agents',
    icon: MdPeople,
    badge: 'New'
  },
  {
    href: '/app/workflows',
    label: 'Workflows',
    icon: MdGridView
  },
  {
    href: '/app/analytics',
    label: 'Analytics',
    icon: MdInsights
  },
  {
    href: '/app/messages',
    label: 'Messages',
    icon: MdMessage,
    badge: 3
  },
  {
    href: '/app/calendar',
    label: 'Calendar',
    icon: MdCalendarToday
  },
  {
    href: '/app/settings',
    label: 'Settings',
    icon: MdSettings
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
  const { user } = useAuth();
  
  // State for sidebar collapsed status
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Handle profile click
  const handleProfileClick = () => {
    console.log('Profile clicked');
  };
  
  // Handle notifications click
  const handleNotificationsClick = () => {
    console.log('Notifications clicked');
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
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onProfileClick={handleProfileClick}
        onNotificationsClick={handleNotificationsClick}
        userInfo={userInfo}
        unreadNotificationsCount={2}
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