import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/classnames';

// Icon type definition to support various icon formats
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ReactNode;

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
  };
}

/**
 * SideNav component - A glassmorphic sidebar navigation
 * with collapsible states, active item indicators, and user info
 */
const SideNav = ({
  items,
  collapsed = false,
  onToggleCollapse,
  className,
  logoText = 'BizOS',
  userInfo,
}: SideNavProps) => {
  const pathname = usePathname();

  // Check if a nav item is active based on the current path
  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    if (!pathname) {
      return false;
    }
    return pathname.startsWith(href) && href !== '/dashboard';
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

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen z-20",
        "bg-white/10 backdrop-blur-xl border-r border-white/10",
        "transition-all duration-300 ease-in-out",
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-white/10">
        <div className="flex items-center">
          {/* App logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="font-bold text-white">B</span>
          </div>
          
          {/* App name - only show when not collapsed */}
          {!collapsed && (
            <h1 className="ml-3 text-xl font-bold text-white">{logoText}</h1>
          )}
        </div>
        
        {/* Toggle button - only show on larger screens */}
        {onToggleCollapse && (
          <button
            className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white lg:block hidden"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              // Expand icon (chevron right)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              // Collapse icon (chevron left)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}
      </div>
      
      {/* Navigation items */}
      <nav className="mt-4 px-2">
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
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {/* Icon */}
                  <div className={cn(
                    collapsed ? 'mx-auto' : 'mr-3',
                    active ? 'text-white' : 'text-white/70 group-hover:text-white'
                  )}>
                    {typeof item.icon === 'function' 
                      ? React.createElement(item.icon as any, { className: 'h-5 w-5' }) 
                      : item.icon}
                  </div>
                  
                  {/* Label - only show when not collapsed */}
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}

                  {/* Badge - only show when not collapsed */}
                  {!collapsed && item.badge && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-white/20">
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          {!collapsed ? (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                {userInfo.avatarUrl ? (
                  <img 
                    src={userInfo.avatarUrl} 
                    alt={userInfo.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                )}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{userInfo.name}</p>
                <p className="text-xs text-white/60 truncate">{userInfo.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                {userInfo.avatarUrl ? (
                  <img 
                    src={userInfo.avatarUrl} 
                    alt={userInfo.name}
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default SideNav; 