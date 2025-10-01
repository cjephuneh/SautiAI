import { useState, useEffect } from 'react';
import { useSessionPersistence } from '@/hooks/useSessionPersistence';
import { useLocation } from 'react-router-dom';

interface DashboardState {
  selectedTab?: string;
  filters?: Record<string, any>;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const useDashboardState = (initialState: DashboardState = {}) => {
  const sessionPersistence = useSessionPersistence();
  const location = useLocation();
  const [state, setState] = useState<DashboardState>(initialState);

  // Load saved state when component mounts
  useEffect(() => {
    const savedState = sessionPersistence.getDashboardState(location.pathname);
    if (Object.keys(savedState).length > 0) {
      setState(prevState => ({ ...prevState, ...savedState }));
    }
  }, [location.pathname, sessionPersistence]);

  // Save state when it changes
  useEffect(() => {
    if (Object.keys(state).length > 0) {
      sessionPersistence.saveDashboardState(location.pathname, state);
    }
  }, [state, location.pathname, sessionPersistence]);

  const updateState = (updates: Partial<DashboardState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  };

  const resetState = () => {
    setState(initialState);
    sessionPersistence.saveDashboardState(location.pathname, initialState);
  };

  return {
    state,
    updateState,
    resetState,
    setState
  };
};