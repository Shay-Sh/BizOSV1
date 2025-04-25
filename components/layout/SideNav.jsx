import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * SideNav Component
 * 
 * A frosted glass sidebar navigation component for the dashboard.
 * Implements the glassmorphism design style with active states
 * and hover effects.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of navigation items with id, label, icon, and href
 * @param {boolean} props.collapsed - Whether the sidebar is collapsed (mobile)
 * @param {function} props.onToggleCollapse - Function to toggle collapsed state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered SideNav component
 */
const SideNav = ({
  items = [],
  collapsed = false,
  onToggleCollapse,
  className = '',
}) => {
  const router = useRouter();
  
  const isActive = (href) => {
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen z-20
        bg-white/10 backdrop-blur-xl border-r border-white/10
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
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
            <h1 className="ml-3 text-xl font-bold text-white">BizOS</h1>
          )}
        </div>
        
        {/* Toggle button - only show on larger screens */}
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
      </div>
      
      {/* Navigation items */}
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const active = isActive(item.href);
            
            return (
              <li key={item.id}>
                <Link href={item.href}>
                  <a 
                    className={`
                      flex items-center px-3 py-2 rounded-md
                      transition-all duration-200 group
                      ${active
                        ? 'bg-white/20 text-white shadow-glass-inner'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* Icon */}
                    <div className={`
                      ${collapsed ? 'mx-auto' : 'mr-3'}
                      ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}
                    `}>
                      {item.icon}
                    </div>
                    
                    {/* Label - only show when not collapsed */}
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Bottom section with user info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        {!collapsed ? (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">US</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">User Name</p>
              <p className="text-xs text-white/60">user@example.com</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">US</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideNav; 