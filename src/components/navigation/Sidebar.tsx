import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Workflow, 
  CheckCircle, 
  Shield, 
  Settings,
  Zap,
  BarChart3,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Approvals', href: '/approvals', icon: CheckCircle },
  { name: 'Audit Trail', href: '/audit', icon: Shield },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose, isMobile = false }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isMobile 
          ? "fixed left-0 top-0 z-50 h-full w-64 transform" 
          : "w-64",
        isMobile && !isOpen && "-translate-x-full",
        isMobile && isOpen && "translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-sidebar-foreground">OpsFlow</h1>
                  <p className="text-xs text-sidebar-foreground/60">Guardian 2.0</p>
                </div>
              </div>
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="p-2 h-auto"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={isMobile ? onClose : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      'active:scale-95',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                        : 'text-sidebar-foreground/70'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Status Indicator */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="glass-card p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow flex-shrink-0"></div>
                <span className="text-xs font-medium text-sidebar-foreground">System Status</span>
              </div>
              <div className="text-xs text-sidebar-foreground/60">
                All agents operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};