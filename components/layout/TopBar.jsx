import React, { useState } from 'react';
import GlassButton from '../ui/GlassButton';

/**
 * TopBar Component
 * 
 * A frosted glass top navigation bar for the dashboard.
 * Implements the glassmorphism design style with search, notifications,
 * and user profile elements.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object with name, email, avatar
 * @param {boolean} props.sidebarCollapsed - Whether the sidebar is collapsed
 * @param {function} props.onToggleSidebar - Function to toggle sidebar collapsed state
 * @param {function} props.onProfileClick - Function called when profile is clicked
 * @param {function} props.onNotificationsClick - Function called when notifications button is clicked
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered TopBar component
 */
const TopBar = ({
  user = {},
  sidebarCollapsed = false,
  onToggleSidebar,
  onProfileClick,
  onNotificationsClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log('Search for:', searchQuery);
  };
  
  // Get user initials for avatar display
  const getUserInitials = () => {
    if (!user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <header 
      className={`
        fixed top-0 right-0 z-10
        h-16 bg-white/5 backdrop-blur-md
        border-b border-white/10
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'left-16' : 'left-64'}
        ${className}
      `}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile sidebar toggle */}
        <button
          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white lg:hidden"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Page heading - for mobile view */}
        <h1 className="text-white text-lg font-medium ml-4 block lg:hidden">Dashboard</h1>
        
        {/* Search bar */}
        <div className="hidden md:block flex-1 max-w-xl">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="
                  w-full pl-10 pr-4 py-2
                  glass-input
                  bg-white/5 border border-white/10 rounded-md
                  text-white placeholder-white/40
                  focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20
                "
              />
            </div>
          </form>
        </div>
        
        {/* Right section - actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications button */}
          <button 
            className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            onClick={onNotificationsClick}
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-white/10"></div>
          
          {/* User profile button */}
          <button 
            className="flex items-center space-x-2 group"
            onClick={onProfileClick}
            aria-label="User profile"
          >
            <div className="glass-reflection w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border border-white/20 flex items-center justify-center">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name || 'User profile'} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-white">{getUserInitials()}</span>
              )}
            </div>
            
            <div className="hidden sm:block">
              <p className="text-white text-sm font-medium group-hover:text-white/90">{user.name || 'User'}</p>
              <p className="text-white/60 text-xs">{user.role || 'User'}</p>
            </div>
            
            <svg className="h-5 w-5 text-white/40 group-hover:text-white/60 hidden sm:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar; 