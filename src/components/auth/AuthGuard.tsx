import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthentication();
  }, [location.pathname]);

  const checkAuthentication = () => {
    setIsLoading(true);
    
    // Check for auth token in localStorage
    const token = localStorage.getItem('opsflow_auth_token');
    const user = localStorage.getItem('opsflow_user');
    
    if (token && user) {
      try {
        // Validate token format (basic check)
        if (token.length > 10) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    }
    
    // If no valid authentication found
    setIsAuthenticated(false);
    setIsLoading(false);
    
    // Don't redirect if already on login/signup pages
    const publicPaths = ['/login', '/signup', '/auth/callback'];
    if (!publicPaths.includes(location.pathname)) {
      navigate('/login', { 
        replace: true, 
        state: { from: location.pathname } 
      });
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
            <span className="text-white">Authenticating...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show children only if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // For public pages (login/signup), render them without auth check
  const publicPaths = ['/login', '/signup', '/auth/callback'];
  if (publicPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // This should rarely happen due to navigation redirect above
  return null;
};

export default AuthGuard;
