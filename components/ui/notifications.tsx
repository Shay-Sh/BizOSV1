import { Bell } from 'lucide-react';
import { Button } from './button';

interface NotificationsProps {
  unreadCount?: number;
  onClick?: () => void;
}

export function Notifications({ unreadCount = 0, onClick }: NotificationsProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="relative"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full flex items-center justify-center text-xs text-destructive-foreground">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
} 