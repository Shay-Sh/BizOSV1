import React from 'react';
import { cn } from '@/utils/classnames';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User } from 'lucide-react';

interface UserInfo {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

interface UserProfileMenuProps {
  userInfo: UserInfo;
  onClose: () => void;
  onSettings?: () => void;
  onSignOut?: () => void;
  className?: string;
}

export function UserProfileMenu({ 
  userInfo, 
  onClose, 
  onSettings, 
  onSignOut, 
  className 
}: UserProfileMenuProps) {
  // Close when clicking outside the menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.user-profile-menu')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle settings click
  const handleSettingsClick = () => {
    if (onSettings) {
      onSettings();
    }
    onClose();
  };

  // Handle sign out click
  const handleSignOutClick = () => {
    if (onSignOut) {
      onSignOut();
    }
    onClose();
  };

  return (
    <div 
      className={cn(
        "user-profile-menu bg-card rounded-lg shadow-lg p-4 w-64 border border-border",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {userInfo.avatarUrl ? (
            <img 
              src={userInfo.avatarUrl} 
              alt={userInfo.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{userInfo.name}</p>
          <p className="text-sm text-muted-foreground truncate">{userInfo.email}</p>
          {userInfo.role && (
            <p className="text-xs text-muted-foreground mt-0.5">{userInfo.role}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOutClick}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
} 