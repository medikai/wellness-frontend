//src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { checkAuthStatus, logoutUser } from '@/store/slices/authSlice';

interface User {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
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
  const dispatch = useAppDispatch();

  // Sync with Redux on mount - check auth status and store in Redux
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Dispatch checkAuthStatus to Redux which will store user with role
        const result = await dispatch(checkAuthStatus()).unwrap();
        
        if (!active) return;

        // checkAuthStatus returns { ok, user, profile } or rejects
        if (result?.ok && result?.user) {
          setUser({
            name: result?.profile?.fullname || result?.user?.email?.split('@')[0] || 'User',
            email: result?.profile?.email || undefined,
            role: result?.profile?.role || undefined,
            isAuthenticated: true
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => { active = false; };
  }, [dispatch]);

  const logout = async () => {
    try {
      // Logout from Redux
      await dispatch(logoutUser()).unwrap();
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