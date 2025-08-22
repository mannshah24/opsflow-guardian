import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Send,
  Loader2,
  ArrowLeft,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { apiService, type Workflow } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface WorkflowInterfaceProps {
  onBack?: () => void;
  onWorkflowCreated?: (description: string) => Promise<void>;
}

export const WorkflowInterface: React.FC<WorkflowInterfaceProps> = ({ 
  onBack, 
  onWorkflowCreated 
}) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const workflowsData = await apiService.getWorkflows();
        // Show only running workflows in the interface
        setWorkflows(workflowsData.filter(w => w.status === 'running' || w.status === 'pending'));
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
    const interval = setInterval(fetchWorkflows, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateWorkflow = async () => {
    if (!newWorkflowDescription.trim()) {
      toast({
        title: "Description required",
        description: "Please describe what you want to automate",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      if (onWorkflowCreated) {
        await onWorkflowCreated(newWorkflowDescription.trim());
      } else {
        // Fallback: create workflow directly
        await apiService.createWorkflow(newWorkflowDescription.trim());
        
        // Refresh workflows
        const workflowsData = await apiService.getWorkflows();
        setWorkflows(workflowsData.filter(w => w.status === 'running' || w.status === 'pending'));
        
        toast({
          title: "Workflow created!",
          description: "Your workflow has been created and is ready for execution.",
        });
      }
      setNewWorkflowDescription('');
    } catch (error) {
      console.error('Failed to create workflow:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="glass-card border-0 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
          <span className="truncate">Active Workflows</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Quick Workflow Creation */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-card-foreground">Create New Workflow</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Describe what you want to automate..."
              value={newWorkflowDescription}
              onChange={(e) => setNewWorkflowDescription(e.target.value)}
              className="flex-1"
              disabled={creating}
            />
            <Button 
              onClick={handleCreateWorkflow} 
              disabled={!newWorkflowDescription.trim() || creating}
              className="bg-primary hover:bg-primary-dark shrink-0"
              size="sm"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Active Workflows */}
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="glass-card p-4 rounded-lg border border-border-hover">
              {/* Workflow Header */}
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground mb-1 truncate">
                    {workflow.name}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Badge 
                      variant={workflow.status === 'running' ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs",
                        workflow.status === 'running' ? 'bg-primary/20 text-primary' : 
                        workflow.status === 'pending' ? 'bg-warning/20 text-warning' : ''
                      )}
                    >
                      {workflow.status === 'running' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      {workflow.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {workflow.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-foreground-muted">
                      {Math.round(workflow.estimated_duration / 60)}m
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" className="glass-button p-2 h-auto">
                    {workflow.status === 'running' ? 
                      <Pause className="w-4 h-4" /> : 
                      <Play className="w-4 h-4" />
                    }
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {workflow.status === 'running' && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-foreground-muted mb-1">
                    <span>Progress</span>
                    <span>{Math.round(workflow.steps.filter(step => step.status === 'completed').length / workflow.steps.length * 100) || 0}%</span>
                  </div>
                  <div className="w-full bg-background-subtle rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300 animate-shimmer"
                      style={{ width: `${Math.round(workflow.steps.filter(step => step.status === 'completed').length / workflow.steps.length * 100) || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="space-y-2 mb-4">
                {workflow.steps.slice(0, 3).map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="flex-shrink-0">
                      {step.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                      {step.status === 'running' && (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      )}
                      {step.status === 'pending' && (
                        <div className="w-4 h-4 rounded-full border-2 border-border"></div>
                      )}
                    </div>
                    <span className={cn(
                      "truncate",
                      step.status === 'completed' ? 'text-success' : 
                      step.status === 'running' ? 'text-primary' : 'text-foreground-muted'
                    )}>
                      {step.name}
                    </span>
                  </div>
                ))}
                {workflow.steps.length > 3 && (
                  <div className="text-xs text-foreground-muted ml-6">
                    +{workflow.steps.length - 3} more steps
                  </div>
                )}
              </div>

              {/* Tools */}
              <div className="flex flex-wrap gap-1">
                {workflow.integrations_used.map((integration) => (
                  <Badge key={integration} variant="outline" className="text-xs">
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};