import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Shield, 
  Search, 
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  Bot,
  FileText,
  Activity,
  Database,
  Lock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const auditEvents = [
  {
    id: 'audit-001',
    timestamp: '2024-01-15 14:32:45',
    category: 'workflow_execution',
    event: 'Workflow Execution Started',
    severity: 'info',
    details: 'Employee onboarding workflow initiated for Sarah Chen (sarah.chen@company.com)',
    actor: 'Planner Agent',
    actorType: 'agent',
    workflow: 'wf-001',
    tools: ['Gmail', 'GitHub', 'Slack', 'Notion'],
    metadata: {
      workflowTemplate: 'Employee Onboarding v2.1',
      approvedBy: 'jane.doe@company.com',
      riskLevel: 'medium',
      executionId: 'exec-20240115-001',
      estimatedDuration: '6-8 minutes',
      complianceChecks: 'PASSED'
    }
  },
  {
    id: 'audit-002',
    timestamp: '2024-01-15 14:32:30', 
    category: 'authentication',
    event: 'API Authentication Success',
    severity: 'success',
    details: 'Successfully authenticated with GitHub API for repository access setup',
    actor: 'Executor Agent',
    actorType: 'agent',
    workflow: 'wf-001',
    tools: ['GitHub'],
    metadata: {
      apiEndpoint: 'https://api.github.com/user/repos',
      responseTime: '285ms',
      tokenExpiry: '2024-01-15 16:32:30',
      scopes: ['repo', 'user:email'],
      rateLimitRemaining: 4987
    }
  },
  {
    id: 'audit-003',
    timestamp: '2024-01-15 14:31:15',
    category: 'approval',
    event: 'Workflow Approval Granted',
    severity: 'success',
    details: 'Employee onboarding workflow approved by HR team with standard conditions',
    actor: 'jane.doe@company.com',
    actorType: 'user',
    workflow: 'wf-001',
    tools: [],
    metadata: {
      approvalTime: '3m 24s',
      riskAssessment: 'MEDIUM',
      complianceFlags: 'NONE',
      approvalMethod: 'dashboard',
      conditions: 'Standard employee onboarding'
    }
  },
  {
    id: 'audit-004',
    timestamp: '2024-01-15 14:30:50',
    category: 'security',
    event: 'Security Policy Violation Prevented',
    severity: 'warning',
    details: 'Attempted access to restricted AWS admin console blocked by security policy',
    actor: 'Executor Agent',
    actorType: 'agent',
    workflow: 'wf-002',
    tools: ['AWS Console'],
    metadata: {
      policyId: 'SEC-POL-001',
      endpoint: '/admin/iam/users',
      blockedAction: 'CreateUser',
      securityLevel: 'HIGH',
      alertSent: true
    }
  },
  {
    id: 'audit-005',
    timestamp: '2024-01-15 14:29:30',
    category: 'compliance',
    event: 'Compliance Check Completed',
    severity: 'success',
    details: 'SOX compliance validation completed for financial workflow execution',
    actor: 'Auditor Agent',
    actorType: 'agent',
    workflow: 'wf-003',
    tools: ['Compliance Engine'],
    metadata: {
      complianceFramework: 'SOX',
      checksPassed: 12,
      checksFailed: 0,
      certificationId: 'SOX-2024-001',
      validUntil: '2024-04-15'
    }
  },
  {
    id: 'audit-006',
    timestamp: '2024-01-15 14:28:45',
    category: 'data_access',
    event: 'Sensitive Data Access Logged',
    severity: 'info',
    details: 'Employee personal information accessed for onboarding process',
    actor: 'Executor Agent',
    actorType: 'agent',
    workflow: 'wf-001',
    tools: ['HRMS'],
    metadata: {
      dataType: 'PII',
      recordCount: 1,
      accessReason: 'Employee onboarding',
      dataClassification: 'CONFIDENTIAL',
      retentionPeriod: '7 years'
    }
  }
];

