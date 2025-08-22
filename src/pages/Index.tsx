import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AgentMonitor } from '@/components/agents/AgentMonitor';
import { WorkflowInterface } from '@/components/workflow/WorkflowInterface';
import { ApprovalCenter } from '@/components/approval/ApprovalCenter';
import { AuditTrail } from '@/components/audit/AuditTrail';
import { apiService } from '@/services/api';

const Index = () => {
  const [stats, setStats] = useState({
    activeAgents: 0,
    runningWorkflows: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [agents, workflows, approvals] = await Promise.all([
          apiService.getAgents(),
          apiService.getWorkflows(), 
          apiService.getApprovals()
        ]);

        setStats({
          activeAgents: agents.filter(a => a.status === 'active' || a.status === 'working').length,
          runningWorkflows: workflows.filter(w => w.status === 'running').length,
          pendingApprovals: approvals.filter(a => a.status === 'pending').length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Keep default values on error
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 mesh-background rounded-xl"></div>
          <div className="relative glass-card p-6 sm:p-8 rounded-xl border-0">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4">
                OpsFlow Guardian 2.0
              </h1>
              <p className="text-lg sm:text-xl foreground-muted mb-6 sm:mb-8 px-2">
                AI-Powered Workflow Automation with Human Oversight & Complete Audit Trails
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-secondary mb-2">{stats.activeAgents}</div>
                  <div className="text-xs sm:text-sm foreground-muted">Active Agents</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{stats.runningWorkflows}</div>
                  <div className="text-xs sm:text-sm foreground-muted">Workflows Running</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-warning mb-2">{stats.pendingApprovals}</div>
                  <div className="text-xs sm:text-sm foreground-muted">Pending Approvals</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Agent Monitor */}
        <section className="animate-fade-in">
          <AgentMonitor />
        </section>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 sm:gap-8">
          {/* Workflow Interface */}
          <section className="animate-fade-in">
            <WorkflowInterface />
          </section>

          {/* Approval Center */}
          <section className="animate-fade-in">
            <ApprovalCenter />
          </section>
        </div>

        {/* Audit Trail */}
        <section className="animate-fade-in">
          <AuditTrail />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;