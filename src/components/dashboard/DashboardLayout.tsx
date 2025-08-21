import React from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 mesh-background opacity-5"></div>
      
      <div className="relative flex w-full">
        <Sidebar />
        
        <div className="flex-1">
          <Header />
          <main className="relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};