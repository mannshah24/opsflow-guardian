import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Shield,
  Info,
  ExternalLink,
  Loader2,
  Send
} from 'lucide-react';

interface EmailConfig {
  id: number;
  email_address: string;
  from_name: string;
  email_host: string;
  email_port: number;
  email_use_tls: boolean;
  is_verified: boolean;
  is_active: boolean;
  created_at: string | null;
  last_tested: string | null;
}

interface EmailTestResult {
  success: boolean;
  message: string;
  tested_at: string;
}

export const EmailConfiguration: React.FC = () => {
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [formData, setFormData] = useState({
    email_address: '',
    app_password: '',
    from_name: '',
    email_host: 'smtp.gmail.com',
    email_port: 587,
    email_use_tls: true
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadEmailConfig();
  }, []);

  const loadEmailConfig = async () => {
    try {
      const response = await fetch('/api/v1/email-config/status');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        if (data) {
          setFormData({
            ...formData,
            email_address: data.email_address,
            from_name: data.from_name,
            email_host: data.email_host,
            email_port: data.email_port,
            email_use_tls: data.email_use_tls
          });
        }
      }
    } catch (error) {
      console.error('Failed to load email config:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/email-config/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "✅ Email Configured Successfully",
          description: "Your email settings have been saved. Don't forget to test your configuration!",
        });
        setIsEditing(false);
        loadEmailConfig();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save email configuration');
      }
    } catch (error) {
      toast({
        title: "❌ Configuration Failed",
        description: error instanceof Error ? error.message : "Failed to save email settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/email-config/test', {
        method: 'POST'
      });

      const result: EmailTestResult = await response.json();

      if (result.success) {
        toast({
          title: "🎉 Test Email Sent",
          description: "Check your inbox! Your email configuration is working perfectly.",
        });
        loadEmailConfig(); // Reload to get updated verification status
      } else {
        toast({
          title: "❌ Test Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Test Failed",
        description: "Failed to test email configuration. Please check your settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your email configuration? This will disable email notifications.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/email-config/remove', {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Email Configuration Removed",
          description: "Your email settings have been removed. Email notifications are now disabled.",
        });
        setConfig(null);
        setFormData({
          email_address: '',
          app_password: '',
          from_name: '',
          email_host: 'smtp.gmail.com',
          email_port: 587,
          email_use_tls: true
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Remove Configuration",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!config && !isEditing) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Personal Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Mail className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Configure Your Email</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Set up your own Gmail account to send workflow notifications. All emails will come from your address, 
              not a shared system account.
            </p>
            
            <Alert className="mb-6 text-left max-w-md mx-auto">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Why personal email?</strong> Each user configures their own email credentials for security, 
                compliance, and professional appearance.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button onClick={() => setIsEditing(true)} size="lg" className="min-w-[200px]">
                <Settings className="h-4 w-4 mr-2" />
                Configure My Email
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowInstructions(!showInstructions)}
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Gmail Setup Guide
              </Button>
            </div>

            {showInstructions && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left max-w-md mx-auto">
                <h4 className="font-semibold text-blue-900 mb-3">📋 Quick Setup Steps:</h4>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Enable 2-Factor Auth on your Gmail</li>
                  <li>Go to Google Account → Security → App passwords</li>
                  <li>Generate a "Mail" app password</li>
                  <li>Copy the 16-character password</li>
                  <li>Use it in the configuration below</li>
                </ol>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Personal Email Configuration
            {config?.is_verified && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {config && !config.is_verified && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Tested
              </Badge>
            )}
          </div>
          
          {config && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {!isEditing && config ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Email Address</Label>
                <p className="font-medium text-lg">{config.email_address}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Display Name</Label>
                <p className="font-medium">{config.from_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-gray-600">SMTP Server</Label>
                <p className="text-sm">{config.email_host}:{config.email_port}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Security</Label>
                <p className="text-sm">{config.email_use_tls ? 'TLS Enabled' : 'No TLS'}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Last Tested</Label>
                <p className="text-sm">
                  {config.last_tested 
                    ? new Date(config.last_tested).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>🔒 Secure:</strong> Your email password is encrypted and stored securely. 
                All workflow notifications will be sent from your personal email address.
              </AlertDescription>
            </Alert>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleTest} disabled={loading} variant="default">
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Testing...' : 'Send Test Email'}
              </Button>
              
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Edit Settings
              </Button>
              
              <Button variant="destructive" onClick={handleRemove} size="sm">
                Remove Configuration
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {showInstructions && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Need help?</strong> You need a Gmail App Password (16 characters) - not your regular Gmail password. 
                  <a 
                    href="https://myaccount.google.com/apppasswords" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Get it here →
                  </a>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Gmail Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email_address}
                  onChange={(e) => setFormData({...formData, email_address: e.target.value})}
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="from-name">Display Name *</Label>
                <Input
                  id="from-name"
                  value={formData.from_name}
                  onChange={(e) => setFormData({...formData, from_name: e.target.value})}
                  placeholder="Your Name - Company"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This appears in the "From" field of emails</p>
              </div>
            </div>

            <div>
              <Label htmlFor="app-password">Gmail App Password *</Label>
              <Input
                id="app-password"
                type="password"
                value={formData.app_password}
                onChange={(e) => setFormData({...formData, app_password: e.target.value})}
                placeholder="abcd efgh ijkl mnop (16 characters)"
                required
                maxLength={20}
              />
              <p className="text-sm text-blue-600 mt-1">
                🔗 <a 
                  href="https://myaccount.google.com/apppasswords" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Generate App Password at Google Account Settings
                </a>
              </p>
            </div>

            <details className="border rounded-lg p-4">
              <summary className="cursor-pointer font-medium">Advanced Settings (Optional)</summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="host">SMTP Host</Label>
                  <Input
                    id="host"
                    value={formData.email_host}
                    onChange={(e) => setFormData({...formData, email_host: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="port">SMTP Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.email_port}
                    onChange={(e) => setFormData({...formData, email_port: parseInt(e.target.value) || 587})}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="use-tls"
                    checked={formData.email_use_tls}
                    onChange={(e) => setFormData({...formData, email_use_tls: e.target.checked})}
                  />
                  <Label htmlFor="use-tls">Use TLS</Label>
                </div>
              </div>
            </details>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Saving...' : 'Save Configuration'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  if (config) {
                    setFormData({
                      ...formData,
                      email_address: config.email_address,
                      from_name: config.from_name,
                      email_host: config.email_host,
                      email_port: config.email_port,
                      email_use_tls: config.email_use_tls
                    });
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
