import { useState, useEffect, useCallback } from 'react';

interface SessionData {
  currentPage: string;
  lastActive: string;
  userPreferences: {
    theme?: string;
    sidebarCollapsed?: boolean;
    notifications?: boolean;
  };
  dashboardState: {
    selectedTab?: string;
    filters?: Record<string, any>;
    searchTerm?: string;
  };
}

const SESSION_KEY = 'sautiai_session';

export const useSessionPersistence = () => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Load session data on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSessionData(parsed);
      } catch (error) {
        console.error('Failed to parse session data:', error);
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  // Save current page to session - this will be called from components that have access to location
  const updateCurrentPage = useCallback((pathname: string) => {
    updateSession({
      currentPage: pathname,
      lastActive: new Date().toISOString()
    });
  }, [updateSession]);

  const updateSession = useCallback((updates: Partial<SessionData>) => {
    setSessionData(prevSession => {
      const currentSession = prevSession || {
        currentPage: '/dashboard',
        lastActive: new Date().toISOString(),
        userPreferences: {},
        dashboardState: {}
      };

      const updatedSession = {
        ...currentSession,
        ...updates,
        lastActive: new Date().toISOString()
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
      return updatedSession;
    });
  }, []);

  const clearSession = () => {
    setSessionData(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const getLastPage = (): string => {
    return sessionData?.currentPage || '/dashboard';
  };

  const getDashboardState = (page: string) => {
    return sessionData?.dashboardState || {};
  };

  const saveDashboardState = (page: string, state: Record<string, any>) => {
    updateSession({
      dashboardState: {
        ...sessionData?.dashboardState,
        [page]: state
      }
    });
  };

  const getUserPreferences = () => {
    return sessionData?.userPreferences || {};
  };

  const saveUserPreferences = (preferences: Record<string, any>) => {
    updateSession({
      userPreferences: {
        ...sessionData?.userPreferences,
        ...preferences
      }
    });
  };

  return {
    sessionData,
    updateSession,
    clearSession,
    getLastPage,
    getDashboardState,
    saveDashboardState,
    getUserPreferences,
    saveUserPreferences,
    updateCurrentPage
  };
};