import React from 'react';
import { Bot, Brain, Zap, Shield, Activity, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const agents = [
  {
    name: 'Planner Agent',
    icon: Brain,
    status: 'active',
    description: 'Analyzing workflow requests and generating execution plans',
    currentTask: 'Processing vendor onboarding for Acme Corp',
    metrics: { tasksCompleted: 127, successRate: 98.5, avgTime: '2.3s' },
    color: 'text-primary'
  },
  {
    name: 'Executor Agent', 
    icon: Zap,
    status: 'active',
    description: 'Executing approved workflows with multi-tool orchestration',
    currentTask: 'Creating Google Drive folders and Notion workspace',
    metrics: { tasksCompleted: 89, successRate: 99.1, avgTime: '45s' },
    color: 'text-secondary'
  },
  {
    name: 'Auditor Agent',
    icon: Shield,
    status: 'monitoring',
    description: 'Maintaining audit trails and compliance monitoring',
    currentTask: 'Logging execution steps and validating permissions',
    metrics: { eventsLogged: 1847, complianceScore: 100, alertsRaised: 0 },
    color: 'text-info'
  }
];

export const AgentMonitor = () => {
  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
          <span className="truncate">Multi-Agent System Monitor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {agents.map((agent) => (
            <div key={agent.name} className="glass-card p-4 rounded-lg border border-border-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn('p-2 rounded-lg bg-background-subtle flex-shrink-0', agent.color)}>
                  <agent.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground truncate text-sm sm:text-base">
                    {agent.name}
                  </h3>
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={cn(
                      "text-xs mt-1",
                      agent.status === 'active' ? 'bg-success/20 text-success' : ''
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></div>
                    {agent.status}
                  </Badge>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-foreground-muted mb-3 line-clamp-2">
                {agent.description}
              </p>

              <div className="glass-card p-3 rounded bg-background-subtle/50 mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium">Current Task</span>
                </div>
                <p className="text-xs text-foreground-muted line-clamp-2">
                  {agent.currentTask}
                </p>
              </div>

              <div className="space-y-2">
                {Object.entries(agent.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-foreground-muted capitalize truncate">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <span className="font-medium text-card-foreground flex-shrink-0">
                      {typeof value === 'number' && key.includes('Rate') ? `${value}%` : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};