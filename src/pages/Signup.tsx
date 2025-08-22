import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowLeft, User, Building } from 'lucide-react';

export default function Signup() {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          organization: formData.organization,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          agreed_to_terms: agreedToTerms
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Store tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        alert(`✅ Account created successfully! Welcome ${data.user.first_name} ${data.user.last_name}`);
        
        // In real app, redirect to dashboard
        window.location.href = '/';
      } else {
        setError(data.detail || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/auth/oauth/google');
      const data = await response.json();
      
      if (data.access_token) {
        // Store tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        alert(`✅ Google OAuth signup successful! Welcome ${data.user.first_name}`);
        // In real app, redirect to dashboard
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Google OAuth failed:', error);
      setError('Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/';
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
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-background-subtle border-border-hover focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-background-subtle border-border-hover focus:border-primary"
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
                <Label htmlFor="organization">Organization</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
                  <Input
                    id="organization"
                    name="organization"
                    placeholder="Your Company Name"
                    value={formData.organization}
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
                    onClick={() => alert('📋 Opening Terms of Service...')}
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    className="text-primary hover:text-primary-accent transition-colors underline"
                    onClick={() => alert('🔒 Opening Privacy Policy...')}
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
                onClick={() => alert('🔗 Redirecting to login...')}
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
    </div>
  );
}
