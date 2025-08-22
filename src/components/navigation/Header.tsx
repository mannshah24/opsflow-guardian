import React from 'react';
import { Bell, User, Search, Command, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-16 bg-card border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left side - Mobile menu and Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        {/* Mobile hamburger menu */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuClick}
            className="p-2 h-auto lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <Input
            placeholder={isMobile ? "Search..." : "Search workflows, agents, or approvals..."}
            className="pl-10 bg-background-subtle border-border-hover text-sm"
          />
        </div>
        
        {/* Quick Actions - Hidden on small mobile */}
        {!isMobile && (
          <Button variant="outline" size="sm" className="glass-button gap-2 hidden sm:flex">
            <Command className="w-4 h-4" />
            <span>Quick Actions</span>
          </Button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Actions mobile button */}
        {isMobile && (
          <Button variant="outline" size="sm" className="glass-button p-2 h-auto sm:hidden">
            <Command className="w-4 h-4" />
          </Button>
        )}
        
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative glass-button p-2 h-auto">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full"></span>
        </Button>

        {/* User */}
        <Button variant="ghost" size="sm" className="glass-button gap-2 p-2 h-auto">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline font-medium">Admin</span>
        </Button>
      </div>
    </header>
  );
};