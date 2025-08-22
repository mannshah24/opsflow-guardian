import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  User,
  Shield,
  Search,
  CheckCheck,
  X,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService, type Approval } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Approvals = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const data = await apiService.getApprovals();
        setApprovals(data);
      } catch (error) {
        console.error('Failed to fetch approvals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
    const interval = setInterval(fetchApprovals, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (approvalId: string) => {
    try {
      const success = await apiService.approveWorkflow(approvalId);
      if (success) {
        setApprovals(prev => prev.map(a => 
          a.id === approvalId ? { ...a, status: 'approved' } : a
        ));
        toast({
          title: "Workflow approved successfully!",
          description: "The workflow has been approved and will proceed to execution.",
        });
      } else {
        toast({
          title: "Failed to approve workflow",
          description: "Please try again or contact support if the problem persists.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to approve workflow:', error);
      toast({
        title: "Failed to approve workflow",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (approvalId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const success = await apiService.rejectWorkflow(approvalId, reason);
      if (success) {
        setApprovals(prev => prev.map(a => 
          a.id === approvalId ? { ...a, status: 'rejected' } : a
        ));
        toast({
          title: "Workflow rejected successfully!",
          description: "The workflow has been rejected and will not proceed to execution.",
        });
      } else {
        toast({
          title: "Failed to reject workflow",
          description: "Please try again or contact support if the problem persists.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to reject workflow:', error);
      toast({
        title: "Failed to reject workflow",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const filteredApprovals = approvals.filter(approval => 
    approval.workflow_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    approval.requested_by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingApprovals = filteredApprovals.filter(a => a.status === 'pending');
  const approvedApprovals = filteredApprovals.filter(a => a.status === 'approved');
  const rejectedApprovals = filteredApprovals.filter(a => a.status === 'rejected');

  if (loading && approvals.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-foreground-muted">Loading approval requests...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Approval Center</h1>
            <p className="text-foreground-muted mt-1 text-sm sm:text-base">
              Review and approve workflow execution requests with risk assessment
            </p>
          </div>
        </div>

        {/* Approval Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-warning/20 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {pendingApprovals.length}
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
                  <p className="text-xs sm:text-sm text-foreground-muted">Approved</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {approvedApprovals.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-destructive/20 rounded-lg">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-foreground-muted">Rejected</p>
                  <p className="text-xl sm:text-2xl font-bold text-card-foreground">
                    {rejectedApprovals.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-foreground-muted" />
            <Input
              className="pl-10 glass-card border-border-hover bg-background/80"
              placeholder="Search approvals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {approvals.length === 0 ? (
          <Card className="glass-card border-0">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No Approval Requests
                </h3>
                <p className="text-sm text-foreground-muted">
                  Workflow approval requests will appear here when workflows require authorization
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="glass-card grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                Pending ({pendingApprovals.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm">
                Approved ({approvedApprovals.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs sm:text-sm">
                Rejected ({rejectedApprovals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <div className="grid gap-3 sm:gap-4">
                {pendingApprovals.map((approval) => (
                  <ApprovalCard 
                    key={approval.id} 
                    approval={approval} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getRiskColor={getRiskColor}
                    getPriorityColor={getPriorityColor}
                    showActions={true}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <div className="grid gap-3 sm:gap-4">
                {approvedApprovals.map((approval) => (
                  <ApprovalCard 
                    key={approval.id} 
                    approval={approval} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getRiskColor={getRiskColor}
                    getPriorityColor={getPriorityColor}
                    showActions={false}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <div className="grid gap-3 sm:gap-4">
                {rejectedApprovals.map((approval) => (
                  <ApprovalCard 
                    key={approval.id} 
                    approval={approval} 
                    onApprove={handleApprove}
                    onReject={handleReject}
                    getRiskColor={getRiskColor}
                    getPriorityColor={getPriorityColor}
                    showActions={false}
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

interface ApprovalCardProps {
  approval: Approval;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  getRiskColor: (risk: string) => string;
  getPriorityColor: (priority: string) => string;
  showActions: boolean;
}

const ApprovalCard: React.FC<ApprovalCardProps> = ({ 
  approval, 
  onApprove, 
  onReject, 
  getRiskColor, 
  getPriorityColor,
  showActions 
}) => {
  return (
    <Card className="glass-card border-border-hover">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-card-foreground mb-1">
                {approval.workflow_name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getRiskColor(approval.risk_assessment.level) as any} className="text-xs">
                  Risk: {approval.risk_assessment.level}
                </Badge>
                <Badge variant={getPriorityColor(approval.priority) as any} className="text-xs">
                  {approval.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {approval.status}
                </Badge>
              </div>
              <div className="text-xs text-foreground-muted space-y-1">
                <p>Requested by: {approval.requested_by}</p>
                <p>Date: {new Date(approval.request_date).toLocaleString()}</p>
                <p>Steps requiring approval: {approval.steps_requiring_approval.length}</p>
              </div>
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="glass-button text-xs"
                  onClick={() => onReject(approval.id)}
                >
                  <X className="w-3 h-3 mr-1" />
                  Reject
                </Button>
                <Button 
                  size="sm" 
                  className="glass-button text-xs"
                  onClick={() => onApprove(approval.id)}
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Approve
                </Button>
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          {approval.risk_assessment.factors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-card-foreground">Risk Factors:</h4>
              <div className="space-y-1">
                {approval.risk_assessment.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <AlertTriangle className="w-3 h-3 text-warning" />
                    <span className="text-foreground-muted">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps Requiring Approval */}
          {approval.steps_requiring_approval.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-card-foreground">Steps Requiring Approval:</h4>
              <div className="space-y-2">
                {approval.steps_requiring_approval.map((step) => (
                  <div key={step.id} className="p-2 bg-background/30 rounded text-xs">
                    <div className="font-medium">{step.name}</div>
                    <div className="text-foreground-muted mt-1">{step.description}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Risk: {step.risk_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Duration: {step.estimated_duration}min
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Approvals;
