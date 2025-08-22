import React, { useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 mesh-background opacity-5"></div>
      
      <div className="relative flex w-full">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile} 
        />
        
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className={`flex-1 transition-all duration-300 ${isMobile ? 'w-full' : 'ml-0'}`}>
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};