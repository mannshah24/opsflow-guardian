import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowLeft, AlertCircle, CheckCircle, XCircle, UserX, Key } from 'lucide-react';
import { googleAuthService } from '@/services/googleAuth';

export default function Login() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    if (googleAuthService.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Dialog states
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
    details: '',
    type: 'error' as 'error' | 'success' | 'warning'
  });

  // Professional error message parser for login
  const parseLoginError = (error: any, responseData?: any) => {
    let title = 'Login Failed';
    let description = '';
    let details = '';
    let type: 'error' | 'warning' = 'error';

    if (typeof error === 'string') {
      if (error.includes('Incorrect email or password')) {
        title = 'Invalid Credentials';
        description = 'The email or password you entered is incorrect.';
        details = `Email: ${formData.email}\n\nPlease check your credentials and try again. If you forgot your password, you can reset it.`;
        type = 'warning';
      } else if (error.includes('account')) {
        title = 'Account Issue';
        description = error;
        details = 'Please contact support if this issue persists.';
      } else {
        description = error;
      }
    } else if (responseData?.detail) {
      const detail = responseData.detail;
      
      if (detail.includes('Incorrect email or password') || detail.includes('Invalid credentials')) {
        title = 'Invalid Credentials';
        description = 'The email or password you entered is incorrect.';
        details = `Email: ${formData.email}\n\nDouble-check your email and password. Remember that passwords are case-sensitive.`;
        type = 'warning';
      } else if (detail.includes('account not found') || detail.includes('user not found')) {
        title = 'Account Not Found';
        description = 'No account found with this email address.';
        details = `Email: ${formData.email}\n\nWould you like to create a new account instead?`;
        type = 'warning';
      } else if (detail.includes('account disabled') || detail.includes('inactive')) {
        title = 'Account Disabled';
        description = 'Your account has been temporarily disabled.';
        details = 'Please contact support to reactivate your account.';
      } else if (detail.includes('too many attempts') || detail.includes('rate limit')) {
        title = 'Too Many Attempts';
        description = 'Too many failed login attempts.';
        details = 'Please wait a few minutes before trying again or reset your password.';
      } else {
        description = detail;
        details = 'Please contact support if this issue persists.';
      }
    } else if (error.name) {
      title = `${error.name}`;
      description = error.message || 'An unexpected error occurred.';
      details = 'Please check your internet connection and try again.';
    } else {
      description = 'Unable to connect to the authentication server.';
      details = 'Please check your internet connection and try again.';
    }

    return { title, description, details, type };
  };

  const showErrorDialog = (error: any, responseData?: any) => {
    const errorInfo = parseLoginError(error, responseData);
    setDialogContent({
      title: errorInfo.title,
      description: errorInfo.description,
      details: errorInfo.details,
      type: errorInfo.type
    });
    setErrorDialogOpen(true);
  };

  const showSuccessDialog = (userData: any) => {
    setDialogContent({
      title: 'Login Successful! 🎉',
      description: `Welcome back, ${userData.name || 'User'}!`,
      details: 'You have successfully logged in to OpsFlow Guardian. Redirecting to your dashboard...',
      type: 'success'
    });
    setSuccessDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate input
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://ops-backend-production-7ddf.up.railway.app/api/v1/auth/login-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Store the authentication token
        localStorage.setItem('opsflow_auth_token', data.access_token);
        
        // Show success dialog
        showSuccessDialog(data);
        
      } else {
        // Show error dialog with comprehensive error handling
        showErrorDialog(data.detail || 'Login failed', data);
      }
    } catch (err) {
      console.error('Login error:', err);
      showErrorDialog(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      setError('');
      
      await googleAuthService.signIn();
    } catch (err) {
      console.error('Google OAuth failed:', err);
      showErrorDialog(
        err instanceof Error 
          ? err.message 
          : 'Google authentication failed. Please try again.'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    // Navigate to dashboard after success dialog is closed
    navigate('/dashboard');
  };

  const handleGoToSignup = () => {
    setErrorDialogOpen(false);
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    setErrorDialogOpen(false);
    toast({
      title: "Password Reset",
      description: "Password reset functionality coming soon!",
      duration: 3000,
    });
  };

  const getDialogIcon = () => {
    switch (dialogContent.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        if (dialogContent.title.includes('Invalid Credentials')) {
          return <Key className="w-6 h-6 text-yellow-500" />;
        } else if (dialogContent.title.includes('Account Not Found')) {
          return <UserX className="w-6 h-6 text-yellow-500" />;
        }
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'error':
      default:
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Dashboard */}
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="mb-4 gap-2 text-foreground-muted hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Login Card */}
        <Card className="glass-card border-border-hover">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-foreground-muted">
              Sign in to your OpsFlow Guardian account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google OAuth Button */}
            <Button
              onClick={handleGoogleAuth}
              variant="outline"
              size="lg"
              className="w-full glass-button gap-3 border-border-hover hover:border-primary"
              disabled={isLoading || isGoogleLoading}
            >
              <Chrome className="w-5 h-5" />
              {isGoogleLoading ? 'Connecting with Google...' : 'Sign in with Google'}
            </Button>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-card px-4 text-sm text-foreground-muted">or</span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="bg-error/10 border-error text-error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-background-subtle border-border-hover focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-background-subtle border-border-hover focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-foreground-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    className="text-primary hover:text-primary-accent transition-colors"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full glass-button-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center text-sm text-foreground-muted">
              Don't have an account?{' '}
              <button
                className="text-primary hover:text-primary-accent transition-colors font-medium"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-foreground-muted">
          <p>© 2024 OpsFlow Guardian. All rights reserved.</p>
          <p className="mt-1">
            Secure enterprise workflow automation platform
          </p>
        </div>
      </div>

      {/* Error Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {getDialogIcon()}
              <AlertDialogTitle className="text-lg font-semibold">
                {dialogContent.title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left space-y-3">
              <p className="text-base text-foreground">
                {dialogContent.description}
              </p>
              {dialogContent.details && (
                <div className="p-3 bg-muted rounded-lg border">
                  <p className="text-sm font-mono whitespace-pre-line text-muted-foreground">
                    {dialogContent.details}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            {dialogContent.type === 'warning' && dialogContent.title.includes('Account Not Found') ? (
              <>
                <AlertDialogCancel onClick={handleErrorDialogClose}>
                  Try Different Email
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleGoToSignup}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Create Account
                </AlertDialogAction>
              </>
            ) : dialogContent.type === 'warning' && dialogContent.title.includes('Invalid Credentials') ? (
              <>
                <AlertDialogCancel onClick={handleErrorDialogClose}>
                  Try Again
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleForgotPassword}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Reset Password
                </AlertDialogAction>
              </>
            ) : (
              <>
                <AlertDialogCancel onClick={handleErrorDialogClose}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleErrorDialogClose}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Try Again
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              {getDialogIcon()}
              <AlertDialogTitle className="text-lg font-semibold text-green-600">
                {dialogContent.title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-left space-y-3">
              <p className="text-base text-foreground">
                {dialogContent.description}
              </p>
              {dialogContent.details && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    {dialogContent.details}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={handleSuccessDialogClose}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              Continue to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
