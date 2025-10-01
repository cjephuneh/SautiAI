import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SESSION_KEY = 'sautiai_session';

export const SessionTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // List of public/auth pages that should NOT be saved in session
    const publicPages = ['/login', '/signup', '/', '/pricing', '/book-call', '/transcriptions', '/blogs'];
    
    // Only track dashboard pages (protected routes)
    const isDashboardPage = location.pathname.startsWith('/dashboard');
    const isPublicPage = publicPages.includes(location.pathname) || publicPages.some(page => location.pathname.startsWith(page));
    
    // Only save if it's a dashboard page and not the dashboard root
    if (isDashboardPage && location.pathname !== '/dashboard') {
      const currentSession = localStorage.getItem(SESSION_KEY);
      let sessionData;
      
      try {
        sessionData = currentSession ? JSON.parse(currentSession) : {};
      } catch (error) {
        console.error('Failed to parse session data:', error);
        sessionData = {};
      }

      const updatedSession = {
        ...sessionData,
        currentPage: location.pathname,
        lastActive: new Date().toISOString()
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
      console.log('SessionTracker: Saved session page:', location.pathname);
    } else if (isPublicPage) {
      // Clear session when navigating to public pages
      console.log('SessionTracker: On public page, not saving session');
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};