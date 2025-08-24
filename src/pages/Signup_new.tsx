import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowLeft, User, Building, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Signup() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Dialog states
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: '',
    description: '',
    details: '',
    type: 'error' as 'error' | 'success' | 'warning'
  });

  // Professional error message parser
  const parseErrorMessage = (error: any, responseData?: any) => {
    let title = 'Registration Failed';
    let description = '';
    let details = '';
    let type: 'error' | 'warning' = 'error';

    if (typeof error === 'string') {
      // Handle string errors
      if (error.includes('duplicate key value violates unique constraint "users_email_key"')) {
        title = 'Account Already Exists';
        description = 'An account with this email address already exists in our system.';
        details = `Email: ${formData.email}\n\nWould you like to sign in instead?`;
        type = 'warning';
      } else if (error.includes('password')) {
        title = 'Password Requirements Not Met';
        description = 'Your password does not meet our security requirements.';
        details = 'Password must be at least 8 characters with uppercase, lowercase, and numbers.';
      } else {
        description = error;
      }
    } else if (responseData?.detail) {
      // Handle API response errors
      const detail = responseData.detail;
      
      if (detail.includes('duplicate key') || detail.includes('already exists') || detail.includes('UniqueViolation')) {
        title = 'Account Already Exists';
        description = 'An account with this email address is already registered.';
        details = `Email: ${formData.email}\n\nThis email is already associated with an existing account. Would you like to sign in instead?`;
        type = 'warning';
      } else if (detail.includes('validation')) {
        title = 'Validation Error';
        description = 'Please check your input and try again.';
        details = detail;
      } else if (detail.includes('password')) {
        title = 'Password Error';
        description = 'There was an issue with your password.';
        details = detail;
      } else if (detail.includes('email')) {
        title = 'Email Error';
        description = 'There was an issue with your email address.';
        details = detail;
      } else {
        description = detail;
        details = 'Please contact support if this issue persists.';
      }
    } else if (error.name) {
      // Handle JavaScript Error objects
      title = `${error.name}`;
      description = error.message || 'An unexpected error occurred.';
      details = 'Please try again or contact support if the issue persists.';
    } else {
      // Generic error handling
      description = 'An unexpected error occurred during registration.';
      details = 'Please check your internet connection and try again.';
    }

    return { title, description, details, type };
  };

  const showErrorDialog = (error: any, responseData?: any) => {
    const errorInfo = parseErrorMessage(error, responseData);
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
      title: 'Account Created Successfully! 🎉',
      description: `Welcome to OpsFlow Guardian, ${userData.name}!`,
      details: 'Your account has been created and you\'re now logged in. Let\'s set up your company profile to get personalized automation suggestions.',
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

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://ops-backend-production-7ddf.up.railway.app/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.id) {
        // Mark as first-time user for onboarding
        localStorage.setItem('opsflow-first-time-user', 'true');
        localStorage.removeItem('opsflow-onboarding-completed'); // Ensure onboarding will show
        
        // Store authentication token if provided
        if (data.access_token) {
          localStorage.setItem('opsflow_auth_token', data.access_token);
        } else {
          // Generate mock token for development
          const mockToken = 'new-user-token-' + Date.now() + Math.random().toString(36);
          localStorage.setItem('opsflow_auth_token', mockToken);
        }
        
        // Show success dialog instead of alert
        showSuccessDialog(data);
        
      } else {
        // Show error dialog with comprehensive error handling
        showErrorDialog(data.detail || 'Registration failed', data);
      }
    } catch (err) {
      console.error('Registration error:', err);
      showErrorDialog(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = 'ops-backend-production-7ddf.up.railway.app/api/v1/auth/oauth/google';
    } catch (error) {
      console.error('Google OAuth failed:', error);
      showErrorDialog('Google authentication failed');
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

  const handleGoToLogin = () => {
    setErrorDialogOpen(false);
    navigate('/login');
  };

  const getDialogIcon = () => {
    switch (dialogContent.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
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

        {/* Signup Card */}
        <Card className="glass-card border-border-hover">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-foreground-muted">
              Join OpsFlow Guardian and automate your workflows
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google OAuth Button */}
            <Button
              onClick={handleGoogleAuth}
              variant="outline"
              size="lg"
              className="w-full glass-button gap-3 border-border-hover hover:border-primary"
            >
              <Chrome className="w-5 h-5" />
              Sign up with Google
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

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 bg-background-subtle border-border-hover focus:border-primary"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a strong password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-background-subtle border-border-hover focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-foreground-muted hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-foreground-muted leading-relaxed cursor-pointer"
                >
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-primary hover:text-primary-accent transition-colors underline"
                    onClick={() => toast({
                      title: "Terms of Service",
                      description: "Opening Terms of Service...",
                      duration: 3000,
                    })}
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    className="text-primary hover:text-primary-accent transition-colors underline"
                    onClick={() => toast({
                      title: "Privacy Policy",
                      description: "Opening Privacy Policy...",
                      duration: 3000,
                    })}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full glass-button-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center text-sm text-foreground-muted">
              Already have an account?{' '}
              <button
                className="text-primary hover:text-primary-accent transition-colors font-medium"
                onClick={() => navigate('/login')}
              >
                Sign in
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
            {dialogContent.type === 'warning' && dialogContent.title.includes('Account Already Exists') ? (
              <>
                <AlertDialogCancel onClick={handleErrorDialogClose}>
                  Try Different Email
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleGoToLogin}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Sign In Instead
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
              Continue to Setup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
