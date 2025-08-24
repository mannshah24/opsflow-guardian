import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store token
      localStorage.setItem('access_token', token);
      
      // Redirect to dashboard
      alert('✅ Google OAuth successful! Welcome!');
      window.location.href = '/';
    } else {
      // No token, redirect to login
      alert('❌ OAuth failed. Please try again.');
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent flex items-center justify-center p-4">
      <Card className="glass-card border-border-hover max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Completing Sign In
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-foreground-muted">
            Please wait while we complete your authentication...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
