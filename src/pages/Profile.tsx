import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Key,
  ArrowLeft,
  Save,
  RefreshCw,
  Chrome,
  Github,
  Linkedin
} from 'lucide-react';

interface UserProfile {
  id?: number;
  fullName: string;
  email: string;
  organization: string;
  role: string;
  avatar: string;
  joined: string;
  isActive?: boolean;
}

interface NotificationSettings {
  workflowUpdates: boolean;
  approvalRequests: boolean;
  systemAlerts: boolean;
  emailDigest: boolean;
  pushNotifications: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
  connectedAccounts: {
    google: boolean;
    github: boolean;
    linkedin: boolean;
  };
}

export default function Profile() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    organization: '',
    role: 'User',
    avatar: '',
    joined: ''
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          // Redirect to login if no token
          window.location.href = '/login';
          return;
        }

        const response = await fetch('http://localhost:8001/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setProfile({
            id: userData.id,
            fullName: userData.name || '',
            email: userData.email || '',
            organization: 'OpsFlow Guardian', // Default organization
            role: userData.is_active ? 'Active User' : 'Inactive User',
            avatar: '',
            joined: 'Recently', // We could format created_at if available
            isActive: userData.is_active
          });
        } else if (response.status === 401) {
          // Token is invalid, redirect to login
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, []);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    workflowUpdates: true,
    approvalRequests: true,
    systemAlerts: true,
    emailDigest: false,
    pushNotifications: true
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: '24',
    loginAlerts: true,
    connectedAccounts: {
      google: true,
      github: false,
      linkedin: false
    }
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }

      // For now, we'll just simulate the update since we don't have a user update endpoint yet
      // In a real implementation, you would call your backend API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Profile updated successfully!');
      console.log('Profile data that would be sent:', {
        fullName: profile.fullName,
        email: profile.email,
        organization: profile.organization,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleNotificationUpdate = async (setting: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [setting]: value }));
    
    // Auto-save notification preferences
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Notification settings updated');
    } catch (error) {
      console.error('Failed to update notification settings');
    }
  };

  const handleSecurityUpdate = async (setting: string, value: any) => {
    if (setting === 'twoFactorEnabled' || setting === 'loginAlerts') {
      setSecurity(prev => ({ ...prev, [setting]: value }));
    } else if (setting === 'sessionTimeout') {
      setSecurity(prev => ({ ...prev, sessionTimeout: value }));
    }

    // Auto-save security preferences
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Security settings updated');
    } catch (error) {
      console.error('Failed to update security settings');
    }
  };

  const handleConnectAccount = (provider: keyof SecuritySettings['connectedAccounts']) => {
    const isConnected = security.connectedAccounts[provider];
    if (isConnected) {
      if (confirm(`Disconnect ${provider}?`)) {
        setSecurity(prev => ({
          ...prev,
          connectedAccounts: { ...prev.connectedAccounts, [provider]: false }
        }));
      }
    } else {
      alert(`🔗 Connecting to ${provider}... (OAuth integration would be implemented here)`);
      setSecurity(prev => ({
        ...prev,
        connectedAccounts: { ...prev.connectedAccounts, [provider]: true }
      }));
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background-accent p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="gap-2 text-foreground-muted hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            {!isMobile && 'Back to Dashboard'}
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-foreground-muted text-sm sm:text-base">
              Manage your account preferences and security settings
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="bg-success/10 border-success text-success">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Profile Card */}
        <Card className="glass-card border-border-hover">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-primary">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-gradient-primary text-white text-xl">
                  {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold">
                  {profile.fullName || 'Loading...'}
                </h2>
                <p className="text-foreground-muted">{profile.email}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                  <Badge variant="secondary">{profile.role}</Badge>
                  <Badge variant="outline">{profile.organization}</Badge>
                  <Badge variant="outline">Joined {profile.joined}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              {!isMobile && 'Profile'}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              {!isMobile && 'Notifications'}
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              {!isMobile && 'Security'}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              {!isMobile && 'Appearance'}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="glass-card border-border-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your profile information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading profile...</span>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                        className="bg-background-subtle border-border-hover"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 bg-background-subtle border-border-hover"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
                        <Input
                          id="organization"
                          value={profile.organization}
                          onChange={(e) => setProfile(prev => ({ ...prev, organization: e.target.value }))}
                          className="pl-10 bg-background-subtle border-border-hover"
                          placeholder="Enter your organization"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="glass-button-primary gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="glass-card border-border-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Workflow Updates</Label>
                      <p className="text-sm text-foreground-muted">
                        Get notified when workflows change status
                      </p>
                    </div>
                    <Switch
                      checked={notifications.workflowUpdates}
                      onCheckedChange={(checked) => handleNotificationUpdate('workflowUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Approval Requests</Label>
                      <p className="text-sm text-foreground-muted">
                        Receive notifications for pending approvals
                      </p>
                    </div>
                    <Switch
                      checked={notifications.approvalRequests}
                      onCheckedChange={(checked) => handleNotificationUpdate('approvalRequests', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Alerts</Label>
                      <p className="text-sm text-foreground-muted">
                        Important system notifications and updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.systemAlerts}
                      onCheckedChange={(checked) => handleNotificationUpdate('systemAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Digest</Label>
                      <p className="text-sm text-foreground-muted">
                        Daily summary of your workflow activity
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailDigest}
                      onCheckedChange={(checked) => handleNotificationUpdate('emailDigest', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-foreground-muted">
                        Browser notifications for urgent items
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Account Security */}
              <Card className="glass-card border-border-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Manage your security settings and authentication methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-foreground-muted">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSecurityUpdate('twoFactorEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-foreground-muted">
                        Get notified of new login attempts
                      </p>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => handleSecurityUpdate('loginAlerts', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="1"
                      max="168"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityUpdate('sessionTimeout', e.target.value)}
                      className="w-24 bg-background-subtle border-border-hover"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Connected Accounts */}
              <Card className="glass-card border-border-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Connected Accounts
                  </CardTitle>
                  <CardDescription>
                    Manage your connected OAuth providers and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Chrome className="w-5 h-5 text-primary" />
                      <div>
                        <Label>Google</Label>
                        <p className="text-sm text-foreground-muted">
                          Gmail integration for workflow emails
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={security.connectedAccounts.google ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleConnectAccount('google')}
                    >
                      {security.connectedAccounts.google ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5" />
                      <div>
                        <Label>GitHub</Label>
                        <p className="text-sm text-foreground-muted">
                          Repository integration for code workflows
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={security.connectedAccounts.github ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleConnectAccount('github')}
                    >
                      {security.connectedAccounts.github ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <div>
                        <Label>LinkedIn</Label>
                        <p className="text-sm text-foreground-muted">
                          Professional network integration
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={security.connectedAccounts.linkedin ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => handleConnectAccount('linkedin')}
                    >
                      {security.connectedAccounts.linkedin ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="glass-card border-border-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-12">
                  <Palette className="w-12 h-12 mx-auto text-foreground-muted mb-4" />
                  <h3 className="text-lg font-medium mb-2">Theme Customization</h3>
                  <p className="text-foreground-muted mb-6">
                    Advanced theming options will be available in the next update
                  </p>
                  <Button variant="outline" className="glass-button">
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
