import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Settings as SettingsIcon, Shield, Zap, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Settings = () => {
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
            { icon: Shield, title: 'Security Settings', desc: 'Manage authentication and access controls' },
            { icon: Zap, title: 'Agent Configuration', desc: 'Configure multi-agent system parameters' },
            { icon: Bell, title: 'Notifications', desc: 'Setup alerts and notification preferences' },
            { icon: SettingsIcon, title: 'System Preferences', desc: 'General system and UI settings' }
          ].map((setting, i) => (
            <Card key={i} className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <setting.icon className="w-5 h-5 text-primary" />
                  {setting.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground-muted mb-4">{setting.desc}</p>
                <Button variant="outline" className="glass-button">
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

export default Settings;