import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { authApi } from '@/services/api';

interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
  phone_number?: string;
  created_at?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Global flag to prevent multiple initializations during HMR
let isProviderInitialized = false;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth: Context is undefined. Make sure the component is wrapped in AuthProvider.');
    // During HMR, return a default context to prevent crashes
    if (import.meta.hot) {
      console.warn('useAuth: HMR detected, returning default context');
      return {
        user: null,
        isLoading: true,
        isAuthenticated: false,
        login: async () => {},
        logout: () => {},
        refreshUser: async () => {}
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isAuthenticated = !!user;
  

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setHasInitialized(false);
    // Clear session data
    localStorage.removeItem('sautiai_session');
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);
      
      // Get user profile after successful login
      const profile = await authApi.getProfile();
      setUser(profile);
      setHasInitialized(false); // Reset for next initialization
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (authApi.isAuthenticated()) {
        const profile = await authApi.getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      authApi.logout();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Prevent multiple initializations
        if (hasInitialized) {
          console.log('AuthContext: Already initialized, skipping');
          return;
        }
        
        // Skip initialization during HMR if already done
        if (import.meta.hot && isProviderInitialized) {
          console.log('AuthContext: HMR detected, skipping re-initialization');
          return;
        }
        
        console.log('AuthContext: Initializing authentication...');
        setIsLoading(true);
        setHasInitialized(true);
        isProviderInitialized = true;
        
        // If user is already loaded, don't re-fetch
        if (user) {
          console.log('AuthContext: User already loaded, skipping profile fetch');
          setIsLoading(false);
          return;
        }
        
        
        if (authApi.isAuthenticated()) {
          try {
            const profile = await authApi.getProfile();
            if (isMounted) {
              setUser(profile);
              console.log('AuthContext: User profile loaded');
            }
          } catch (error: any) {
            console.error('AuthContext: Failed to get profile during initialization:', error);
            // Only logout if it's a 401 error (invalid token)
            if (error.message?.includes('Session expired') || error.response?.status === 401) {
              console.log('AuthContext: Session expired, logging out');
              authApi.logout();
              if (isMounted) {
                setUser(null);
              }
            } else {
              console.log('AuthContext: Network error, keeping auth state for retry');
              // Don't logout on network errors, just keep the current state
            }
          }
        } else {
          console.log('AuthContext: No token found, user not authenticated');
        }
      } catch (error) {
        console.error('AuthContext: Auth initialization failed:', error);
        authApi.logout();
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log('AuthContext: Initialization complete');
        }
      }
    };

    initializeAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  }), [user, isLoading, isAuthenticated, login, logout, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};