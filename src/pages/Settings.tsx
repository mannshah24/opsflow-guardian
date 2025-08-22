import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Settings as SettingsIcon, Shield, Zap, Bell, ArrowLeft, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
    setActiveSection(null);
  };

  const handleCancel = () => {
    setActiveSection(null);
  };

  const renderSettingsSection = () => {
    switch (activeSection) {
      case 'security':
        return <SecuritySettings onSave={handleSave} onCancel={handleCancel} />;
      case 'agent':
        return <AgentSettings onSave={handleSave} onCancel={handleCancel} />;
      case 'notifications':
        return <NotificationSettings onSave={handleSave} onCancel={handleCancel} />;
      case 'system':
        return <SystemSettings onSave={handleSave} onCancel={handleCancel} />;
      default:
        return null;
    }
  };

  if (activeSection) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="glass-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {activeSection === 'security' && 'Security Settings'}
                {activeSection === 'agent' && 'Agent Configuration'}
                {activeSection === 'notifications' && 'Notifications'}
                {activeSection === 'system' && 'System Preferences'}
              </h1>
              <p className="text-foreground-muted mt-1">
                Configure your OpsFlow Guardian system preferences
              </p>
            </div>
          </div>
          
          {renderSettingsSection()}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-foreground-muted mt-1">
            Configure your OpsFlow Guardian system preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              id: 'security',
              icon: Shield, 
              title: 'Security Settings', 
              desc: 'Manage authentication and access controls',
              status: 'Active'
            },
            { 
              id: 'agent',
              icon: Zap, 
              title: 'Agent Configuration', 
              desc: 'Configure multi-agent system parameters',
              status: 'Online'
            },
            { 
              id: 'notifications',
              icon: Bell, 
              title: 'Notifications', 
              desc: 'Setup alerts and notification preferences',
              status: 'Enabled'
            },
            { 
              id: 'system',
              icon: SettingsIcon, 
              title: 'System Preferences', 
              desc: 'General system and UI settings',
              status: 'Default'
            }
          ].map((setting) => (
            <Card key={setting.id} className="glass-card border-0 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <setting.icon className="w-5 h-5 text-primary" />
                    {setting.title}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {setting.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-muted mb-4">{setting.desc}</p>
                <Button 
                  variant="outline" 
                  className="glass-button w-full"
                  onClick={() => setActiveSection(setting.id)}
                >
                  Configure
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Settings Components
interface SettingsProps {
  onSave: () => void;
  onCancel: () => void;
}

const SecuritySettings: React.FC<SettingsProps> = ({ onSave, onCancel }) => {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            Authentication & Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" defaultValue="30" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="max-attempts">Max Login Attempts</Label>
              <Input id="max-attempts" defaultValue="5" className="mt-1" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mfa">Multi-Factor Authentication</Label>
              <p className="text-sm text-foreground-muted mt-1">Require 2FA for all users</p>
            </div>
            <Switch id="mfa" defaultChecked={false} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="audit-logs">Enhanced Audit Logging</Label>
              <p className="text-sm text-foreground-muted mt-1">Log all security-related events</p>
            </div>
            <Switch id="audit-logs" defaultChecked={true} />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-3">
        <Button onClick={onSave} className="glass-button">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="glass-button">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

const AgentSettings: React.FC<SettingsProps> = ({ onSave, onCancel }) => {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            Agent Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-agents">Maximum Active Agents</Label>
              <Input id="max-agents" defaultValue="10" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="timeout">Agent Timeout (seconds)</Label>
              <Input id="timeout" defaultValue="300" className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="agent-config">Agent Configuration JSON</Label>
            <Textarea 
              id="agent-config" 
              defaultValue={`{
  "plannerAgent": {
    "maxRetries": 3,
    "priority": "high"
  },
  "executorAgent": {
    "maxRetries": 2,
    "priority": "medium"
  },
  "auditorAgent": {
    "maxRetries": 1,
    "priority": "low"
  }
}`}
              className="mt-1 h-40 font-mono text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-scaling">Auto-scaling</Label>
              <p className="text-sm text-foreground-muted mt-1">Automatically scale agents based on workload</p>
            </div>
            <Switch id="auto-scaling" defaultChecked={true} />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-3">
        <Button onClick={onSave} className="glass-button">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="glass-button">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC<SettingsProps> = ({ onSave, onCancel }) => {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" defaultValue="admin@company.com" className="mt-1" />
          </div>
          <div className="space-y-3">
            <Label>Notification Types</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="workflow-complete">Workflow Completion</Label>
                <Switch id="workflow-complete" defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="approval-required">Approval Required</Label>
                <Switch id="approval-required" defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="agent-failure">Agent Failure</Label>
                <Switch id="agent-failure" defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="security-alerts">Security Alerts</Label>
                <Switch id="security-alerts" defaultChecked={true} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
              <Input id="quiet-hours-start" type="time" defaultValue="22:00" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
              <Input id="quiet-hours-end" type="time" defaultValue="08:00" className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-3">
        <Button onClick={onSave} className="glass-button">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="glass-button">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

const SystemSettings: React.FC<SettingsProps> = ({ onSave, onCancel }) => {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 text-primary" />
            System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <select 
                id="theme" 
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                defaultValue="dark"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <select 
                id="language" 
                className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="refresh-rate">Auto-refresh Rate (seconds)</Label>
              <Input id="refresh-rate" defaultValue="30" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="max-logs">Maximum Log Entries</Label>
              <Input id="max-logs" defaultValue="1000" className="mt-1" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="debug-mode">Debug Mode</Label>
              <Switch id="debug-mode" defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Usage Analytics</Label>
              <Switch id="analytics" defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">Auto Backup</Label>
              <Switch id="auto-backup" defaultChecked={true} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-3">
        <Button onClick={onSave} className="glass-button">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="glass-button">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Settings;