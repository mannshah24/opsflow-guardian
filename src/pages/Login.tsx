import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mail, Lock, Eye, EyeOff, Chrome, ArrowLeft } from 'lucide-react';

export default function Login() {
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember_me: false
        }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Store tokens
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        alert(`✅ Login successful! Welcome ${data.user.first_name} ${data.user.last_name}`);
        
        // In real app, redirect to dashboard
        window.location.href = '/';
      } else {
        setError(data.detail || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
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
        
        alert(`✅ Google OAuth successful! Welcome ${data.user.first_name}`);
        // In real app, redirect to dashboard
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

        {/* Login Card */}
        <Card className="glass-card border-border-hover">
          <CardHeader className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
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
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
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
                    placeholder="Enter your email"
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-foreground-muted">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-primary hover:text-primary-accent transition-colors"
                  onClick={() => alert('🔄 Opening password reset...')}
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full glass-button-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center text-sm text-foreground-muted">
              Don't have an account?{' '}
              <button
                className="text-primary hover:text-primary-accent transition-colors font-medium"
                onClick={() => alert('🔗 Redirecting to signup...')}
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
    </div>
  );
}
