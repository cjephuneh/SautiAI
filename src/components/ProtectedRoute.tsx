import React, { useRef, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasCheckedSession = useRef(false);
  
  // Add error boundary for useAuth
  let isAuthenticated = false;
  let isLoading = true;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    isLoading = auth.isLoading;
  } catch (error) {
    console.error('ProtectedRoute: Auth context error:', error);
    // If auth context is not available, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check session and redirect only once
  useEffect(() => {
    if (isAuthenticated && !isLoading && location.pathname === '/dashboard' && !hasCheckedSession.current) {
      hasCheckedSession.current = true;
      const lastPage = localStorage.getItem('sautiai_session');
      if (lastPage) {
        try {
          const sessionData = JSON.parse(lastPage);
          const savedPage = sessionData.currentPage;
          
          // Only restore if it's a valid dashboard page (not login/signup/public pages)
          const isValidDashboardPage = savedPage && 
                                       savedPage.startsWith('/dashboard') && 
                                       savedPage !== '/dashboard' &&
                                       !['/login', '/signup', '/', '/pricing', '/book-call'].includes(savedPage);
          
          if (isValidDashboardPage) {
            console.log('ProtectedRoute: Restoring last session page:', savedPage);
            navigate(savedPage, { replace: true });
          } else if (savedPage) {
            console.log('ProtectedRoute: Ignoring invalid session page:', savedPage);
          }
        } catch (error) {
          console.error('ProtectedRoute: Failed to parse session data:', error);
          localStorage.removeItem('sautiai_session');
        }
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute: Loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  console.log('ProtectedRoute: Authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
