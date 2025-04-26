'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SideNav from '@/components/ui/SideNav';
import TopNav from '@/components/ui/TopNav';
import { Home, User, Settings, FileText, BarChart3, MessageSquare, Grid } from 'lucide-react';

// Helper function to transform Lucide icons to match the expected IconType
const iconComponent = (Icon: React.ElementType) => (
  <Icon className="h-5 w-5" />
);

export default function NavigationExample() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const router = useRouter();
  
  // Mock user data
  const userInfo = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Administrator'
  };
  
  // Mock navigation items
  const navItems = [
    {
      href: '/examples/navigation-example',
      label: 'Dashboard',
      icon: () => iconComponent(Home),
    },
    {
      href: '/examples/navigation-example/users',
      label: 'Users',
      icon: () => iconComponent(User),
      badge: '5'
    },
    {
      href: '/examples/navigation-example/reports',
      label: 'Reports',
      icon: () => iconComponent(FileText),
    },
    {
      href: '/examples/navigation-example/analytics',
      label: 'Analytics',
      icon: () => iconComponent(BarChart3),
    },
    {
      href: '/examples/navigation-example/messages',
      label: 'Messages',
      icon: () => iconComponent(MessageSquare),
      badge: '3'
    },
    {
      href: '/examples/navigation-example/apps',
      label: 'Apps',
      icon: () => iconComponent(Grid),
    }
  ];
  
  // Event handlers
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleSignOut = () => {
    alert('Sign out clicked');
    // In a real app, this would sign the user out
    // router.push('/auth/signin');
  };
  
  const handleSettings = () => {
    alert('Settings clicked');
    // In a real app, this would navigate to settings
    // router.push('/settings');
  };
  
  const handleSearch = (query: string) => {
    alert(`Search for: ${query}`);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <SideNav
        items={navItems}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        userInfo={userInfo}
        onSettings={handleSettings}
        onSignOut={handleSignOut}
      />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Navigation */}
        <TopNav
          onSearch={handleSearch}
          notificationCount={3}
          userInfo={userInfo}
          onSettings={handleSettings}
          onSignOut={handleSignOut}
        />
        
        {/* Page Content */}
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Navigation Example</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg border border-border">
              <h2 className="text-lg font-medium mb-4">About This Example</h2>
              <p className="text-muted-foreground">
                This example demonstrates the integration of SideNav, TopNav and UserProfileMenu components.
                It features a collapsible sidebar, a top navigation bar with search and notifications,
                and user profile menus accessible from both the sidebar and top navigation.
              </p>
            </div>
            
            <div className="p-6 bg-card rounded-lg border border-border">
              <h2 className="text-lg font-medium mb-4">Features</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Responsive sidebar navigation with collapse toggle</li>
                <li>• Active navigation states with badges</li>
                <li>• Search functionality in the top navbar</li>
                <li>• Notification indicator</li>
                <li>• User profile menu with settings and sign out options</li>
                <li>• Theme-aware styling with dark mode support</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-medium mb-4">User Interactions</h2>
            <p className="text-muted-foreground mb-4">
              Try these interactions to see the components in action:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Click the chevron icon in the sidebar to collapse/expand it</li>
              <li>• Click on different navigation items to see the active state</li>
              <li>• Click the search icon in the top bar and enter a search query</li>
              <li>• Click the user profile in the sidebar or top bar to open the user menu</li>
              <li>• Try the Settings and Sign out buttons in the user menu</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
} 