import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  User,
  Settings,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService, type AuditEvent } from '@/services/api';

const Audit = () => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchAuditEvents = async () => {
      try {
        const data = await apiService.getAuditEvents();
        setAuditEvents(data);
      } catch (error) {
        console.error('Failed to fetch audit events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditEvents();
    const interval = setInterval(fetchAuditEvents, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Activity;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'error': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'secondary';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'default';
      case 'violation': return 'destructive';
      case 'warning': return 'default';
      default: return 'secondary';
    }
  };

  const filteredEvents = auditEvents.filter(event => 
    event.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.user_id && event.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const criticalEvents = filteredEvents.filter(e => e.severity === 'critical');
  const errorEvents = filteredEvents.filter(e => e.severity === 'error');
  const warningEvents = filteredEvents.filter(e => e.severity === 'warning');
  const complianceViolations = filteredEvents.filter(e => e.compliance_status === 'violation');

  if (loading && auditEvents.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-foreground-muted">Loading audit events...</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Audit Trail</h1>
            <p className="text-foreground-muted mt-1 text-sm sm:text-base">
              Immutable security and compliance audit trail for all system activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass-button shrink-0 text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Export
            </Button>
            <Button variant="outline" className="glass-button shrink-0 text-xs sm:text-sm">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Audit Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-destructive/20 rounded-lg">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Critical</p>
                  <p className="text-lg sm:text-xl font-bold text-card-foreground">
                    {criticalEvents.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-destructive/20 rounded-lg">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Errors</p>
                  <p className="text-lg sm:text-xl font-bold text-card-foreground">
                    {errorEvents.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-warning/20 rounded-lg">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Warnings</p>
                  <p className="text-lg sm:text-xl font-bold text-card-foreground">
                    {warningEvents.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-info/20 rounded-lg">
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-info" />
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Total</p>
                  <p className="text-lg sm:text-xl font-bold text-card-foreground">
                    {auditEvents.length}
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
              placeholder="Search audit events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {auditEvents.length === 0 ? (
          <Card className="glass-card border-0">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">
                  No Audit Events
                </h3>
                <p className="text-sm text-foreground-muted">
                  System activities and security events will be recorded here automatically
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="glass-card grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="all" className="text-xs">
                All ({filteredEvents.length})
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-xs">
                Critical ({criticalEvents.length})
              </TabsTrigger>
              <TabsTrigger value="errors" className="text-xs">
                Errors ({errorEvents.length})
              </TabsTrigger>
              <TabsTrigger value="violations" className="text-xs">
                Violations ({complianceViolations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              <div className="space-y-2">
                {filteredEvents.slice(0, 50).map((event) => (
                  <AuditEventCard 
                    key={event.id} 
                    event={event} 
                    getSeverityIcon={getSeverityIcon}
                    getSeverityColor={getSeverityColor}
                    getComplianceColor={getComplianceColor}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="critical" className="space-y-3">
              <div className="space-y-2">
                {criticalEvents.map((event) => (
                  <AuditEventCard 
                    key={event.id} 
                    event={event} 
                    getSeverityIcon={getSeverityIcon}
                    getSeverityColor={getSeverityColor}
                    getComplianceColor={getComplianceColor}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="errors" className="space-y-3">
              <div className="space-y-2">
                {errorEvents.map((event) => (
                  <AuditEventCard 
                    key={event.id} 
                    event={event} 
                    getSeverityIcon={getSeverityIcon}
                    getSeverityColor={getSeverityColor}
                    getComplianceColor={getComplianceColor}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="violations" className="space-y-3">
              <div className="space-y-2">
                {complianceViolations.map((event) => (
                  <AuditEventCard 
                    key={event.id} 
                    event={event} 
                    getSeverityIcon={getSeverityIcon}
                    getSeverityColor={getSeverityColor}
                    getComplianceColor={getComplianceColor}
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

interface AuditEventCardProps {
  event: AuditEvent;
  getSeverityIcon: (severity: string) => any;
  getSeverityColor: (severity: string) => string;
  getComplianceColor: (status: string) => string;
}

const AuditEventCard: React.FC<AuditEventCardProps> = ({ 
  event, 
  getSeverityIcon, 
  getSeverityColor, 
  getComplianceColor 
}) => {
  const SeverityIcon = getSeverityIcon(event.severity);
  
  return (
    <Card className="glass-card border-border-hover hover:border-primary/50 transition-all">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-1.5 bg-primary/20 rounded-lg mt-0.5">
              <SeverityIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-card-foreground truncate">
                  {event.event_type}
                </h3>
                <Badge variant={getSeverityColor(event.severity) as any} className="text-xs">
                  {event.severity}
                </Badge>
                <Badge variant={getComplianceColor(event.compliance_status) as any} className="text-xs">
                  {event.compliance_status}
                </Badge>
              </div>
              
              <p className="text-xs text-foreground-muted mb-2 line-clamp-2">
                {event.action}
              </p>
              
              <div className="flex items-center gap-3 text-xs text-foreground-muted">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(event.timestamp).toLocaleString()}</span>
                </div>
                {event.user_id && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{event.user_id}</span>
                  </div>
                )}
                {event.resource_id && (
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    <span>{event.resource_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="glass-button text-xs shrink-0">
            <Eye className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Audit;
