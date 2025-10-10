//src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type UserRole = 'elderly' | 'caregiver' | 'coach' | 'admin';

interface User {
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Check if user is logged in on app start
  //   const checkAuth = () => {
  //     try {
  //       const storedUser = localStorage.getItem('user');
  //       if (storedUser) {
  //         const userData = JSON.parse(storedUser);
  //         if (userData.isAuthenticated) {
  //           setUser(userData);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error checking authentication:', error);
  //       localStorage.removeItem('user');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);


  // src/contexts/AuthContext.tsx
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const r = await fetch('/api/auth/me', { cache: 'no-store' });
        const json = await r.json();

        if (!active) return;

        if (json?.ok && json?.user) {
          setUser({
            name: json?.profile?.fullname || json?.user?.email?.split('@')[0] || 'User',
            email: json?.user?.email || undefined,
            role: json?.profile?.role || 'elderly', // Default to elderly if no role specified
            isAuthenticated: true
          });
        } else {
          // For testing purposes, create a default user based on test role
          const testRole = localStorage.getItem('testRole') || 'elderly';
          setUser({
            name: 'Mary',
            email: 'mary@example.com',
            role: testRole as UserRole,
            isAuthenticated: true
          });
        }
      } catch {
        setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => { active = false; };
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { }
    setUser(null);
    localStorage.removeItem('user'); // keep for old code paths
  };



  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem('user');
  // };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};