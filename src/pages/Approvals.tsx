import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  User,
  Bot,
  Shield,
  Zap,
  Filter,
  Search,
  CheckCheck,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const pendingApprovals = [
  {
    id: 'app-001',
    title: 'Employee Onboarding: Sarah Chen - Senior Developer',
    description: 'Create accounts, setup development environment, add to repositories, and schedule orientation',
    requestedBy: 'HR Team (jane.doe@company.com)',
    requestedAt: '2024-01-15 14:28:00',
    riskLevel: 'medium',
    estimatedTime: '6-8 minutes',
    category: 'HR Operations',
    workflow: 'Employee Onboarding Template v2.1',
    tools: ['Gmail', 'GitHub', 'Slack', 'Notion', 'Calendar', 'Okta'],
    steps: [
      'Create sarah.chen@company.com email account',
      'Setup GitHub account with repository access',
      'Add to Engineering and New Hires Slack channels', 
      'Create Notion workspace and assign onboarding checklist',
      'Schedule orientation meeting and first-week calendar',
      'Setup Okta account with appropriate role permissions'
    ],
    impact: 'High - New employee starts Monday, delays affect productivity',
    compliance: ['SOX Compliance', 'Security Policy SP-001', 'HR Policy HR-15'],
    estimatedCost: '$0.47',
    priority: 'high'
  },
  {
    id: 'app-002',
    title: 'Incident Response: Critical Database Performance Issue',
    description: 'Execute emergency database optimization and stakeholder notifications',
    requestedBy: 'System Monitor (Automated)',
    requestedAt: '2024-01-15 14:31:45',
    riskLevel: 'critical',
    estimatedTime: '2-3 minutes',
    category: 'DevOps',
    workflow: 'Incident Response Template v1.8',
    tools: ['AWS Console', 'PagerDuty', 'Slack', 'Jira', 'StatusPage'],
    steps: [
      'Scale database instances to handle load',
      'Create P0 incident ticket in Jira',
      'Alert on-call engineers via PagerDuty',
      'Post incident status in #engineering channel',
      'Update public status page with incident details'
    ],
    impact: 'Critical - Affecting 40% of user traffic, revenue impact $2,000/minute',
    compliance: ['SLA Agreement', 'Incident Policy INC-001'],
    estimatedCost: '$12.34',
    priority: 'critical'
  },
  {
    id: 'app-003',
    title: 'Vendor Onboarding: TechCorp Ltd - Security Audit',
    description: 'Setup vendor workspace, contracts, and security compliance documentation',
    requestedBy: 'Procurement Team (mike.johnson@company.com)',
    requestedAt: '2024-01-15 14:25:12',
    riskLevel: 'low',
    estimatedTime: '4-5 minutes',
    category: 'Procurement',
    workflow: 'Vendor Onboarding Template v1.5',
    tools: ['Google Drive', 'DocuSign', 'Slack', 'Notion', 'Calendly'],
    steps: [
      'Create vendor folder structure in Google Drive',
      'Send NDA and service agreement via DocuSign',
      'Setup vendor Slack channel with stakeholders',
      'Create vendor profile in Notion database',
      'Schedule kickoff meeting via Calendly'
    ],
    impact: 'Medium - Vendor relationship, affects Q1 security initiatives',
    compliance: ['Vendor Policy VP-003', 'Security Review SR-012'],
    estimatedCost: '$0.89',
    priority: 'medium'
  }
];

const approvalHistory = [
  {
    id: 'hist-001',
    title: 'Customer Onboarding: Enterprise Corp',
    approvedBy: 'admin@company.com',
    approvedAt: '2024-01-15 13:45:00',
    executedAt: '2024-01-15 13:47:00', 
    status: 'completed',
    executionTime: '3m 24s',
    decision: 'approved',
    notes: 'Standard enterprise onboarding approved'
  },
  {
    id: 'hist-002',
    title: 'Database Migration: User Table Optimization',
    approvedBy: 'tech.lead@company.com',
    approvedAt: '2024-01-15 12:30:00',
    executedAt: '2024-01-15 12:32:00',
    status: 'completed', 
    executionTime: '8m 45s',
    decision: 'approved',
    notes: 'Approved with additional monitoring requirements'
  },
  {
    id: 'hist-003',
    title: 'Marketing Campaign: Social Media Automation',
    approvedBy: 'marketing.manager@company.com',
    approvedAt: '2024-01-15 11:15:00',
    status: 'rejected',
    decision: 'rejected',
    notes: 'Requires legal review for compliance with new regulations'
  }
];

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low': return 'bg-success/20 text-success border-success';
    case 'medium': return 'bg-warning/20 text-warning border-warning';
    case 'high': return 'bg-error/20 text-error border-error';
    case 'critical': return 'bg-error/30 text-error border-error animate-pulse';
    default: return 'bg-gray-500/20 text-gray-500 border-gray-500';
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

