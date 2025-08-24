import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BarChart3, TrendingUp, Activity, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService, type AnalyticsData } from '@/services/api';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiService.getAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Refresh analytics every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-foreground-muted">Loading analytics data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = analyticsData ? [
    { icon: BarChart3, label: 'Total Workflows', value: (analyticsData.totalWorkflows || 0).toLocaleString(), color: 'primary' },
    { icon: TrendingUp, label: 'Success Rate', value: `${(analyticsData.successRate || 0).toFixed(1)}%`, color: 'success' },
    { icon: Activity, label: 'Avg Execution', value: analyticsData.avgExecutionTime || '0m', color: 'info' },
    { icon: Clock, label: 'Time Saved', value: analyticsData.timeSaved || '0h', color: 'secondary' }
  ] : [];

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
          {stats.map((stat, i) => (
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
            {analyticsData && analyticsData.recentActivity.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-card-foreground">Recent Activity</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analyticsData.recentActivity.map((event, index) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        event.severity === 'critical' ? 'bg-destructive' :
                        event.severity === 'error' ? 'bg-warning' :
                        event.severity === 'warning' ? 'bg-info' :
                        'bg-success'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {event.event_type}
                        </p>
                        <p className="text-xs text-foreground-muted truncate">
                          {event.action}
                        </p>
                      </div>
                      <span className="text-xs text-foreground-muted whitespace-nowrap">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  {loading ? 'Loading Analytics...' : 
                   analyticsData ? 'No Recent Activity' : 'Analytics Dashboard Ready'}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {loading ? 'Fetching real-time performance data...' :
                   analyticsData ? 'Start using workflows to see analytics data here' :
                   'Real-time workflow metrics and performance insights'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;