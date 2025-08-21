import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AgentMonitor } from '@/components/agents/AgentMonitor';
import { WorkflowInterface } from '@/components/workflow/WorkflowInterface';
import { ApprovalCenter } from '@/components/approval/ApprovalCenter';
import { AuditTrail } from '@/components/audit/AuditTrail';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-6">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 mesh-background rounded-xl"></div>
          <div className="relative glass-card p-8 rounded-xl border-0">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold gradient-text mb-4">
                OpsFlow Guardian 2.0
              </h1>
              <p className="text-xl foreground-muted mb-8">
                AI-Powered Workflow Automation with Human Oversight & Complete Audit Trails
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-3xl font-bold text-secondary mb-2">3</div>
                  <div className="text-sm foreground-muted">Active Agents</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">12</div>
                  <div className="text-sm foreground-muted">Workflows Running</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-3xl font-bold text-warning mb-2">2</div>
                  <div className="text-sm foreground-muted">Pending Approvals</div>
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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