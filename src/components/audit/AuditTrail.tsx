import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  User,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const auditEvents = [
  {
    id: 'audit-001',
    timestamp: '2024-01-15 14:32:15',
    event: 'Workflow Execution Started',
    details: 'Vendor onboarding workflow initiated for Acme Corp',
    actor: 'Planner Agent',
    actorType: 'agent',
    severity: 'info',
    workflow: 'wf-001',
    tools: ['Google Drive', 'Notion'],
    metadata: {
      approvedBy: 'admin@company.com',
      riskLevel: 'low',
      executionId: 'exec-12345'
    }
  },
  {
    id: 'audit-002', 
    timestamp: '2024-01-15 14:32:45',
    event: 'Tool Authentication Success',
    details: 'Successfully authenticated with Google Drive API',
    actor: 'Executor Agent',
    actorType: 'agent',
    severity: 'success',
    workflow: 'wf-001',
    tools: ['Google Drive'],
    metadata: {
      apiEndpoint: '/drive/v3/files',
      responseTime: '245ms'
    }
  },
  {
    id: 'audit-003',
    timestamp: '2024-01-15 14:31:20',
    event: 'Approval Granted',
    details: 'Employee onboarding workflow approved by HR team',
    actor: 'jane.doe@company.com',
    actorType: 'user',
    severity: 'success', 
    workflow: 'wf-002',
    tools: ['Gmail', 'Slack', 'GitHub'],
    metadata: {
      approvalTime: '2m 15s',
      riskAssessment: 'low'
    }
  },
  {
    id: 'audit-004',
    timestamp: '2024-01-15 14:30:15',
    event: 'Security Policy Violation',
    details: 'Attempted to access restricted endpoint without proper authorization',
    actor: 'Executor Agent',
    actorType: 'agent',
    severity: 'warning',
    workflow: 'wf-003',
    tools: ['AWS Console'],
    metadata: {
      endpoint: '/admin/users',
      blocked: true,
      policyId: 'pol-security-001'
    }
  }
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'error': return <AlertTriangle className="w-4 h-4 text-error" />;
    default: return <Info className="w-4 h-4 text-info" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'success': return 'bg-success/20 text-success';
    case 'warning': return 'bg-warning/20 text-warning';  
    case 'error': return 'bg-error/20 text-error';
    default: return 'bg-info/20 text-info';
  }
};

export const AuditTrail = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredEvents = auditEvents.filter(event => 
    event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Audit Trail
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="glass-button gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="glass-button gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search audit events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Events Timeline */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="glass-card p-4 rounded-lg border border-border-hover">
              {/* Event Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {getSeverityIcon(event.severity)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-card-foreground mb-1">
                      {event.event}
                    </h3>
                    <p className="text-sm text-foreground-muted mb-2">
                      {event.details}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-foreground-muted">
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
                        {event.actor}
                      </div>
                      <div>
                        Workflow: {event.workflow}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className={`${getSeverityColor(event.severity)} border-0`}>
                  {event.severity}
                </Badge>
              </div>

              {/* Tools Used */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-foreground-muted">Tools:</span>
                {event.tools.map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>

              {/* Metadata */}
              <div className="glass-card p-3 rounded bg-background-subtle/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {Object.entries(event.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-foreground-muted capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </span>
                      <span className="text-card-foreground font-medium">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-foreground-muted mx-auto mb-2 opacity-50" />
            <p className="text-foreground-muted">No audit events found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};