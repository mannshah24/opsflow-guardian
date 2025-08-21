import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { 
  Bot, 
  Brain, 
  Zap, 
  Shield, 
  Play,
  Pause, 
  Settings,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const agents = [
  {
    id: 'planner-001',
    name: 'Planner Agent',
    type: 'planner',
    icon: Brain,
    status: 'active',
    version: '2.1.0',
    description: 'Advanced workflow planning with risk assessment and tool orchestration',
    capabilities: ['Natural Language Processing', 'Risk Assessment', 'Tool Selection', 'Plan Generation'],
    metrics: {
      tasksProcessed: 1247,
      successRate: 98.5,
      avgResponseTime: '2.3s',
      uptime: 99.8
    },
    currentLoad: 75,
    lastActivity: '2 minutes ago',
    integrations: ['Portia Core', 'OpenAI GPT-4', 'Tool Registry'],
    performance: {
      cpu: 45,
      memory: 62,
      network: 23
    }
  },
  {
    id: 'executor-001',
    name: 'Executor Agent',
    type: 'executor', 
    icon: Zap,
    status: 'active',
    version: '2.0.8',
    description: 'Multi-tool orchestration and workflow execution with error handling',
    capabilities: ['API Integration', 'Parallel Execution', 'Error Recovery', 'State Management'],
    metrics: {
      tasksProcessed: 892,
      successRate: 99.1,
      avgResponseTime: '45s',
      uptime: 99.9
    },
    currentLoad: 42,
    lastActivity: '30 seconds ago',
    integrations: ['Google Workspace', 'Slack', 'Notion', 'GitHub', 'Jira'],
    performance: {
      cpu: 38,
      memory: 55,
      network: 78
    }
  },
  {
    id: 'auditor-001',
    name: 'Auditor Agent',
    type: 'auditor',
    icon: Shield,
    status: 'monitoring',
    version: '1.9.5',
    description: 'Compliance monitoring and immutable audit trail management',
    capabilities: ['Event Logging', 'Compliance Checking', 'Threat Detection', 'Report Generation'],
    metrics: {
      eventsLogged: 18947,
      alertsRaised: 3,
      complianceScore: 100,
      uptime: 100
    },
    currentLoad: 28,
    lastActivity: '1 minute ago',
    integrations: ['Security Framework', 'Compliance Engine', 'Alert System'],
    performance: {
      cpu: 22,
      memory: 31,
      network: 45
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-success/20 text-success';
    case 'monitoring': return 'bg-info/20 text-info';
    case 'idle': return 'bg-warning/20 text-warning';
    case 'error': return 'bg-error/20 text-error';
    default: return 'bg-gray-500/20 text-gray-500';
  }
};

const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Agent Management</h1>
            <p className="text-foreground-muted mt-1">
              Monitor and configure your Portia AI multi-agent system
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark gap-2">
            <Plus className="w-4 h-4" />
            Deploy New Agent
          </Button>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 rounded-lg">
                  <Bot className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Active Agents</p>
                  <p className="text-2xl font-bold text-card-foreground">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Tasks/Hour</p>
                  <p className="text-2xl font-bold text-card-foreground">147</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Success Rate</p>
                  <p className="text-2xl font-bold text-card-foreground">98.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/20 rounded-lg">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Avg Response</p>
                  <p className="text-2xl font-bold text-card-foreground">18s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Agent List */}
          <div className="xl:col-span-1">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Agent Fleet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedAgent.id === agent.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border-hover hover:border-primary/50 glass-card'
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        agent.type === 'planner' ? 'bg-primary/20' :
                        agent.type === 'executor' ? 'bg-secondary/20' :
                        'bg-info/20'
                      }`}>
                        <agent.icon className={`w-5 h-5 ${
                          agent.type === 'planner' ? 'text-primary' :
                          agent.type === 'executor' ? 'text-secondary' :
                          'text-info'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-card-foreground">{agent.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getStatusColor(agent.status)} text-xs`}>
                            {agent.status}
                          </Badge>
                          <span className="text-xs text-foreground-muted">
                            v{agent.version}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground-muted">Load</span>
                        <span className="text-card-foreground">{agent.currentLoad}%</span>
                      </div>
                      <Progress value={agent.currentLoad} className="h-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Agent Details */}
          <div className="xl:col-span-2">
            <Card className="glass-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedAgent.icon className="w-6 h-6 text-primary" />
                    <div>
                      <CardTitle>{selectedAgent.name}</CardTitle>
                      <p className="text-sm text-foreground-muted">{selectedAgent.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="glass-button">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="glass-button"
                    >
                      {selectedAgent.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(selectedAgent.metrics).map(([key, value]) => (
                        <div key={key} className="glass-card p-3 rounded-lg">
                          <p className="text-xs text-foreground-muted mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </p>
                          <p className="text-lg font-semibold text-card-foreground">
                            {typeof value === 'number' && key.includes('Rate') ? `${value}%` : 
                             typeof value === 'number' && key.includes('uptime') ? `${value}%` :
                             value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Integrations */}
                    <div>
                      <h3 className="font-medium text-card-foreground mb-3">Active Integrations</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.integrations.map((integration) => (
                          <Badge key={integration} variant="outline">
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="glass-card p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-card-foreground">System Status</span>
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      <p className="text-xs text-foreground-muted">
                        Last activity: {selectedAgent.lastActivity}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      {Object.entries(selectedAgent.performance).map(([metric, value]) => (
                        <div key={metric}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-foreground-muted capitalize">{metric}</span>
                            <span className="text-card-foreground">{value}%</span>
                          </div>
                          <Progress value={value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="capabilities" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedAgent.capabilities.map((capability) => (
                        <div key={capability} className="flex items-center gap-2 glass-card p-3 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm text-card-foreground">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="space-y-4 mt-6">
                    <div className="space-y-3">
                      {[
                        { time: '14:32:15', level: 'INFO', message: 'Workflow plan generated successfully' },
                        { time: '14:31:45', level: 'SUCCESS', message: 'Tool authentication completed' },
                        { time: '14:31:20', level: 'INFO', message: 'Processing new workflow request' },
                        { time: '14:30:55', level: 'WARNING', message: 'High load detected, scaling resources' }
                      ].map((log, index) => (
                        <div key={index} className="flex items-center gap-3 glass-card p-3 rounded-lg">
                          <span className="text-xs text-foreground-muted font-mono">{log.time}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              log.level === 'SUCCESS' ? 'text-success border-success' :
                              log.level === 'WARNING' ? 'text-warning border-warning' :
                              'text-info border-info'
                            }`}
                          >
                            {log.level}
                          </Badge>
                          <span className="text-sm text-card-foreground">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Agents;