const Approvals = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [expandedApproval, setExpandedApproval] = useState<string | null>(null);

  const filteredApprovals = pendingApprovals.filter(approval =>
    approval.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedRisk === 'all' || approval.riskLevel === selectedRisk)
  );

  const handleApprove = (id: string) => {
    console.log('Approved:', id);
    const approval = pendingApprovals.find(a => a.id === id);
    if (approval) {
      if (confirm(`Are you sure you want to approve and execute "${approval.title}"?`)) {
        alert(`✅ Approved: ${approval.title}\nWorkflow execution started...`);
      }
    }
  };

  const handleReject = (id: string) => {
    console.log('Rejected:', id); 
    const approval = pendingApprovals.find(a => a.id === id);
    if (approval) {
      const reason = prompt('Please provide a reason for rejection:');
      if (reason) {
        alert(`❌ Rejected: ${approval.title}\nReason: ${reason}`);
      }
    }
  };

  const riskLevels = ['all', 'low', 'medium', 'high', 'critical'];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Approval Center</h1>
            <p className="text-foreground-muted mt-1 text-sm sm:text-base">
              Review and approve workflow executions with full context and risk assessment
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="glass-button gap-2">
              <CheckCheck className="w-4 h-4" />
              {isMobile ? "Bulk" : "Bulk Approve"}
            </Button>
            <Button variant="outline" className="glass-button gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-warning/20 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted">Pending</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">
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
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted truncate">Approved Today</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-error/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-error" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted">High Risk</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">
                    {pendingApprovals.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted truncate">Avg Response</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">2.4m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="history">Approval History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  placeholder="Search approvals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {riskLevels.map((risk) => (
                  <Button
                    key={risk}
                    variant={selectedRisk === risk ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRisk(risk)}
                    className={`${selectedRisk === risk ? "" : "glass-button"} whitespace-nowrap`}
                  >
                    {risk === 'all' ? 'All Risk' : risk}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="space-y-4">
              {filteredApprovals.map((approval) => (
                <Card key={approval.id} className={`glass-card border-0 ${
                  approval.riskLevel === 'critical' ? 'ring-1 ring-error/50' : ''
                }`}>
                  <CardContent className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-card-foreground leading-tight">
                            {approval.title}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <Badge className={`${getRiskColor(approval.riskLevel)} text-xs`}>
                              {approval.riskLevel === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {approval.riskLevel} risk
                            </Badge>
                            <Badge className={getPriorityColor(approval.priority)}>
                              {approval.priority}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-foreground-muted mb-3">
                          {approval.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs text-foreground-muted">
                          <div className="flex items-center gap-1 truncate">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{approval.requestedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{approval.requestedAt}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 flex-shrink-0" />
                            Est. {approval.estimatedTime}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Impact and Compliance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div className="glass-card p-3 rounded-lg">
                        <h4 className="text-xs font-medium text-card-foreground mb-1">Business Impact</h4>
                        <p className="text-xs text-foreground-muted">{approval.impact}</p>
                      </div>
                      <div className="glass-card p-3 rounded-lg">
                        <h4 className="text-xs font-medium text-card-foreground mb-1">Compliance</h4>
                        <div className="flex flex-wrap gap-1">
                          {approval.compliance.map((comp) => (
                            <Badge key={comp} variant="outline" className="text-xs">
                              <Shield className="w-2 h-2 mr-1" />
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Execution Plan */}
                    <div className="glass-card p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-card-foreground">Execution Plan</h4>
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpandedApproval(
                            expandedApproval === approval.id ? null : approval.id
                          )}
                          className="text-xs"
                        >
                          {expandedApproval === approval.id ? 'Show Less' : 'Show All Steps'}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(expandedApproval === approval.id ? approval.steps : approval.steps.slice(0, 2))
                          .map((step, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs">
                            <span className="text-primary font-medium bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-foreground-muted">{step}</span>
                          </div>
                        ))}
                        {expandedApproval !== approval.id && approval.steps.length > 2 && (
                          <div className="text-xs text-foreground-muted ml-7">
                            +{approval.steps.length - 2} more steps...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tools and Cost */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs text-foreground-muted mr-2">Tools:</span>
                        <div className="flex flex-wrap gap-1 inline-flex">
                          {approval.tools.slice(0, 4).map((tool) => (
                            <Badge key={tool} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                          {approval.tools.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{approval.tools.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-foreground-muted">
                        Est. cost: <span className="text-card-foreground font-medium">{approval.estimatedCost}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 glass-button gap-2 min-h-[36px]"
                        onClick={() => {
                          console.log('Viewing details for:', approval.id);
                          alert(`Viewing details for approval: ${approval.title}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        {isMobile ? "Details" : "Review Details"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(approval.id)}
                        className="glass-button text-error border-error/50 hover:bg-error/10 px-3 sm:px-4 min-h-[36px]"
                      >
                        <X className="w-4 h-4" />
                        {!isMobile && <span className="ml-1">Reject</span>}
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApprove(approval.id)}
                        className={`bg-success hover:bg-success/90 text-white px-4 sm:px-6 min-h-[36px] ${
                          approval.riskLevel === 'critical' ? 'animate-glow' : ''
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isMobile ? "Approve" : "Approve & Execute"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredApprovals.length === 0 && (
                <Card className="glass-card border-0">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-card-foreground mb-2">
                      No pending approvals
                    </h3>
                    <p className="text-sm text-foreground-muted">
                      All workflows are running smoothly. New approval requests will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <div className="space-y-4">
              {approvalHistory.map((item) => (
                <Card key={item.id} className="glass-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-card-foreground">{item.title}</h3>
                          <Badge className={
                            item.decision === 'approved' ? 'bg-success/20 text-success' :
                            'bg-error/20 text-error'
                          }>
                            {item.decision}
                          </Badge>
                          {item.status && (
                            <Badge variant="outline">
                              {item.status}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-foreground-muted mb-2">
                          <div>Approved by: {item.approvedBy}</div>
                          <div>Date: {item.approvedAt}</div>
                          {item.executionTime && <div>Execution: {item.executionTime}</div>}
                        </div>
                        {item.notes && (
                          <p className="text-sm text-foreground-muted">{item.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Approvals;