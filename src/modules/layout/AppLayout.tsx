//src/modules/layout/AppLayout.tsx
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
  // src/modules/layout/AppLayout.tsx
useEffect(() => {
  if (isLoading) return;
  if (!user && !isAuthPage) {
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
        {/* Professional Header */}
        <header className="bg-white shadow-sm border-b border-neutral-light sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            {/* Left Section - Mobile Menu & Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-neutral-light transition-colors lg:hidden"
              >
                <Icon name="menu" size="md" color="#6B7280" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-teal-primary to-teal-dark rounded-xl flex items-center justify-center shadow-sm">
                  <Icon name="heart" size="sm" color="white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-xl font-bold text-neutral-dark">Wellness</h1>
                  <p className="text-xs text-neutral-medium hidden lg:block">Health Companion</p>
                </div>
              </div>
            </div>
            
            {/* Center Section - Search (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search classes, quizzes, or content..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
                />
                <Icon name="search" size="sm" color="#6B7280" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
            
            {/* Right Section - Actions & User */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-neutral-light transition-colors">
                <Icon name="bell" size="md" color="#6B7280" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-primary rounded-full"></span>
              </button>
              
              {/* User Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-light transition-colors">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-teal-primary to-teal-dark rounded-xl flex items-center justify-center shadow-sm">
                    <Icon name="user" size="sm" color="white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-neutral-dark">{user?.name || 'User'}</p>
                    <p className="text-xs text-neutral-medium">Premium Member</p>
                  </div>
                  <Icon name="chevronDown" size="sm" color="#6B7280" className="hidden lg:block" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-light opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-neutral-light">
                      <p className="text-sm font-medium text-neutral-dark">{user?.name || 'User'}</p>
                      <p className="text-xs text-neutral-medium">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-dark hover:bg-neutral-light transition-colors">
                      <Icon name="user" size="sm" className="inline mr-2" />
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-dark hover:bg-neutral-light transition-colors">
                      <Icon name="settings" size="sm" className="inline mr-2" />
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-dark hover:bg-neutral-light transition-colors">
                      <Icon name="helpCircle" size="sm" className="inline mr-2" />
                      Help & Support
                    </button>
                    <div className="border-t border-neutral-light mt-2 pt-2">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Icon name="logOut" size="sm" className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
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