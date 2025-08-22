import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  User,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { apiService, type Approval } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low': return 'text-success bg-success/20';
    case 'medium': return 'text-warning bg-warning/20';
    case 'high': return 'text-error bg-error/20';
    default: return 'text-foreground-muted bg-background-subtle';
  }
};

export const ApprovalCenter = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const approvalsData = await apiService.getApprovals();
        // Filter for pending approvals only
        setApprovals(approvalsData.filter(a => a.status === 'pending'));
      } catch (error) {
        console.error('Failed to fetch approvals:', error);
        // Keep empty array if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
    // Refresh every 10 seconds
    const interval = setInterval(fetchApprovals, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      // This would call an API to approve the request
      // await apiService.approveRequest(id);
      
      // Update local state optimistically
      setApprovals(prev => prev.filter(a => a.id !== id));
      
      toast({
        title: "Request approved",
        description: "The workflow request has been approved and will begin execution.",
      });
    } catch (error) {
      console.error('Failed to approve request:', error);
      toast({
        title: "Approval failed",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      // This would call an API to reject the request
      // await apiService.rejectRequest(id);
      
      // Update local state optimistically
      setApprovals(prev => prev.filter(a => a.id !== id));
      
      toast({
        title: "Request rejected",
        description: "The workflow request has been rejected.",
      });
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast({
        title: "Rejection failed",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      });
    }
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-foreground-muted">Loading approvals...</p>
            </div>
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
            <p className="text-foreground-muted">No pending approvals</p>
          </div>
        ) : (
          approvals.map((approval) => (
            <div key={approval.id} className="glass-card p-4 rounded-lg border border-border-hover">
              {/* Header */}
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground mb-1 text-sm sm:text-base truncate">
                    {approval.workflow_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground-muted mb-2 line-clamp-2">
                    Workflow approval required for execution
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-foreground-muted">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{approval.requested_by}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{new Date(approval.request_date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Badge className={cn(getRiskColor(approval.risk_assessment.level), "border-0 text-xs")}>
                    {approval.risk_assessment.level === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {approval.risk_assessment.level} risk
                  </Badge>
                  <Badge variant={approval.priority === 'urgent' ? 'destructive' : 'outline'} className="text-xs">
                    {approval.priority} priority
                  </Badge>
                </div>
              </div>

              {/* Execution Plan */}
              <div className="glass-card p-3 rounded bg-background-subtle/50 mb-3">
                <h4 className="text-xs font-medium text-card-foreground mb-2">Steps Requiring Approval</h4>
                <div className="space-y-1">
                  {approval.steps_requiring_approval.slice(0, 2).map((step, index) => (
                    <div key={step.id} className="text-xs text-foreground-muted flex items-start gap-2">
                      <span className="text-primary font-medium flex-shrink-0">{index + 1}.</span>
                      <span className="line-clamp-2">{step.name}: {step.description}</span>
                    </div>
                  ))}
                  {approval.steps_requiring_approval.length > 2 && (
                    <div className="text-xs text-foreground-muted ml-4">
                      +{approval.steps_requiring_approval.length - 2} more steps
                    </div>
                  )}
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex flex-wrap gap-1">
                  {approval.risk_assessment.factors.slice(0, 3).map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                  {approval.risk_assessment.factors.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{approval.risk_assessment.factors.length - 3}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-foreground-muted">
                  Priority: {approval.priority}
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
                      approval.risk_assessment.level === 'high' ? 'animate-glow' : ''
                    )}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};