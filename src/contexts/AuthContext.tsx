/**
 * Authentication Context Provider
 * Manages global authentication state and provides auth utilities
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { googleAuthService, User } from '@/services/googleAuth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      // Initialize Google auth service
      await googleAuthService.initialize();
      
      // Check if user is authenticated
      if (googleAuthService.isAuthenticated()) {
        const currentUser = await googleAuthService.getCurrentUser();
        setUser(currentUser);
      } else {
        // Check for stored user info
        const storedUser = googleAuthService.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Clear any invalid auth data
      await googleAuthService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);
      await googleAuthService.signIn();
      // Note: User will be set after OAuth callback completes
    } catch (error) {
      console.error('Sign in failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await googleAuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      // Still clear user state even if API call fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (googleAuthService.isAuthenticated()) {
        const currentUser = await googleAuthService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('User refresh failed:', error);
      // If refresh fails, user might need to re-authenticate
      await signOut();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && googleAuthService.isAuthenticated(),
    isLoading,
    signIn,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
