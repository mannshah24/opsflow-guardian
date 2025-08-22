import React, { useState, useEffect } from 'react';
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
  Bot,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { apiService, type AuditEvent } from '@/services/api';

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
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditEvents = async () => {
      try {
        const events = await apiService.getAuditEvents();
        setAuditEvents(events);
      } catch (error) {
        console.error('Failed to fetch audit events:', error);
        // Keep empty array if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchAuditEvents();
    // Refresh every 15 seconds
    const interval = setInterval(fetchAuditEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredEvents = auditEvents.filter(event => 
    event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <span className="text-lg truncate">Audit Trail</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="glass-button gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="glass-button gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-foreground-muted">Loading audit events...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-foreground-muted mx-auto mb-2 opacity-50" />
            <p className="text-foreground-muted">
              {auditEvents.length === 0 ? 'No audit events available' : 'No matching events found'}
            </p>
          </div>
        ) : (
          /* Events Timeline */
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div key={event.id} className="glass-card p-4 rounded-lg border border-border-hover">
                {/* Event Header */}
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSeverityIcon(event.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground mb-1 text-sm sm:text-base truncate">
                        {event.action}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground-muted mb-2 line-clamp-2">
                        {event.event_type}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-foreground-muted">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                        {event.user_id && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{event.user_id}</span>
                          </div>
                        )}
                        {event.resource_id && (
                          <div className="truncate">
                            Resource: {event.resource_id}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Badge className={cn(getSeverityColor(event.severity), "border-0 text-xs")}>
                      {event.severity}
                    </Badge>
                    <Badge 
                      variant={event.compliance_status === 'compliant' ? 'default' : 
                               event.compliance_status === 'violation' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {event.compliance_status}
                    </Badge>
                  </div>
                </div>

                {/* Event Details */}
                {event.details && Object.keys(event.details).length > 0 && (
                  <div className="glass-card p-3 rounded bg-background-subtle/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(event.details).slice(0, 6).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center gap-2">
                          <span className="text-foreground-muted capitalize truncate">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                          </span>
                          <span className="text-card-foreground font-medium text-right">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};