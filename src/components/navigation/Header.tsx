import React, { useState, useEffect } from 'react';
import { Bell, User, Search, Command, Menu, LogOut, Settings, UserCircle, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { apiService, type Notification } from '@/services/api';

interface HeaderProps {
  onMenuClick?: () => void;
}

const quickActions = [
  { label: 'New Workflow', action: 'create-workflow' },
  { label: 'Approve All', action: 'approve-all' },
  { label: 'View Agents', action: 'view-agents' },
  { label: 'System Status', action: 'system-status' }
];

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        // Keep empty array if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-workflow':
        // Navigate to workflow creation
        window.location.href = '/workflows';
        break;
      case 'approve-all':
        // Navigate to approvals page
        window.location.href = '/approvals';
        break;
      case 'view-agents':
        // Navigate to agents page
        window.location.href = '/agents';
        break;
      case 'system-status':
        // Navigate to analytics page
        window.location.href = '/analytics';
        break;
      default:
        break;
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    // Mark notification as read and navigate based on type
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      // Mark as read
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
      );
      
      // Navigate based on notification type
      switch (notification.type) {
        case 'approval':
          window.location.href = '/approvals';
          break;
        case 'workflow':
          window.location.href = '/workflows';
          break;
        case 'agent':
          window.location.href = '/agents';
          break;
        default:
          window.location.href = '/audit';
          break;
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Perform global search across the application
      const params = new URLSearchParams({ q: searchQuery.trim() });
      window.location.href = `/search?${params.toString()}`;
    }
  };

  const handleAuthAction = (action: 'login' | 'signup') => {
    // Navigate to authentication pages
    window.location.href = `/${action}`;
  };

  // Check if user is authenticated (for demo purposes, we'll assume they're not)
  const isAuthenticated = false; // This would normally check localStorage/session

  return (
    <header className="h-14 sm:h-16 bg-card border-b border-border px-3 sm:px-6 flex items-center justify-between gap-3">
      {/* Left side */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden h-8 w-8 p-0 glass-button"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <Input
            placeholder={isMobile ? "Search..." : "Search workflows, agents, approvals..."}
            className="pl-10 bg-background-subtle border-border-hover text-sm h-9 sm:h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Quick Actions - Desktop */}
        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="glass-button gap-2">
                <Command className="w-4 h-4" />
                <span>Quick Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickActions.map((action) => (
                <DropdownMenuItem 
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="cursor-pointer"
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Actions - Mobile */}
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="glass-button h-8 w-8 p-0">
                <Command className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickActions.map((action) => (
                <DropdownMenuItem 
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="cursor-pointer"
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative glass-button h-8 w-8 sm:h-9 sm:w-9 p-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-error text-white text-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <Badge variant="outline">{unreadCount} new</Badge>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 border-b hover:bg-background-subtle cursor-pointer transition-colors ${
                    notification.unread ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'approval' ? 'bg-warning' :
                      notification.type === 'completion' ? 'bg-success' :
                      'bg-error'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-foreground-muted mt-1">{notification.message}</p>
                      <p className="text-xs text-foreground-muted mt-2">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t">
              <Button variant="ghost" size="sm" className="w-full text-sm">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="glass-button gap-2 h-8 sm:h-9 px-2 sm:px-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="hidden sm:inline font-medium text-sm">Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Account Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isAuthenticated ? (
              <>
                <DropdownMenuItem onClick={() => handleAuthAction('login')} className="cursor-pointer">
                  <Mail className="w-4 h-4 mr-2" />
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAuthAction('signup')} className="cursor-pointer">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Sign Up
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => window.location.href = '/profile'} className="cursor-pointer">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => window.location.href = '/settings'} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/help'} className="cursor-pointer">
              <MessageSquare className="w-4 h-4 mr-2" />
              Help & Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};