const complianceReports = [
  {
    id: 'report-001',
    name: 'SOX Compliance Report - Q1 2024',
    type: 'regulatory',
    status: 'completed',
    generatedAt: '2024-01-15 09:00:00',
    events: 47,
    violations: 0,
    score: 100
  },
  {
    id: 'report-002', 
    name: 'Security Audit - Weekly Summary',
    type: 'security',
    status: 'completed',
    generatedAt: '2024-01-15 08:30:00',
    events: 234,
    violations: 2,
    score: 98
  },
  {
    id: 'report-003',
    name: 'Data Privacy Compliance - GDPR',
    type: 'privacy',
    status: 'in_progress',
    generatedAt: '2024-01-15 10:15:00',
    events: 156,
    violations: 1,
    score: 97
  }
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'error': return <AlertTriangle className="w-4 h-4 text-error" />;
    case 'critical': return <AlertTriangle className="w-4 h-4 text-error animate-pulse" />;
    default: return <Info className="w-4 h-4 text-info" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'success': return 'bg-success/20 text-success';
    case 'warning': return 'bg-warning/20 text-warning';
    case 'error': return 'bg-error/20 text-error';
    case 'critical': return 'bg-error/30 text-error';
    default: return 'bg-info/20 text-info';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'workflow_execution': return <Zap className="w-4 h-4" />;
    case 'authentication': return <Lock className="w-4 h-4" />;
    case 'approval': return <CheckCircle className="w-4 h-4" />;
    case 'security': return <Shield className="w-4 h-4" />;
    case 'compliance': return <FileText className="w-4 h-4" />;
    case 'data_access': return <Database className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const Audit = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const filteredEvents = auditEvents.filter(event =>
    (selectedCategory === 'all' || event.category === selectedCategory) &&
    (selectedSeverity === 'all' || event.severity === selectedSeverity) &&
    (event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
     event.details.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = ['all', ...Array.from(new Set(auditEvents.map(e => e.category)))];
  const severities = ['all', 'info', 'success', 'warning', 'error', 'critical'];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Audit Trail</h1>
            <p className="text-foreground-muted mt-1 text-sm sm:text-base">
              Comprehensive audit logging and compliance monitoring for all workflow activities
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="glass-button gap-2"
              onClick={() => alert('Advanced filtering options would be implemented here')}
            >
              <Filter className="w-4 h-4" />
              {isMobile ? "Filter" : "Advanced Filter"}
            </Button>
            <Button 
              variant="outline" 
              className="glass-button gap-2"
              onClick={() => alert('Exporting audit log... This would trigger a download')}
            >
              <Download className="w-4 h-4" />
              {isMobile ? "Export" : "Export Audit Log"}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted">Events Today</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">1,847</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-success/20 rounded-lg">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted truncate">Compliance Score</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">98.5%</p>
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
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted truncate">Security Alerts</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-info/20 rounded-lg">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-foreground-muted truncate">Data Retention</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">7 Years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Audit Events</TabsTrigger>
            <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6 mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  placeholder="Search audit events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.slice(0, 4).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`${selectedCategory === category ? "" : "glass-button"} whitespace-nowrap`}
                  >
                    {category === 'all' ? 'All' : category.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Events Timeline */}
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="glass-card border-0">
                  <CardContent className="p-4 sm:p-6">
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getSeverityIcon(event.severity)}
                          <div className="p-1 bg-background-subtle rounded">
                            {getCategoryIcon(event.category)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="font-semibold text-card-foreground text-sm sm:text-base">
                              {event.event}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                              <Badge className={getSeverityColor(event.severity)}>
                                {event.severity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {event.category.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-foreground-muted mb-3">
                            {event.details}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-foreground-muted">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.timestamp}
                            </div>
                            <div className="flex items-center gap-1">
                              {event.actorType === 'agent' ? (
                                <Bot className="w-3 h-3" />
                              ) : (
                                <User className="w-3 h-3" />
                              )}
                              <span className="truncate">{event.actor}</span>
                            </div>
                            {event.workflow && (
                              <div className="truncate">Workflow: {event.workflow}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="glass-button flex-shrink-0"
                        onClick={() => {
                          alert(`Event Details:\n\nID: ${event.id}\nCategory: ${event.category}\nSeverity: ${event.severity}\nTimestamp: ${event.timestamp}\n\nMetadata:\n${JSON.stringify(event.metadata, null, 2)}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Tools Used */}
                    {event.tools.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-xs text-foreground-muted flex-shrink-0">Tools:</span>
                        <div className="flex flex-wrap gap-1">
                          {event.tools.map((tool) => (
                            <Badge key={tool} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="glass-card p-3 sm:p-4 rounded-lg bg-background-subtle/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-foreground-muted capitalize font-medium">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="text-card-foreground font-medium sm:text-right break-all">
                              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                               typeof value === 'number' ? value.toLocaleString() : 
                               value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredEvents.length === 0 && (
                <Card className="glass-card border-0">
                  <CardContent className="p-12 text-center">
                    <Shield className="w-16 h-16 text-foreground-muted mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-card-foreground mb-2">
                      No audit events found
                    </h3>
                    <p className="text-sm text-foreground-muted">
                      Try adjusting your search criteria or filters.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {complianceReports.map((report) => (
                <Card key={report.id} className="glass-card border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      <span className="truncate">{report.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-xs">{report.type}</Badge>
                        <Badge className={
                          report.status === 'completed' ? 'bg-success/20 text-success' :
                          'bg-warning/20 text-warning'
                        }>
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div>
                          <div className="text-foreground-muted text-xs">Events</div>
                          <div className="font-medium text-card-foreground">{report.events}</div>
                        </div>
                        <div>
                          <div className="text-foreground-muted text-xs">Violations</div>
                          <div className="font-medium text-card-foreground">{report.violations}</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground-muted text-xs">Compliance Score</span>
                          <span className="text-card-foreground font-medium text-xs">{report.score}%</span>
                        </div>
                        <div className="w-full bg-background-subtle rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              report.score >= 95 ? 'bg-success' :
                              report.score >= 85 ? 'bg-warning' :
                              'bg-error'
                            }`}
                            style={{ width: `${report.score}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-foreground-muted">
                        Generated: {report.generatedAt}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 glass-button text-xs"
                          onClick={() => {
                            alert(`Viewing report: ${report.name}\n\nType: ${report.type}\nEvents: ${report.events}\nViolations: ${report.violations}\nScore: ${report.score}%\nStatus: ${report.status}`);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="glass-button"
                          onClick={() => {
                            alert(`Downloading report: ${report.name}\n\nThis would trigger a download of the compliance report in PDF format.`);
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Audit Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-foreground-muted mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-card-foreground mb-2">
                    Advanced Analytics Coming Soon
                  </h3>
                  <p className="text-sm text-foreground-muted mb-6 max-w-md mx-auto">
                    Get detailed insights into audit patterns, compliance trends, 
                    and security metrics with our upcoming analytics dashboard.
                  </p>
                  <Button className="bg-primary hover:bg-primary-dark">
                    Request Beta Access
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

export default Audit;