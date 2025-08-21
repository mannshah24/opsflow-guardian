import React from 'react';
import { Bell, User, Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Header = () => {
  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <Input
            placeholder="Search workflows, agents, or approvals..."
            className="pl-10 bg-background-subtle border-border-hover"
          />
        </div>
        <Button variant="outline" size="sm" className="glass-button gap-2">
          <Command className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Actions</span>
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative glass-button">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full"></span>
        </Button>

        {/* User */}
        <Button variant="ghost" size="sm" className="glass-button gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline font-medium">Admin</span>
        </Button>
      </div>
    </header>
  );
};