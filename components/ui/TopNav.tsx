import React from 'react';
import { Search, Bell, Sun, Moon, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/utils/classnames';
import { UserProfileMenu } from './user-profile-menu';

interface TopNavProps {
  className?: string;
  onSearch?: (query: string) => void;
  notificationCount?: number;
  userInfo?: {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
  };
  onSignOut?: () => void;
  onSettings?: () => void;
}

/**
 * TopNav component - Top navigation bar with search, notifications and profile
 */
const TopNav = ({
  className,
  onSearch,
  notificationCount = 0,
  userInfo,
  onSignOut,
  onSettings,
}: TopNavProps) => {
  const { theme, setTheme } = useTheme();
  const [searchValue, setSearchValue] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchValue.trim()) {
      onSearch(searchValue);
    }
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
    <div className={cn(
      "h-16 border-b border-border bg-card px-4 flex items-center justify-between",
      className
    )}>
      {/* Search Section - Expands on mobile when clicked */}
      <div className={cn(
        "transition-all duration-200 ease-in-out",
        showSearch ? "w-full" : "w-auto"
      )}>
        {showSearch ? (
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onBlur={() => {
                  if (!searchValue) {
                    setShowSearch(false);
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5" />
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Search"
          >
            <Search className="text-muted-foreground h-5 w-5" />
          </button>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="text-muted-foreground h-5 w-5" />
          ) : (
            <Moon className="text-muted-foreground h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary relative"
          aria-label="Notifications"
        >
          <Bell className="text-muted-foreground h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        {userInfo && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1 rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="User Profile"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {userInfo.avatarUrl ? (
                  <img 
                    src={userInfo.avatarUrl} 
                    alt={userInfo.name}
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <span className="text-sm font-medium text-primary-foreground">{getUserInitials()}</span>
                )}
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 z-50">
                <UserProfileMenu 
                  userInfo={userInfo}
                  onClose={() => setShowUserMenu(false)}
                  onSettings={onSettings}
                  onSignOut={onSignOut}
                  className="origin-top-right"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNav; 