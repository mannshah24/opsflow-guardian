import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Workflow, 
  Plus, 
  Play,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Search,
  Bot,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkflowInterface } from '@/components/workflow/WorkflowInterface';
import { apiService, type Workflow as WorkflowType } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Workflows = () => {
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null);
  const [showCreateInterface, setShowCreateInterface] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workflowsData, templatesData] = await Promise.all([
          apiService.getWorkflows(),
          apiService.getWorkflowTemplates()
        ]);
        
        setWorkflows(workflowsData);
        setTemplates(templatesData);
      } catch (error) {
        console.error('Failed to fetch workflows data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateWorkflow = async (description: string) => {
    try {
      setLoading(true);
      const newWorkflow = await apiService.createWorkflow(description);
      if (newWorkflow) {
        setWorkflows(prev => [newWorkflow, ...prev]);
        setSelectedWorkflow(newWorkflow);
        setShowCreateInterface(false);
        toast({
          title: "Workflow created successfully!",
          description: "Your workflow has been created and is ready for execution.",
        });
      }
    } catch (error) {
      console.error('Failed to create workflow:', error);
      toast({
        title: "Failed to create workflow",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return Activity;
      case 'completed': return CheckCircle;
      case 'failed': return AlertTriangle;
      case 'pending': return Clock;
      case 'approved': return Play;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'default';
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      default: return 'secondary';
    }
  };

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeWorkflows = filteredWorkflows.filter(w => 
    w.status === 'pending' || w.status === 'approved' || w.status === 'running'
  );
  const completedWorkflows = filteredWorkflows.filter(w => w.status === 'completed');
  const failedWorkflows = filteredWorkflows.filter(w => w.status === 'failed');

  if (loading && workflows.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-foreground-muted">Loading workflows data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (showCreateInterface) {
    return (
      <DashboardLayout>
        <WorkflowInterface 
          onBack={() => setShowCreateInterface(false)}
          onWorkflowCreated={handleCreateWorkflow}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Workflow Manager</h1>
            <p className="text-foreground-muted mt-1 text-sm sm:text-base">
              Orchestrate intelligent multi-agent workflows with real-time monitoring
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="glass-button shrink-0"
              onClick={() => setShowCreateInterface(true)}
            >
              <Bot className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button 
              className="glass-button shrink-0"
              onClick={() => setShowCreateInterface(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </div>

        {/* Workflow Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Active</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {activeWorkflows.length}
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
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {completedWorkflows.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-warning/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Failed</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {failedWorkflows.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-info/20 rounded-lg">
                  <Workflow className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {workflows.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
            <Input
              className="pl-10 glass-card border-border-hover bg-background/80"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {workflows.length === 0 ? (
          <Card className="glass-card border-0">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <Workflow className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No Workflows Yet
                </h3>
                <p className="text-sm text-foreground-muted mb-4">
                  Create your first intelligent workflow to automate complex tasks across multiple tools
                </p>
                <Button 
                  className="glass-button"
                  onClick={() => setShowCreateInterface(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="glass-card grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="active" className="text-xs sm:text-sm">
                Active ({activeWorkflows.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">
                Completed ({completedWorkflows.length})
              </TabsTrigger>
              <TabsTrigger value="failed" className="text-xs sm:text-sm">
                Failed ({failedWorkflows.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <div className="grid gap-3 sm:gap-4">
                {activeWorkflows.map((workflow) => (
                  <WorkflowCard 
                    key={workflow.id} 
                    workflow={workflow} 
                    onSelect={setSelectedWorkflow}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-3 sm:gap-4">
                {completedWorkflows.map((workflow) => (
                  <WorkflowCard 
                    key={workflow.id} 
                    workflow={workflow} 
                    onSelect={setSelectedWorkflow}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="failed" className="space-y-4">
              <div className="grid gap-3 sm:gap-4">
                {failedWorkflows.map((workflow) => (
                  <WorkflowCard 
                    key={workflow.id} 
                    workflow={workflow} 
                    onSelect={setSelectedWorkflow}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

interface WorkflowCardProps {
  workflow: WorkflowType;
  onSelect: (workflow: WorkflowType) => void;
  getStatusIcon: (status: string) => any;
  getStatusColor: (status: string) => string;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ 
  workflow, 
  onSelect, 
  getStatusIcon, 
  getStatusColor 
}) => {
  const StatusIcon = getStatusIcon(workflow.status);
  
  return (
    <Card className="glass-card border-border-hover hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => onSelect(workflow)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-card-foreground truncate">
                {workflow.name}
              </h3>
              <Badge variant={getStatusColor(workflow.status) as any} className="text-xs">
                <StatusIcon className="w-3 h-3 mr-1" />
                {workflow.status}
              </Badge>
            </div>
            
            <p className="text-sm text-foreground-muted mb-3 line-clamp-2">
              {workflow.description}
            </p>
            
            <div className="flex flex-wrap gap-2 text-xs text-foreground-muted">
              <span>Created: {new Date(workflow.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>Steps: {workflow.steps.length}</span>
              <span>•</span>
              <span>Risk: {workflow.risk_level}</span>
              {workflow.integrations_used.length > 0 && (
                <>
                  <span>•</span>
                  <span>Tools: {workflow.integrations_used.slice(0, 2).join(', ')}{workflow.integrations_used.length > 2 ? '...' : ''}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {workflow.approval_required && (
              <Badge variant="outline" className="text-xs">
                Approval Required
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Workflows;
