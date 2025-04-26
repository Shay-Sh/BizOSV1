import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/classnames';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfileMenu } from './user-profile-menu';

// Icon type definition to support various icon formats
type IconType = (() => React.ReactNode) | React.ReactNode;

// Navigation item interface
export interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  badge?: string | number;
}

interface SideNavProps {
  items: NavItem[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  logoText?: string;
  userInfo?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  };
  onUserProfileClick?: () => void;
  onSignOut?: () => void;
  onSettings?: () => void;
}

/**
 * SideNav component - A sidebar navigation with collapsible state
 */
const SideNav = ({
  items,
  collapsed = false,
  onToggleCollapse,
  className,
  logoText = 'BizOS',
  userInfo,
  onUserProfileClick,
  onSignOut,
  onSettings,
}: SideNavProps) => {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // Check if a nav item is active based on the current path
  const isActive = (href: string) => {
    if (!pathname) {
      return false;
    }
    
    // For Home route ('/app'), check for exact match to avoid always showing as active
    if (href === '/app') {
      return pathname === '/app' || pathname === '/app/';
    }
    
    // For other routes, check if the current path starts with the href
    // but make sure we're not matching partial segments
    return pathname.startsWith(href + '/') || pathname === href;
  };

  // Get user initials for avatar display
  const getUserInitials = () => {
    if (!userInfo?.name) return 'U';
    
    const nameParts = userInfo.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Handle user profile click
  const handleUserProfileClick = () => {
    if (collapsed) {
      // If sidebar is collapsed, just trigger the callback directly
      if (onUserProfileClick) {
        onUserProfileClick();
      }
    } else {
      // If sidebar is expanded, toggle the menu
      setShowUserMenu(!showUserMenu);
    }
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen z-20",
        "bg-card border-r border-border",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        <div className="flex items-center">
          {/* App logo */}
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">B</span>
          </div>
          
          {/* App name - only show when not collapsed */}
          {!collapsed && (
            <h1 className="ml-3 text-xl font-bold text-foreground">{logoText}</h1>
          )}
        </div>
        
        {/* Toggle button - only show on larger screens */}
        {onToggleCollapse && (
          <button
            className="p-1 rounded-md bg-muted hover:bg-muted/80 text-foreground lg:block hidden"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {/* Navigation items */}
      <nav className="mt-4 px-2 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item, index) => {
            const active = isActive(item.href);
            
            return (
              <li key={index}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md transition-all duration-200 group",
                    collapsed ? "justify-center p-2" : "px-3 py-2",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {/* Icon */}
                  <div className={cn(
                    collapsed ? 'mx-auto' : 'mr-3',
                    active ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}>
                    {typeof item.icon === 'function' 
                      ? item.icon()
                      : item.icon}
                  </div>
                  
                  {/* Label - only show when not collapsed */}
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {/* Badge - only show when not collapsed */}
                  {!collapsed && item.badge && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom section with user info */}
      {userInfo && (
        <div className="mt-auto border-t border-border">
          <div 
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            )}
            onClick={handleUserProfileClick}
          >
            {!collapsed ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  {userInfo.avatarUrl ? (
                    <img 
                      src={userInfo.avatarUrl} 
                      alt={userInfo.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary-foreground">{getUserInitials()}</span>
                  )}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-foreground truncate">{userInfo.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  {userInfo.avatarUrl ? (
                    <img 
                      src={userInfo.avatarUrl} 
                      alt={userInfo.name}
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary-foreground">{getUserInitials()}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* User profile menu - only shown when not collapsed and menu is toggled */}
          {!collapsed && showUserMenu && (
            <div className="absolute bottom-20 left-4 z-50">
              <UserProfileMenu 
                userInfo={{
                  name: userInfo.name,
                  email: userInfo.email,
                  avatarUrl: userInfo.avatarUrl,
                  role: userInfo.role
                }}
                onClose={() => setShowUserMenu(false)}
                onSettings={onSettings}
                onSignOut={onSignOut}
                className="origin-bottom-left"
              />
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default SideNav; 