import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useIsMobile } from '@/hooks/use-mobile';
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
  BarChart3,
  MoreVertical,
  Bot,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const filteredWorkflows = activeWorkflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedStatus === 'all' || workflow.status === selectedStatus)
  );

  const handleStartWorkflow = (id: string) => {
    console.log('Starting workflow:', id);
    // Add actual workflow start logic here
    alert(`Starting workflow ${id}`);
  };

  const handlePauseWorkflow = (id: string) => {
    console.log('Pausing workflow:', id);
    alert(`Pausing workflow ${id}`);
  };

  const handleStopWorkflow = (id: string) => {
    console.log('Stopping workflow:', id);
    alert(`Stopping workflow ${id}`);
  };

  const handleEditWorkflow = (id: string) => {
    console.log('Editing workflow:', id);
    alert(`Editing workflow ${id}`);
  };

  const handleCopyWorkflow = (id: string) => {
    console.log('Copying workflow:', id);
    alert(`Copying workflow ${id}`);
  };

  const handleDeleteWorkflow = (id: string) => {
    console.log('Deleting workflow:', id);
    if (confirm('Are you sure you want to delete this workflow?')) {
      alert(`Deleted workflow ${id}`);
    }
  };

  const handleViewDetails = (id: string) => {
    console.log('Viewing workflow details:', id);
    setSelectedWorkflow(selectedWorkflow === id ? null : id);
  };

  const handleCreateWorkflow = () => {
    console.log('Creating new workflow');
    alert('Opening workflow creation wizard...');
  };

  const statusFilters = ['all', 'running', 'paused', 'completed', 'failed'];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Workflow Management</h1>
            <p className="text-foreground-muted mt-1 text-sm sm:text-base">
              Monitor and manage your automated workflows with real-time insights
            </p>
          </div>
          <Button 
            onClick={handleCreateWorkflow}
            className="bg-primary hover:bg-primary-dark text-white gap-2 w-full sm:w-auto"
            size={isMobile ? "default" : "default"}
          >
            <Plus className="w-4 h-4" />
            {isMobile ? "New Workflow" : "Create Workflow"}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted">Running</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">
                    {activeWorkflows.filter(w => w.status === 'running').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-success/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted">Completed</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">
                    {activeWorkflows.filter(w => w.status === 'completed').length}
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
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted">Pending</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">
                    {activeWorkflows.filter(w => w.status === 'waiting_approval').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-info/20 rounded-lg">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted">Success Rate</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {statusFilters.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className={`${selectedStatus === status ? "" : "glass-button"} whitespace-nowrap`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="glass-card border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                        <Workflow className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-card-foreground text-sm sm:text-base truncate">
                          {workflow.name}
                        </h3>
                        <p className="text-xs text-foreground-muted">{workflow.template}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(workflow.id)}
                      className="glass-button p-2"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="glass-button p-2"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Status and Progress */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(workflow.priority)}>
                      {workflow.priority}
                    </Badge>
                  </div>

                  {workflow.status === 'running' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground-muted">Progress</span>
                        <span className="text-card-foreground font-medium">{workflow.progress}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                    </div>
                  )}

                  <div className="text-xs text-foreground-muted">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" />
                      Started: {workflow.startTime}
                    </div>
                    {workflow.estimatedCompletion && (
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" />
                        ETA: {workflow.estimatedCompletion}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      {workflow.assignedAgent}
                    </div>
                  </div>
                </div>

                {/* Current Step */}
                <div className="glass-card p-3 rounded-lg mb-4 bg-background-subtle/50">
                  <p className="text-xs font-medium text-card-foreground mb-1">Current Step</p>
                  <p className="text-xs text-foreground-muted">{workflow.currentStep}</p>
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {workflow.tools.map((tool) => (
                    <Badge key={tool} variant="outline" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {workflow.status === 'running' ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePauseWorkflow(workflow.id)}
                        className="glass-button text-warning border-warning/50 hover:bg-warning/10 flex-1"
                      >
                        <Pause className="w-3 h-3 mr-1" />
                        Pause
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStopWorkflow(workflow.id)}
                        className="glass-button text-error border-error/50 hover:bg-error/10 flex-1"
                      >
                        <Square className="w-3 h-3 mr-1" />
                        Stop
                      </Button>
                    </>
                  ) : workflow.status === 'paused' ? (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleStartWorkflow(workflow.id)}
                        className="bg-primary hover:bg-primary-dark text-white flex-1"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Resume
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStopWorkflow(workflow.id)}
                        className="glass-button text-error border-error/50 hover:bg-error/10"
                      >
                        <Square className="w-3 h-3" />
                      </Button>
                    </>
                  ) : workflow.status === 'completed' ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyWorkflow(workflow.id)}
                        className="glass-button flex-1"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Clone
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditWorkflow(workflow.id)}
                        className="glass-button"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleStartWorkflow(workflow.id)}
                      className="bg-success hover:bg-success/90 text-white w-full"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Start Workflow
                    </Button>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedWorkflow === workflow.id && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                    <div className="glass-card p-3 rounded-lg bg-background-subtle/30">
                      <h4 className="text-xs font-medium text-card-foreground mb-2">Workflow Details</h4>
                      <div className="space-y-1 text-xs text-foreground-muted">
                        <div>ID: {workflow.id}</div>
                        <div>Template: {workflow.template}</div>
                        <div>Agent: {workflow.assignedAgent}</div>
                        {workflow.completedTime && (
                          <div>Completed: {workflow.completedTime}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && (
          <Card className="glass-card border-0">
            <CardContent className="p-12 text-center">
              <Workflow className="w-16 h-16 text-foreground-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                No workflows found
              </h3>
              <p className="text-sm text-foreground-muted mb-6">
                {searchQuery ? 'Try adjusting your search or filters.' : 'Create your first workflow to get started.'}
              </p>
              <Button 
                onClick={handleCreateWorkflow}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Workflows;