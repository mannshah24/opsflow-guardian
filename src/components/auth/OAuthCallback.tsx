/**
 * OAuth Callback Handler
 * Processes Google OAuth callback and handles authentication
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { googleAuthService } from '@/services/googleAuth';

export const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Handle OAuth errors
        if (error) {
          throw new Error(
            error === 'access_denied' 
              ? 'Access denied. You need to grant permission to continue.' 
              : `OAuth error: ${error}`
          );
        }

        // Handle missing code
        if (!code) {
          throw new Error('Authorization code not received. Please try again.');
        }

        // Process the callback
        const userData = await googleAuthService.handleCallback(code, state || undefined);
        
        setUser(userData);
        setStatus('success');

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);

      } catch (err) {
        console.error('OAuth callback failed:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/login', { replace: true });
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Completing authentication...</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we verify your Google account
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Welcome to OpsFlow Guardian!</h3>
              {user && (
                <p className="text-sm text-muted-foreground mt-1">
                  Signed in as {user.name} ({user.email})
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Authentication Failed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                There was a problem signing you in
              </p>
            </div>
            
            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button onClick={handleRetry} variant="outline">
              Try Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">OpsFlow Guardian</CardTitle>
          <CardDescription>
            Google Authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
