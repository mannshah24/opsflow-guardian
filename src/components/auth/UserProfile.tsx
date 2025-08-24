import React, { useState, useEffect } from 'react';
import { User, LogOut, Shield, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  organizationName?: string;
  role: string;
  isNewUser?: boolean;
}

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = () => {
    const token = localStorage.getItem('opsflow_auth_token');
    const userStr = localStorage.getItem('opsflow_user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('opsflow_auth_token');
    localStorage.removeItem('opsflow_user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => navigate('/login')}
          variant="outline" 
          size="sm"
          className="text-white border-slate-600 hover:bg-slate-700"
        >
          <User className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <Card className="glass-card border-slate-600/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-slate-400 text-sm">{user.email}</span>
                {user.organizationName && (
                  <>
                    <span className="text-slate-500">•</span>
                    <div className="flex items-center space-x-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-400 text-sm">{user.organizationName}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400">Authenticated</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="text-red-400 border-red-600/50 hover:bg-red-600/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {user.isNewUser && (
          <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400">
            Welcome! You can now create AI agents and workflows. Complete your company onboarding for better AI recommendations.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
