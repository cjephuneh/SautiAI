import { useEffect, useState } from 'react';
import { authApi } from '@/services/api';

interface UserSession {
  userId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: any | null;
}

export const useUserSession = (): UserSession => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true);
      
      try {
        // Check if user is authenticated
        const authenticated = authApi.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // Get user ID from localStorage
          const storedUserId = localStorage.getItem('user_id');
          if (storedUserId) {
            const userIdNum = parseInt(storedUserId, 10);
            setUserId(userIdNum);
            console.log('🔍 User session initialized with ID:', userIdNum);
          } else {
            // Try to get profile to extract user ID
            try {
              const profile = await authApi.getProfile();
              setUserProfile(profile);
              if (profile.id) {
                setUserId(profile.id);
                localStorage.setItem('user_id', profile.id.toString());
                console.log('🔍 User ID extracted from profile:', profile.id);
              }
            } catch (error) {
              console.error('Failed to get user profile:', error);
              // Clear invalid session
              authApi.logout();
              setIsAuthenticated(false);
              setUserId(null);
            }
          }
        } else {
          setUserId(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        setIsAuthenticated(false);
        setUserId(null);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Listen for storage changes (e.g., logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && !e.newValue) {
        // Token was removed, user logged out
        setIsAuthenticated(false);
        setUserId(null);
        setUserProfile(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    userId,
    isAuthenticated,
    isLoading,
    userProfile
  };
};