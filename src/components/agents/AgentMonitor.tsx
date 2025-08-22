import React, { useState, useEffect } from 'react';
import { Bot, Brain, Zap, Shield, Activity, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { apiService, type Agent } from '@/services/api';

export const AgentMonitor = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agentsData = await apiService.getAgents();
        setAgents(agentsData);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
        // Keep empty array if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
    // Refresh every 10 seconds
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, []);

  const getAgentIcon = (name: string) => {
    if (name.toLowerCase().includes('planner')) return Brain;
    if (name.toLowerCase().includes('executor')) return Zap;
    if (name.toLowerCase().includes('auditor') || name.toLowerCase().includes('compliance')) return Shield;
    return Bot;
  };

  const getAgentColor = (name: string) => {
    if (name.toLowerCase().includes('planner')) return 'text-primary';
    if (name.toLowerCase().includes('executor')) return 'text-secondary';
    if (name.toLowerCase().includes('auditor') || name.toLowerCase().includes('compliance')) return 'text-info';
    return 'text-primary';
  };

  if (loading) {
    return (
      <Card className="glass-card border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <span className="truncate">Multi-Agent System Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-foreground-muted">Loading agent status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (agents.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <span className="truncate">Multi-Agent System Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Bot className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-card-foreground mb-2">No Agents Active</h3>
          <p className="text-sm text-foreground-muted">
            Agent system is currently inactive. Check system configuration.
          </p>
        </CardContent>
      </Card>
    );
  }

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
          {agents.map((agent) => {
            const AgentIcon = getAgentIcon(agent.name);
            const agentColor = getAgentColor(agent.name);
            
            return (
              <div key={agent.id} className="glass-card p-4 rounded-lg border border-border-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('p-2 rounded-lg bg-background-subtle flex-shrink-0', agentColor)}>
                    <AgentIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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
                    {agent.current_task || 'No active task'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground-muted">Tasks completed</span>
                    <span className="font-medium text-card-foreground">
                      {agent.tasks_completed}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground-muted">Success rate</span>
                    <span className="font-medium text-card-foreground">
                      {agent.success_rate}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground-muted">Avg response time</span>
                    <span className="font-medium text-card-foreground">
                      {agent.avg_response_time}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground-muted">Last active</span>
                    <span className="font-medium text-card-foreground">
                      {new Date(agent.last_active).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};