import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BarChart3, TrendingUp, Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Analytics Dashboard</h1>
          <p className="text-foreground-muted mt-1">
            Comprehensive insights into workflow performance and agent efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, label: 'Total Workflows', value: '2,847', color: 'primary' },
            { icon: TrendingUp, label: 'Success Rate', value: '98.7%', color: 'success' },
            { icon: Activity, label: 'Avg Execution', value: '3.2m', color: 'info' },
            { icon: Clock, label: 'Time Saved', value: '247h', color: 'secondary' }
          ].map((stat, i) => (
            <Card key={i} className="glass-card border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${stat.color}/20 rounded-lg`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-foreground-muted">{stat.label}</p>
                    <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                Advanced Analytics Dashboard
              </h3>
              <p className="text-sm text-foreground-muted">
                Detailed workflow metrics and performance insights coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;