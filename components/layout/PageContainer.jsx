import React, { useState } from 'react';
import SideNav from './SideNav';
import TopBar from './TopBar';

/**
 * Dashboard navigation items
 * Each item should have a unique id, label, icon, and href
 */
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
    href: '/dashboard',
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    ),
    href: '/dashboard/agents',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
      </svg>
    ),
    href: '/dashboard/workflows',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    href: '/dashboard/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
    href: '/dashboard/settings',
  },
];

/**
 * Mock user data
 * This would come from your authentication/user context in a real app
 */
const mockUser = {
  name: 'Demo User',
  role: 'Admin',
  email: 'demo@example.com',
};

/**
 * PageContainer Component
 * 
 * A layout component for dashboard pages that includes a frosted glass
 * sidebar navigation, top bar, and content area. Implements glassmorphism
 * design style throughout.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Page title
 * @param {Object} props.user - User object (defaults to mock user)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered PageContainer component
 */
const PageContainer = ({
  children,
  title = 'Dashboard',
  user = mockUser,
  className = '',
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleProfileClick = () => {
    // Handle profile click (show menu, navigate to profile, etc.)
    console.log('Profile clicked');
  };
  
  const handleNotificationsClick = () => {
    // Handle notifications click
    console.log('Notifications clicked');
  };

  return (
    <div className="min-h-screen glass-bg-gradient">
      {/* Side Navigation */}
      <SideNav
        items={navigationItems}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      
      {/* Top Bar */}
      <TopBar
        user={user}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        onProfileClick={handleProfileClick}
        onNotificationsClick={handleNotificationsClick}
      />
      
      {/* Main Content */}
      <main
        className={`
          pt-16 min-h-screen
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'pl-16' : 'pl-64'}
          ${className}
        `}
      >
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          
          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageContainer; 