import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { 
  Workflow, 
  Plus, 
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Copy,
  Trash2,
  Filter,
  Search,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const workflowTemplates = [
  {
    id: 'template-001',
    name: 'Employee Onboarding',
    description: 'Complete new employee setup with accounts, access, and documentation',
    category: 'HR',
    estimatedTime: '5-8 minutes',
    tools: ['Gmail', 'Slack', 'GitHub', 'Notion', 'Calendar'],
    steps: 6,
    popularity: 95
  },
  {
    id: 'template-002', 
    name: 'Vendor Onboarding',
    description: 'Streamlined vendor setup with contracts, folders, and communication',
    category: 'Procurement',
    estimatedTime: '3-5 minutes', 
    tools: ['Google Drive', 'DocuSign', 'Slack', 'Notion'],
    steps: 4,
    popularity: 87
  },
  {
    id: 'template-003',
    name: 'Incident Response',
    description: 'Automated incident management with notifications and tracking',
    category: 'DevOps',
    estimatedTime: '1-2 minutes',
    tools: ['PagerDuty', 'Slack', 'Jira', 'StatusPage'],
    steps: 5,
    popularity: 78
  },
  {
    id: 'template-004',
    name: 'Customer Onboarding',
    description: 'Welcome new customers with setup guides and support channels',
    category: 'Customer Success',
    estimatedTime: '4-6 minutes',
    tools: ['HubSpot', 'Intercom', 'Calendly', 'Notion'],
    steps: 7,
    popularity: 92
  }
];

const activeWorkflows = [
  {
    id: 'wf-001',
    name: 'Employee Onboarding: Sarah Chen',
    template: 'Employee Onboarding',
    status: 'running',
    progress: 65,
    startTime: '2024-01-15 14:30:00',
    estimatedCompletion: '2 minutes',
    currentStep: 'Creating development environment',
    assignedAgent: 'Executor Agent',
    tools: ['GitHub', 'Slack'],
    priority: 'medium'
  },
  {
    id: 'wf-002',
    name: 'Vendor Setup: Acme Corp',
    template: 'Vendor Onboarding', 
    status: 'waiting_approval',
    progress: 0,
    startTime: '2024-01-15 14:28:00',
    estimatedCompletion: '4 minutes',
    currentStep: 'Waiting for approval',
    assignedAgent: 'Planner Agent',
    tools: ['Google Drive', 'DocuSign', 'Slack'],
    priority: 'high'
  },
  {
    id: 'wf-003',
    name: 'Database Incident #1247',
    template: 'Incident Response',
    status: 'completed',
    progress: 100,
    startTime: '2024-01-15 13:45:00',
    completedTime: '2024-01-15 13:47:00',
    currentStep: 'Completed successfully',
    assignedAgent: 'Executor Agent', 
    tools: ['PagerDuty', 'Slack', 'Jira'],
    priority: 'critical'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running': return 'bg-primary/20 text-primary';
    case 'waiting_approval': return 'bg-warning/20 text-warning';
    case 'completed': return 'bg-success/20 text-success';
    case 'failed': return 'bg-error/20 text-error';
    case 'paused': return 'bg-gray-500/20 text-gray-500';
    default: return 'bg-gray-500/20 text-gray-500';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-error/20 text-error';
    case 'high': return 'bg-warning/20 text-warning';
    case 'medium': return 'bg-info/20 text-info';
    case 'low': return 'bg-success/20 text-success';
    default: return 'bg-gray-500/20 text-gray-500';
  }
};

const Workflows = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = workflowTemplates.filter(template =>
    (selectedCategory === 'all' || template.category === selectedCategory) &&
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['all', ...Array.from(new Set(workflowTemplates.map(t => t.category)))];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Workflow Management</h1>
            <p className="text-foreground-muted mt-1">
              Create, monitor, and manage automated workflows with Portia agents
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass-button gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button className="bg-primary hover:bg-primary-dark gap-2">
              <Plus className="w-4 h-4" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Workflow className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Active Workflows</p>
                  <p className="text-2xl font-bold text-card-foreground">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Completed Today</p>
                  <p className="text-2xl font-bold text-card-foreground">47</p>
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
                  <p className="text-sm text-foreground-muted">Avg Duration</p>
                  <p className="text-2xl font-bold text-card-foreground">3.2m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-foreground-muted">Success Rate</p>
                  <p className="text-2xl font-bold text-card-foreground">98.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Workflows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6 mt-6">
            {/* Active Workflows */}
            <div className="space-y-4">
              {activeWorkflows.map((workflow) => (
                <Card key={workflow.id} className="glass-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {workflow.name}
                          </h3>
                          <Badge className={getStatusColor(workflow.status)}>
                            {workflow.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(workflow.priority)}>
                            {workflow.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground-muted mb-2">
                          Template: {workflow.template}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-foreground-muted">
                          <span>Started: {workflow.startTime}</span>
                          <span>Agent: {workflow.assignedAgent}</span>
                          {workflow.status === 'running' && (
                            <span>Est. completion: {workflow.estimatedCompletion}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="glass-button">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {workflow.status === 'running' ? (
                          <Button variant="outline" size="sm" className="glass-button">
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : workflow.status === 'waiting_approval' ? (
                          <Button size="sm" className="bg-primary hover:bg-primary-dark">
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="glass-button">
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    {workflow.status === 'running' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground-muted">{workflow.currentStep}</span>
                          <span className="text-card-foreground">{workflow.progress}%</span>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                      </div>
                    )}

                    {/* Tools */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {workflow.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                      {workflow.status === 'completed' && workflow.completedTime && (
                        <span className="text-xs text-success">
                          Completed: {workflow.completedTime}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6 mt-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  placeholder="Search workflow templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "" : "glass-button"}
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="glass-card border-0 hover:border-primary/50 transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-foreground-muted">Popularity</div>
                        <div className="text-sm font-medium text-card-foreground">
                          {template.popularity}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground-muted mb-4">
                      {template.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground-muted">Estimated Time:</span>
                        <span className="text-card-foreground">{template.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground-muted">Steps:</span>
                        <span className="text-card-foreground">{template.steps}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs text-foreground-muted mb-2">Tools:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.tools.slice(0, 3).map((tool) => (
                          <Badge key={tool} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                        {template.tools.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tools.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-primary hover:bg-primary-dark">
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm" className="glass-button">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6 mt-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Workflow Builder</CardTitle>
                <p className="text-sm text-foreground-muted">
                  Create custom workflows with drag-and-drop interface
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Workflow className="w-16 h-16 text-foreground-muted mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-card-foreground mb-2">
                    Visual Workflow Builder Coming Soon
                  </h3>
                  <p className="text-sm text-foreground-muted mb-6 max-w-md mx-auto">
                    Design complex workflows with our intuitive drag-and-drop interface. 
                    Connect tools, set conditions, and create powerful automations.
                  </p>
                  <Button className="bg-primary hover:bg-primary-dark">
                    Request Early Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Workflows;