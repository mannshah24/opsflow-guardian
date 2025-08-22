import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const pendingApprovals = [
  {
    id: 'ap-001',
    title: 'Employee Onboarding: Sarah Chen',
    description: 'Create accounts, setup development environment, and schedule orientation',
    requestedBy: 'HR Team',
    riskLevel: 'low',
    estimatedTime: '5 minutes',
    tools: ['Gmail', 'GitHub', 'Slack', 'Calendar'],
    steps: [
      'Create sarah.chen@company.com email account',
      'Add to "Engineering" and "New Hires" Slack channels',
      'Create GitHub account and add to repositories',
      'Schedule orientation meeting for Monday 9 AM'
    ],
    timestamp: '2 minutes ago'
  },
  {
    id: 'ap-002',
    title: 'Incident Response: Database Connection Issue',
    description: 'Execute emergency database failover and notify stakeholders',
    requestedBy: 'System Monitor',
    riskLevel: 'high',
    estimatedTime: '2 minutes',
    tools: ['AWS Console', 'PagerDuty', 'Slack', 'Jira'],
    steps: [
      'Switch to backup database server',
      'Create critical incident ticket in Jira',
      'Send alert to on-call engineers via PagerDuty',
      'Post status update in #incidents Slack channel'
    ],
    timestamp: '30 seconds ago'
  }
];

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low': return 'text-success bg-success/20';
    case 'medium': return 'text-warning bg-warning/20';
    case 'high': return 'text-error bg-error/20';
    default: return 'text-foreground-muted bg-background-subtle';
  }
};

export const ApprovalCenter = () => {
  const handleApprove = (id: string) => {
    console.log('Approved:', id);
    // Handle approval logic
  };

  const handleReject = (id: string) => {
    console.log('Rejected:', id);
    // Handle rejection logic  
  };

  return (
    <Card className="glass-card border-0 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-warning flex-shrink-0" />
          <span className="truncate">Pending Approvals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingApprovals.map((approval) => (
          <div key={approval.id} className="glass-card p-4 rounded-lg border border-border-hover">
            {/* Header */}
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-card-foreground mb-1 text-sm sm:text-base truncate">
                  {approval.title}
                </h3>
                <p className="text-xs sm:text-sm text-foreground-muted mb-2 line-clamp-2">
                  {approval.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-foreground-muted">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{approval.requestedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>{approval.timestamp}</span>
                  </div>
                </div>
              </div>
              <Badge className={cn(getRiskColor(approval.riskLevel), "border-0 text-xs shrink-0")}>
                {approval.riskLevel === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {approval.riskLevel} risk
              </Badge>
            </div>

            {/* Execution Plan */}
            <div className="glass-card p-3 rounded bg-background-subtle/50 mb-3">
              <h4 className="text-xs font-medium text-card-foreground mb-2">Execution Plan</h4>
              <div className="space-y-1">
                {approval.steps.slice(0, 2).map((step, index) => (
                  <div key={index} className="text-xs text-foreground-muted flex items-start gap-2">
                    <span className="text-primary font-medium flex-shrink-0">{index + 1}.</span>
                    <span className="line-clamp-2">{step}</span>
                  </div>
                ))}
                {approval.steps.length > 2 && (
                  <div className="text-xs text-foreground-muted ml-4">
                    +{approval.steps.length - 2} more steps
                  </div>
                )}
              </div>
            </div>

            {/* Tools and Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div className="flex flex-wrap gap-1">
                {approval.tools.slice(0, 3).map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs">
                    {tool}
                  </Badge>
                ))}
                {approval.tools.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{approval.tools.length - 3}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-foreground-muted">
                Est. {approval.estimatedTime}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="sm:flex-1 glass-button gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Review Details</span>
                <span className="sm:hidden">Review</span>
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReject(approval.id)}
                  className="glass-button text-error border-error/50 hover:bg-error/10 flex-1 sm:flex-none"
                >
                  <XCircle className="w-4 h-4 sm:mr-0" />
                  <span className="sm:hidden ml-2">Reject</span>
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleApprove(approval.id)}
                  className={cn(
                    "bg-success hover:bg-success/90 text-white flex-1 sm:flex-none",
                    approval.riskLevel === 'high' ? 'animate-glow' : ''
                  )}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        ))}

        {pendingApprovals.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
            <p className="text-foreground-muted">No pending approvals</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};