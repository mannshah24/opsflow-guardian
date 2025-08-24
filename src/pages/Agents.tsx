import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { 
  Bot, 
  Brain, 
  Zap, 
  Shield, 
  Settings,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Loader2,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { apiService, type Agent } from '@/services/api';

const getAgentIcon = (role: string) => {
  switch (role.toLowerCase()) {
    case 'planner':
      return Brain;
    case 'executor':
      return Zap;
    case 'auditor':
    case 'audit':
      return Shield;
    default:
      return Bot;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'working':
      return 'default';
    case 'idle':
      return 'secondary';
    case 'error':
      return 'destructive';
    case 'offline':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return CheckCircle;
    case 'working':
      return Activity;
    case 'idle':
      return Clock;
    case 'error':
      return AlertTriangle;
    case 'offline':
      return AlertTriangle;
    default:
      return Clock;
  }
};

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [deployLoading, setDeployLoading] = useState(false);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'automation'
  });
  
  const { toast } = useToast();

  const handleDeployAgent = async () => {
    if (!newAgent.name.trim() || !newAgent.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setDeployLoading(true);
    try {
      const deployedAgent = await apiService.deployAgent({
        name: newAgent.name,
        description: newAgent.description,
        type: newAgent.type
      });

      if (deployedAgent) {
        toast({
          title: "Agent Deployed Successfully!",
          description: `${newAgent.name} has been deployed and is now active`,
        });
        
        // Reset form and close dialog
        setNewAgent({ name: '', description: '', type: 'automation' });
        setShowDeployDialog(false);
        
        // Refresh agents data
        const agentsData = await apiService.getAgents();
        setAgents(agentsData);
        
        // Select the newly deployed agent if it's the first one
        if (agentsData.length === 1) {
          setSelectedAgent(agentsData[0]);
        }
      }
    } catch (error: any) {
      console.error('Failed to deploy agent:', error);
      
      // Check if it's an authentication error
      if (error.message && error.message.includes('Authentication required')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create agents. Redirecting to login page...",
          variant: "destructive",
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeployLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentsData = await apiService.getAgents();
        setAgents(agentsData);
        if (agentsData.length > 0) {
          setSelectedAgent(agentsData[0]);
        }
      } catch (error) {
        console.error('Failed to fetch agents data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-foreground-muted">Loading agents data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Agent Monitor</h1>
            <p className="text-foreground-muted mt-1 text-sm sm:text-base">
              Real-time monitoring of intelligent workflow agents
            </p>
          </div>
          <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
            <DialogTrigger asChild>
              <Button className="glass-button shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-0">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  Deploy New Agent
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Data Processing Agent"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Agent Type</Label>
                  <Select value={newAgent.type} onValueChange={(value) => setNewAgent(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="glass-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automation">Automation Agent</SelectItem>
                      <SelectItem value="planner">Planning Agent</SelectItem>
                      <SelectItem value="executor">Execution Agent</SelectItem>
                      <SelectItem value="auditor">Audit Agent</SelectItem>
                      <SelectItem value="monitoring">Monitoring Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this agent will do..."
                    value={newAgent.description}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-input min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowDeployDialog(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={deployLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeployAgent}
                    className="flex-1 bg-primary hover:bg-primary-dark"
                    disabled={deployLoading}
                  >
                    {deployLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Bot className="w-4 h-4 mr-2" />
                        Deploy Agent
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Agent Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Active Agents</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {agents.filter(a => a.status === 'active' || a.status === 'working').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-success/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Success Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {agents.length > 0 ? 
                      `${(agents.reduce((sum, a) => sum + a.success_rate, 0) / agents.length).toFixed(1)}%` : 
                      '0%'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-info/20 rounded-lg">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Total Tasks</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {agents.reduce((sum, a) => sum + a.tasks_completed, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-warning/20 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Avg Response</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {agents.length > 0 
                      ? `${(agents.reduce((acc, agent) => acc + (agent.avg_response_time || 0), 0) / agents.length).toFixed(1)}s`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {agents.length === 0 ? (
          <Card className="glass-card border-0">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No Agents Available
                </h3>
                <p className="text-sm text-foreground-muted">
                  Start the backend server to see your intelligent agents in action
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Agent List */}
            <div className="lg:col-span-1">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Agent Fleet</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2 p-3 sm:p-4">
                    {agents.map((agent) => {
                      const IconComponent = getAgentIcon(agent.role);
                      const StatusIcon = getStatusIcon(agent.status);
                      
                      return (
                        <div
                          key={agent.id}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-background/50",
                            selectedAgent?.id === agent.id ? "bg-primary/10 border-primary/50" : "border-border/50"
                          )}
                          onClick={() => setSelectedAgent(agent)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                              <IconComponent className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-medium text-card-foreground truncate">
                                  {agent.name}
                                </h3>
                                <Badge variant={getStatusColor(agent.status) as any} className="text-xs">
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {agent.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-foreground-muted mt-1 truncate">
                                {agent.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-foreground-muted">
                                  {agent.tasks_completed} tasks completed
                                </span>
                                <span className="text-xs font-medium text-success">
                                  {agent.success_rate.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agent Details */}
            <div className="lg:col-span-2">
              {selectedAgent ? (
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 glass-card">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card className="glass-card border-0">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const IconComponent = getAgentIcon(selectedAgent.role);
                              return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />;
                            })()}
                            <div>
                              <CardTitle className="text-lg sm:text-xl">{selectedAgent.name}</CardTitle>
                              <p className="text-sm text-foreground-muted">{selectedAgent.role} agent</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="glass-button text-xs sm:text-sm">
                              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Configure
                            </Button>
                            <Button size="sm" className="glass-button text-xs sm:text-sm">
                              <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Monitor
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-card-foreground mb-2">Status</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant={getStatusColor(selectedAgent.status) as any}>
                                  {(() => {
                                    const StatusIcon = getStatusIcon(selectedAgent.status);
                                    return <StatusIcon className="w-3 h-3 mr-1" />;
                                  })()}
                                  {selectedAgent.status}
                                </Badge>
                                {selectedAgent.current_task && (
                                  <span className="text-sm text-info">
                                    Working on: {selectedAgent.current_task}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-card-foreground mb-2">Performance</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-foreground-muted">Tasks Completed</span>
                                  <span className="font-medium">{selectedAgent.tasks_completed}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-foreground-muted">Success Rate</span>
                                  <span className="font-medium text-success">{selectedAgent.success_rate.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-foreground-muted">Last Active</span>
                                  <span className="font-medium">{new Date(selectedAgent.last_active).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-card-foreground mb-2">Description</h4>
                              <p className="text-sm text-foreground-muted">{selectedAgent.description}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <Card className="glass-card border-0">
                      <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                          <h3 className="font-medium text-card-foreground mb-2">
                            Real-time Performance Monitoring
                          </h3>
                          <p className="text-sm text-foreground-muted">
                            Detailed performance metrics will be displayed here when available
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="capabilities" className="space-y-4">
                    <Card className="glass-card border-0">
                      <CardHeader>
                        <CardTitle>Agent Capabilities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          {selectedAgent.capabilities.map((capability) => (
                            <div key={capability} className="flex items-center gap-3 p-3 bg-background/30 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span className="text-sm font-medium text-card-foreground">
                                {capability.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="glass-card border-0">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Bot className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium text-card-foreground mb-2">
                        Select an Agent
                      </h3>
                      <p className="text-sm text-foreground-muted">
                        Choose an agent from the list to view detailed information
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Agents;
