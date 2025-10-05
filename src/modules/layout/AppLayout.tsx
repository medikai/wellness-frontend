'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path is auth page
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      // Always show sidebar on desktop, hide on mobile by default
      setSidebarOpen(!isMobileView);
    };

    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Redirect to login if not authenticated and not on auth pages
  useEffect(() => {
    if (!isLoading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [user, isLoading, isAuthPage, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
          <p className="text-neutral-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages without layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show loading if not authenticated
  if (!user) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b border-neutral-light lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-neutral-light transition-colors"
            >
              <Icon name="menu" size="md" color="#6B7280" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-primary rounded-lg flex items-center justify-center">
                <Icon name="heart" size="sm" color="white" />
              </div>
              <h1 className="text-lg font-bold text-neutral-dark">Wellness</h1>
            </div>
            
            <div className="w-8 h-8 bg-teal-primary rounded-lg flex items-center justify-center">
              <Icon name="user" size="sm" color="white" />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="bg-white shadow-sm border-b border-neutral-light hidden lg:block">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-primary rounded-xl flex items-center justify-center">
                <Icon name="heart" size="sm" color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-dark">Wellness</h1>
                <p className="text-xs text-neutral-medium">Health Companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-dark">Welcome back!</p>
                <p className="text-xs text-neutral-medium">{user?.name}</p>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-medium hover:text-teal-primary hover:bg-teal-light rounded-lg transition-colors group"
              >
                <Icon name="logOut" size="sm" />
                <span className="font-medium">Logout</span>
              </button>
              
              <div className="w-10 h-10 bg-gradient-to-r from-teal-primary to-teal-dark rounded-xl flex items-center justify-center">
                <Icon name="user" size="sm" color="white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;