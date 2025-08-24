/**
 * API Service for OpsFlow Guardian 2.0
 * Centralized API calls to fetch real data from Portia agents
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

// Authentication utilities
class AuthManager {
  private static TOKEN_KEY = 'opsflow_auth_token';
  
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  
  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
  
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token.length > 0;
  }
  
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Authentication required. Please log in to continue.');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}

// Mock authentication for development
const setupMockAuth = () => {
  if (!AuthManager.isAuthenticated()) {
    // Create a mock JWT token for development
    const mockToken = 'mock-jwt-token-' + Date.now() + Math.random().toString(36);
    AuthManager.setToken(mockToken);
    console.log('🔑 Mock authentication token set for development');
  }
};

// Initialize mock auth on module load
setupMockAuth();

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'working' | 'error' | 'offline';
  description: string;
  current_task?: string;
  tasks_completed: number;
  success_rate: number;
  last_active: string;
  capabilities: string[];
  avg_response_time?: number; // Average response time in seconds
  performance?: {
    cpu: number;
    memory: number;
    network: number;
  };
  metrics?: {
    tasksProcessed: number;
    successRate: number;
    avgResponseTime: string;
    uptime: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'approved' | 'running' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  created_by: string;
  risk_level: 'low' | 'medium' | 'high';
  estimated_duration: number;
  steps: WorkflowStep[];
  approval_required: boolean;
  integrations_used: string[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  step_order: number;
  tool_integrations: string[];
  risk_level: 'low' | 'medium' | 'high';
  requires_approval: boolean;
  estimated_duration: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface Approval {
  id: string;
  workflow_id: string;
  workflow_name: string;
  requested_by: string;
  request_date: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  risk_assessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigation: string[];
  };
  steps_requiring_approval: WorkflowStep[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  event_type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  user_id?: string;
  resource_id?: string;
  action: string;
  details: Record<string, any>;
  compliance_status: 'compliant' | 'violation' | 'warning';
}

export interface Notification {
  id: string;
  type: 'approval' | 'completion' | 'error' | 'info' | 'workflow' | 'agent';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  metadata?: Record<string, any>;
}

export interface AnalyticsData {
  totalWorkflows: number;
  successRate: number;
  avgExecutionTime: string;
  timeSaved: string;
  activeAgents: number;
  pendingApprovals: number;
  recentActivity: AuditEvent[];
  performance: {
    cpu: number;
    memory: number;
    network: number;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Agent APIs
  async getAgents(): Promise<Agent[]> {
    try {
      const response = await this.request<{ success: boolean; data: Agent[] }>('/agents');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      return [];
    }
  }

  async getAgent(agentId: string): Promise<Agent | null> {
    try {
      const response = await this.request<{ success: boolean; data: Agent }>(`/agents/${agentId}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to fetch agent ${agentId}:`, error);
      return null;
    }
  }

  async deployAgent(agentData: { name: string; description: string; type?: string }): Promise<Agent | null> {
    try {
      // Check authentication before proceeding
      if (!AuthManager.isAuthenticated()) {
        throw new Error('Authentication required. Please log in to create agents.');
      }
      
      const response = await this.request<{ success: boolean; data: Agent }>('/agents', {
        method: 'POST',
        headers: AuthManager.getAuthHeaders(),
        body: JSON.stringify({
          name: agentData.name,
          description: agentData.description,
          agent_type: agentData.type || 'workflow',
          llm_provider: 'gemini',
          llm_model: 'gemini-2.5-flash',
          system_prompt: `You are an AI agent named "${agentData.name}". ${agentData.description}`,
          tools: [],
          auto_approve_threshold: 0.8,
          max_execution_time: 300
        }),
      });
      return response.data || null;
    } catch (error) {
      console.error('Failed to deploy agent:', error);
      throw error;
    }
  }

  async deleteAgent(agentId: string): Promise<boolean> {
    try {
      await this.request(`/agents/${agentId}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      console.error(`Failed to delete agent ${agentId}:`, error);
      return false;
    }
  }

  async getAgentStats(): Promise<any> {
    try {
      return await this.request('/agents/stats');
    } catch (error) {
      console.error('Failed to fetch agent stats:', error);
      return { activeAgents: 0, totalTasks: 0, avgSuccessRate: 0 };
    }
  }

  // Workflow APIs
  async getWorkflows(): Promise<Workflow[]> {
    try {
      const response = await this.request<{ success: boolean; data: Workflow[] }>('/workflows');
      const workflows = response.data || [];
      
      // Ensure all workflows have proper structure with steps array
      return workflows.map(workflow => ({
        ...workflow,
        steps: workflow.steps || [],
        integrations_used: workflow.integrations_used || []
      }));
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
      return [];
    }
  }

  async createWorkflow(description: string, userId?: string): Promise<Workflow | null> {
    try {
      // Check authentication before proceeding
      if (!AuthManager.isAuthenticated()) {
        throw new Error('Authentication required. Please log in to create workflows.');
      }
      
      const response = await this.request<{ success: boolean; data: Workflow }>('/workflows/', {
        method: 'POST',
        headers: AuthManager.getAuthHeaders(),
        body: JSON.stringify({ 
          description, 
          name: `Workflow: ${description.substring(0, 50)}`,
          status: 'pending'
        }),
      });
      return response.data || null;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      throw error;
    }
  }

  async toggleWorkflowStatus(workflowId: string, currentStatus: string): Promise<boolean> {
    try {
      const newStatus = currentStatus === 'running' ? 'paused' : 'running';
      await this.request(`/workflows/${workflowId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      return true;
    } catch (error) {
      console.error(`Failed to toggle workflow status: ${error}`);
      throw error;
    }
  }

  async getWorkflowTemplates(): Promise<any[]> {
    try {
      const response = await this.request<{ success: boolean; data: any[] }>('/workflows/templates');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch workflow templates:', error);
      return [];
    }
  }

  // Approval APIs
  async getApprovals(): Promise<Approval[]> {
    try {
      const response = await this.request<{ success: boolean; data: Approval[] }>('/approvals');
      const approvals = response.data || [];
      
      // Ensure all approvals have proper structure with risk_assessment
      return approvals.map(approval => ({
        ...approval,
        risk_assessment: approval.risk_assessment || {
          level: 'medium',
          factors: [],
          mitigation: []
        },
        steps_requiring_approval: approval.steps_requiring_approval || []
      }));
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
      return [];
    }
  }

  async approveWorkflow(approvalId: string): Promise<boolean> {
    try {
      await this.request(`/approvals/${approvalId}/approve`, { method: 'POST' });
      return true;
    } catch (error) {
      console.error(`Failed to approve workflow ${approvalId}:`, error);
      return false;
    }
  }

  async rejectWorkflow(approvalId: string, reason?: string): Promise<boolean> {
    try {
      await this.request(`/approvals/${approvalId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      return true;
    } catch (error) {
      console.error(`Failed to reject workflow ${approvalId}:`, error);
      return false;
    }
  }

  // Audit APIs
  async getAuditEvents(): Promise<AuditEvent[]> {
    try {
      const response = await this.request<{ success: boolean; data: AuditEvent[] }>('/audit');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch audit events:', error);
      return [];
    }
  }

  // Analytics APIs
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await this.request<{ success: boolean; data: any }>('/analytics/dashboard');
      const backendData = response.data || {};
      
      // Map backend response to frontend interface
      return {
        totalWorkflows: backendData.workflow_metrics?.total_workflows || 0,
        successRate: backendData.workflow_metrics?.success_rate || backendData.overview?.success_rate || 0,
        avgExecutionTime: backendData.overview?.average_execution_time || '0m',
        timeSaved: `${Math.round((backendData.cost_metrics?.monthly_trend?.[2]?.cost || 0) / 100)}h`,
        activeAgents: backendData.overview?.active_workflows || 0,
        pendingApprovals: backendData.overview?.pending_approvals || 0,
        recentActivity: [],
        performance: {
          cpu: backendData.agent_performance?.executor?.utilization || 0,
          memory: backendData.agent_performance?.planner?.utilization || 0,
          network: backendData.agent_performance?.auditor?.utilization || 0
        }
      };
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return {
        totalWorkflows: 0,
        successRate: 0,
        avgExecutionTime: '0m',
        timeSaved: '0h',
        activeAgents: 0,
        pendingApprovals: 0,
        recentActivity: [],
        performance: { cpu: 0, memory: 0, network: 0 }
      };
    }
  }

  // Notification APIs (simulated for now)
  async getNotifications(): Promise<Notification[]> {
    try {
      // For now, generate notifications based on recent activity
      const auditEvents = await this.getAuditEvents();
      const approvals = await this.getApprovals();
      
      const notifications: Notification[] = [];

      // Create notifications from pending approvals
      approvals.filter(a => a.status === 'pending').forEach(approval => {
        notifications.push({
          id: `approval-${approval.id}`,
          type: 'approval',
          title: 'Workflow Approval Required',
          message: `${approval.workflow_name} needs your approval`,
          time: this.getRelativeTime(approval.request_date),
          unread: true,
          metadata: { approval_id: approval.id }
        });
      });

      // Create notifications from recent audit events
      auditEvents.slice(0, 5).forEach(event => {
        if (event.severity === 'error' || event.severity === 'critical') {
          notifications.push({
            id: `audit-${event.id}`,
            type: 'error',
            title: `${event.event_type} Error`,
            message: event.action,
            time: this.getRelativeTime(event.timestamp),
            unread: event.severity === 'critical',
            metadata: { event_id: event.id }
          });
        }
      });

      return notifications.slice(0, 10); // Return max 10 notifications
    } catch (error) {
      console.error('Failed to generate notifications:', error);
      return [];
    }
  }

  // Company Profile APIs
  async saveCompanyProfile(profileData: {
    companyName: string;
    industry: string;
    size: string;
    primaryGoals: string[];
    automationNeeds: string[];
    techStack: string[];
    businessProcesses: string[];
    description?: string;
  }): Promise<boolean> {
    try {
      // Check authentication before proceeding
      if (!AuthManager.isAuthenticated()) {
        throw new Error('Authentication required to save company profile.');
      }
      
      const response = await this.request<{ success: boolean }>('/company-profile', {
        method: 'POST',
        headers: AuthManager.getAuthHeaders(),
        body: JSON.stringify({
          companyName: profileData.companyName,
          industry: profileData.industry,
          size: profileData.size,
          primaryGoals: profileData.primaryGoals,
          automationNeeds: profileData.automationNeeds,
          techStack: profileData.techStack,
          businessProcesses: profileData.businessProcesses,
          description: profileData.description || ''
        }),
      });
      return response.success || false;
    } catch (error) {
      console.error('Failed to save company profile:', error);
      // For now, just save to localStorage as fallback
      localStorage.setItem('opsflow-company-profile', JSON.stringify(profileData));
      return true;
    }
  }

  async getCompanyProfile(): Promise<any> {
    try {
      // Check authentication first
      if (!AuthManager.isAuthenticated()) {
        // Fallback to localStorage
        const stored = localStorage.getItem('opsflow-company-profile');
        return stored ? JSON.parse(stored) : null;
      }
      
      const response = await this.request<{ success: boolean; data?: any }>('/company-profile', {
        headers: AuthManager.getAuthHeaders(),
      });
      return response.data || response;
    } catch (error) {
      console.error('Failed to fetch company profile:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('opsflow-company-profile');
      return stored ? JSON.parse(stored) : null;
    }
  }

  private getRelativeTime(timestamp: string): string {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now.getTime() - eventTime.getTime();
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  }
}

export const apiService = new ApiService();
