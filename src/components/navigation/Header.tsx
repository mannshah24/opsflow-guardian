import React, { useState } from 'react';
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

interface HeaderProps {
  onMenuClick?: () => void;
}

// Mock notifications data
const notifications = [
  {
    id: '1',
    type: 'approval',
    title: 'Workflow Approval Required',
    message: 'Employee onboarding workflow needs your approval',
    time: '2 mins ago',
    unread: true
  },
  {
    id: '2',
    type: 'completion',
    title: 'Workflow Completed',
    message: 'Vendor onboarding for Acme Corp has completed successfully',
    time: '15 mins ago',
    unread: true
  },
  {
    id: '3',
    type: 'error',
    title: 'Workflow Failed',
    message: 'Database backup workflow encountered an error',
    time: '1 hour ago',
    unread: false
  }
];

const quickActions = [
  { label: 'New Workflow', action: 'create-workflow' },
  { label: 'Approve All', action: 'approve-all' },
  { label: 'View Agents', action: 'view-agents' },
  { label: 'System Status', action: 'system-status' }
];

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create-workflow':
        alert('🚀 Opening workflow creation wizard...');
        break;
      case 'approve-all':
        alert('✅ Approving all pending workflows...');
        break;
      case 'view-agents':
        alert('🤖 Opening agent monitoring dashboard...');
        break;
      case 'system-status':
        alert('📊 Opening system status dashboard...');
        break;
      default:
        break;
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    alert(`Opening notification: ${notificationId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      alert('🔐 Logging out... (This would redirect to login page)');
    }
  };

  const handleAuthAction = (action: 'login' | 'signup') => {
    // Navigate to authentication pages
    window.location.href = `/${action}`;
  };

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
            <DropdownMenuItem onClick={() => handleAuthAction('login')} className="cursor-pointer">
              <Mail className="w-4 h-4 mr-2" />
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAuthAction('signup')} className="cursor-pointer">
              <UserCircle className="w-4 h-4 mr-2" />
              Sign Up
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => alert('Opening profile settings...')} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert('Opening help center...')} className="cursor-pointer">
              <MessageSquare className="w-4 h-4 mr-2" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-error">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};