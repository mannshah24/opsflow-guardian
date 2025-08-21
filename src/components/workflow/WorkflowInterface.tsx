import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Send,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const workflows = [
  {
    id: 'wf-001',
    title: 'Vendor Onboarding: Acme Corp',
    status: 'running',
    progress: 65,
    steps: [
      { name: 'Create folder structure', status: 'completed' },
      { name: 'Setup Notion workspace', status: 'running' },
      { name: 'Send welcome email', status: 'pending' },
      { name: 'Schedule onboarding call', status: 'pending' }
    ],
    estimatedTime: '2 min remaining',
    tools: ['Google Drive', 'Notion', 'Gmail', 'Calendar']
  },
  {
    id: 'wf-002',
    title: 'Employee Onboarding: Sarah Chen',
    status: 'waiting_approval',
    progress: 0,
    steps: [
      { name: 'Create email account', status: 'pending' },
      { name: 'Setup development environment', status: 'pending' },
      { name: 'Add to Slack channels', status: 'pending' },
      { name: 'Schedule orientation', status: 'pending' }
    ],
    estimatedTime: '5 min estimated',
    tools: ['Gmail', 'GitHub', 'Slack', 'Calendar']
  }
];

export const WorkflowInterface = () => {
  const [newWorkflow, setNewWorkflow] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWorkflow = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreating(false);
    setNewWorkflow('');
  };

  return (
    <Card className="glass-card border-0 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Active Workflows
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Workflow Creation */}
        <div className="glass-card p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-card-foreground">Create New Workflow</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Describe what you want to automate..."
              value={newWorkflow}
              onChange={(e) => setNewWorkflow(e.target.value)}
              className="flex-1"
              disabled={isCreating}
            />
            <Button 
              onClick={handleCreateWorkflow} 
              disabled={!newWorkflow.trim() || isCreating}
              className="bg-primary hover:bg-primary-dark"
            >
              {isCreating ? (
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
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {workflow.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={workflow.status === 'running' ? 'default' : 'secondary'}
                      className={workflow.status === 'running' ? 'bg-primary/20 text-primary' : 
                               workflow.status === 'waiting_approval' ? 'bg-warning/20 text-warning' : ''}
                    >
                      {workflow.status === 'running' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      {workflow.status === 'waiting_approval' && <Clock className="w-3 h-3 mr-1" />}
                      {workflow.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-foreground-muted">
                      {workflow.estimatedTime}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="glass-button">
                    {workflow.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {workflow.status === 'running' && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-foreground-muted mb-1">
                    <span>Progress</span>
                    <span>{workflow.progress}%</span>
                  </div>
                  <div className="w-full bg-background-subtle rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300 animate-shimmer"
                      style={{ width: `${workflow.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="space-y-2 mb-4">
                {workflow.steps.slice(0, 3).map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {step.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    {step.status === 'running' && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                    {step.status === 'pending' && (
                      <div className="w-4 h-4 rounded-full border-2 border-border"></div>
                    )}
                    <span className={step.status === 'completed' ? 'text-success' : 
                                   step.status === 'running' ? 'text-primary' : 'text-foreground-muted'}>
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
                {workflow.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs">
                    {tool}
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