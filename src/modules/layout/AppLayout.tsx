//src/modules/layout/AppLayout.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon, TextSizeControl } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Start with sidebar expanded
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // User dropdown state
  const previousCollapsedStateRef = useRef<boolean>(false); // Store previous state using ref
  const previousPathnameRef = useRef<string | null>(null); // Track previous pathname
  const userDropdownDesktopRef = useRef<HTMLDivElement>(null); // Ref for desktop user dropdown
  const userDropdownMobileRef = useRef<HTMLDivElement>(null); // Ref for mobile user dropdown
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path is auth page or homepage
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/register-coach' || pathname === '/self-paced' || pathname === '/schedule-demo';
  const isHomePage = pathname === '/';
  
  // Check if current path is a meeting page
  const isMeetingPage = pathname?.startsWith('/meeting') || pathname === '/host' || pathname === '/join';

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      // Always show sidebar on desktop, hide on mobile by default
      // On meeting pages, hide sidebar on mobile
      if (isMeetingPage && isMobileView) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(!isMobileView);
      }
    };

    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [isMeetingPage]);

  // Auto-collapse sidebar when entering meeting pages, restore when leaving
  useEffect(() => {
    // Only run when pathname actually changes
    if (previousPathnameRef.current === pathname) {
      return;
    }

    const wasMeetingPage = previousPathnameRef.current 
      ? (previousPathnameRef.current.startsWith('/meeting') || previousPathnameRef.current === '/host' || previousPathnameRef.current === '/join')
      : false;

    if (isMeetingPage && !wasMeetingPage) {
      // Entering meeting page - store current state and collapse
      previousCollapsedStateRef.current = sidebarCollapsed;
      setSidebarCollapsed(true);
    } else if (!isMeetingPage && wasMeetingPage) {
      // Leaving meeting page - restore previous state
      setSidebarCollapsed(previousCollapsedStateRef.current);
    }

    // Update previous pathname
    previousPathnameRef.current = pathname;
  }, [pathname, isMeetingPage, sidebarCollapsed]);

  // Redirect to login if not authenticated and not on auth pages or homepage
  // Redirect authenticated users from / to /home
  useEffect(() => {
    if (isLoading) return;
    if (!user && !isAuthPage && !isHomePage) {
      router.push('/login');
    } else if (user && isHomePage) {
      router.push('/home');
    }
  }, [user, isLoading, isAuthPage, isHomePage, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDesktop = userDropdownDesktopRef.current ? !userDropdownDesktopRef.current.contains(target) : true;
      const isOutsideMobile = userDropdownMobileRef.current ? !userDropdownMobileRef.current.contains(target) : true;
      
      if (isOutsideDesktop && isOutsideMobile) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

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

  // Show auth pages and homepage without layout
  if (isAuthPage || isHomePage) {
    return <>{children}</>;
  }

  // Show loading if not authenticated
  if (!user) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content */}
      <div className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        {/* Mobile Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow border-b border-neutral-light/50 lg:hidden sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl hover:bg-teal-light/50 transition-all duration-200 group"
            >
              <Icon name="menu" size="md" color="#059669" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-primary to-teal-dark rounded-xl flex items-center justify-center shadow-md">
                <Icon name="heart" size="sm" color="white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-dark">waylness</h1>
                <p className="text-xs text-teal-primary font-medium">Health Companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TextSizeControl variant="header" />
              <div className="relative" ref={userDropdownMobileRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 bg-gradient-to-br from-teal-primary to-teal-dark rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                >
                  <Icon name="user" size="sm" color="white" />
                </button>

                {userDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-3 w-48 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-light/50 z-20 py-2 overflow-hidden">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          router.push('/profile');
                        }}
                        className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-teal-light/50 transition-colors duration-200 text-neutral-dark"
                      >
                        <Icon name="user" size="sm" color="#059669" />
                        <span className="font-medium">Profile</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-red-50 transition-colors duration-200 text-neutral-dark"
                      >
                        <Icon name="logOut" size="sm" color="#DC2626" />
                        <span className="font-medium text-red-600">Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-light/50 hidden lg:block sticky top-0 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-teal-primary to-teal-dark rounded-2xl flex items-center justify-center shadow-lg">
                <Icon name="heart" size="md" color="white" />
              </div> */}
              {/* <div>
                <h1 className="text-2xl font-bold text-neutral-dark">waylness</h1>
                <p className="text-sm text-teal-primary font-medium">Health Companion</p>
              </div> */}
            </div>
            
            <div className="flex items-center space-x-6">
              
              
              <TextSizeControl variant="header" />
              
              
              <div className="relative" ref={userDropdownDesktopRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-12 h-12 bg-gradient-to-br from-teal-primary to-teal-dark rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                >
                  <Icon name="user" size="md" color="white" />
                </button>

                {userDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-3 w-48 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-light/50 z-20 py-2 overflow-hidden">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          router.push('/profile');
                        }}
                        className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-teal-light/50 transition-colors duration-200 text-neutral-dark"
                      >
                        <Icon name="user" size="sm" color="#059669" />
                        <span className="font-medium">Profile</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-red-50 transition-colors duration-200 text-neutral-dark"
                      >
                        <Icon name="logOut" size="sm" color="#DC2626" />
                        <span className="font-medium text-red-600">Logout</span>
                      </button>
                    </div>
                  </>
                )}
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