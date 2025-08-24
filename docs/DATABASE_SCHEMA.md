# OpsFlow Guardian 2.0 - Database Schema Documentation

## Overview
This document outlines the comprehensive database schema for OpsFlow Guardian 2.0, an AI-powered enterprise workflow automation platform with human oversight and complete audit trails.

## Core Philosophy
- **Zero-Trust Architecture**: All AI actions require validation
- **Complete Audit Trail**: Every change is logged with AI reasoning
- **Human-AI Collaboration**: Seamless approval workflows
- **Enterprise Security**: Role-based access control and encryption

---

## Table Structure

### 1. Organizations Table (Primary)

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    industry VARCHAR(100),
    size_category VARCHAR(50) CHECK (size_category IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    headquarters_location VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- AI Configuration
    ai_configuration JSONB NOT NULL DEFAULT '{}',
    automation_preferences JSONB NOT NULL DEFAULT '{}',
    risk_tolerance VARCHAR(20) DEFAULT 'medium' CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    approval_thresholds JSONB NOT NULL DEFAULT '{}',
    
    -- Business Context for AI
    business_objectives TEXT[],
    key_processes TEXT[],
    compliance_requirements TEXT[],
    integration_priorities TEXT[],
    
    -- Subscription & Limits
    plan_type VARCHAR(50) DEFAULT 'starter' CHECK (plan_type IN ('starter', 'professional', 'enterprise', 'custom')),
    monthly_ai_calls_limit INTEGER DEFAULT 1000,
    monthly_ai_calls_used INTEGER DEFAULT 0,
    reset_date DATE DEFAULT CURRENT_DATE + INTERVAL '1 month',
    
    -- Audit Fields
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    
    CONSTRAINT valid_ai_config CHECK (jsonb_typeof(ai_configuration) = 'object'),
    CONSTRAINT valid_automation_prefs CHECK (jsonb_typeof(automation_preferences) = 'object'),
    CONSTRAINT valid_approval_thresholds CHECK (jsonb_typeof(approval_thresholds) = 'object')
);
```

### 2. Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Basic Info
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(255),
    department VARCHAR(100),
    
    -- Authentication
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Authorization
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- AI Interaction Preferences
    notification_preferences JSONB DEFAULT '{"email": true, "in_app": true, "approvals": true}',
    ai_interaction_style VARCHAR(50) DEFAULT 'balanced' CHECK (ai_interaction_style IN ('conservative', 'balanced', 'aggressive')),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(organization_id, email)
);
```

### 3. AI Agents Table

```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    agent_type VARCHAR(50) NOT NULL CHECK (agent_type IN ('workflow', 'data', 'communication', 'integration', 'analytics', 'custom')),
    
    -- AI Configuration
    llm_provider VARCHAR(50) DEFAULT 'gemini' CHECK (llm_provider IN ('gemini', 'openai', 'anthropic', 'mistral', 'ollama')),
    llm_model VARCHAR(100) DEFAULT 'gemini-2.5-flash',
    system_prompt TEXT NOT NULL,
    tools JSONB DEFAULT '[]',
    
    -- Execution Settings
    auto_approve_threshold DECIMAL(3,2) DEFAULT 0.8,
    max_execution_time INTEGER DEFAULT 300, -- seconds
    retry_count INTEGER DEFAULT 3,
    
    -- Monitoring
    execution_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    avg_execution_time DECIMAL(10,2) DEFAULT 0,
    last_executed TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    
    CONSTRAINT valid_tools_array CHECK (jsonb_typeof(tools) = 'array')
);
```

### 4. Workflows Table

```sql
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    
    -- Workflow Definition
    trigger_conditions JSONB NOT NULL DEFAULT '{}',
    steps JSONB NOT NULL DEFAULT '[]',
    approval_rules JSONB NOT NULL DEFAULT '{}',
    
    -- AI Settings
    primary_agent_id UUID REFERENCES agents(id),
    requires_human_approval BOOLEAN DEFAULT TRUE,
    risk_level VARCHAR(20) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Execution Stats
    execution_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    avg_completion_time INTERVAL DEFAULT '0 minutes',
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    
    CONSTRAINT valid_trigger_conditions CHECK (jsonb_typeof(trigger_conditions) = 'object'),
    CONSTRAINT valid_steps_array CHECK (jsonb_typeof(steps) = 'array'),
    CONSTRAINT valid_approval_rules CHECK (jsonb_typeof(approval_rules) = 'object')
);
```

### 5. Workflow Executions (Plan Runs) Table

```sql
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id),
    
    -- Execution Context
    trigger_event JSONB NOT NULL DEFAULT '{}',
    execution_plan JSONB NOT NULL DEFAULT '[]',
    context_data JSONB DEFAULT '{}',
    
    -- Progress Tracking
    current_step INTEGER DEFAULT 0,
    total_steps INTEGER NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- AI Reasoning
    ai_reasoning TEXT,
    confidence_score DECIMAL(3,2),
    risk_assessment JSONB DEFAULT '{}',
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    
    -- Status & Results
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'running', 'completed', 'failed', 'cancelled', 'requires_approval')),
    result JSONB DEFAULT '{}',
    error_details TEXT,
    
    -- Human Oversight
    requires_approval BOOLEAN DEFAULT TRUE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    approval_notes TEXT,
    
    CONSTRAINT valid_trigger_event CHECK (jsonb_typeof(trigger_event) = 'object'),
    CONSTRAINT valid_execution_plan CHECK (jsonb_typeof(execution_plan) = 'array'),
    CONSTRAINT valid_risk_assessment CHECK (jsonb_typeof(risk_assessment) = 'object'),
    CONSTRAINT valid_result CHECK (jsonb_typeof(result) = 'object')
);
```

### 6. Approval Requests Table

```sql
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
    
    -- Request Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requested_action JSONB NOT NULL DEFAULT '{}',
    
    -- AI Analysis
    ai_recommendation VARCHAR(20) CHECK (ai_recommendation IN ('approve', 'reject', 'review')),
    ai_confidence DECIMAL(3,2),
    ai_reasoning TEXT,
    risk_factors TEXT[],
    impact_analysis JSONB DEFAULT '{}',
    
    -- Approval Flow
    approver_id UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    
    -- Resolution
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    decision_reason TEXT,
    decided_at TIMESTAMP WITH TIME ZONE,
    decided_by UUID REFERENCES users(id),
    
    -- Timing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_requested_action CHECK (jsonb_typeof(requested_action) = 'object'),
    CONSTRAINT valid_impact_analysis CHECK (jsonb_typeof(impact_analysis) = 'object')
);
```

### 7. Audit Trail Table

```sql
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Event Details
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'workflow', 'agent', 'approval', etc.
    entity_id UUID NOT NULL,
    
    -- Actor Information
    actor_type VARCHAR(20) NOT NULL CHECK (actor_type IN ('user', 'agent', 'system')),
    actor_id UUID, -- Can reference users or agents
    actor_name VARCHAR(255),
    
    -- Change Details
    action VARCHAR(50) NOT NULL,
    changes JSONB DEFAULT '{}',
    previous_values JSONB DEFAULT '{}',
    new_values JSONB DEFAULT '{}',
    
    -- Context
    execution_context JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- AI-specific fields
    ai_model VARCHAR(100),
    ai_reasoning TEXT,
    confidence_score DECIMAL(3,2),
    tokens_used INTEGER,
    
    -- Timing & Location
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    
    -- Additional tracking
    correlation_id UUID, -- For grouping related events
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    
    CONSTRAINT valid_changes CHECK (jsonb_typeof(changes) = 'object'),
    CONSTRAINT valid_previous_values CHECK (jsonb_typeof(previous_values) = 'object'),
    CONSTRAINT valid_new_values CHECK (jsonb_typeof(new_values) = 'object'),
    CONSTRAINT valid_execution_context CHECK (jsonb_typeof(execution_context) = 'object'),
    CONSTRAINT valid_metadata CHECK (jsonb_typeof(metadata) = 'object')
);
```

### 8. Integrations Table

```sql
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Integration Details
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'slack', 'jira', 'github', 'salesforce', etc.
    description TEXT,
    
    -- Configuration
    config JSONB NOT NULL DEFAULT '{}',
    credentials JSONB DEFAULT '{}', -- Encrypted
    webhook_url VARCHAR(500),
    
    -- Status & Health
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'pending_auth')),
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency INTERVAL DEFAULT '1 hour',
    health_check_passed BOOLEAN DEFAULT FALSE,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    
    -- Usage Stats
    requests_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    
    CONSTRAINT valid_config CHECK (jsonb_typeof(config) = 'object'),
    CONSTRAINT valid_credentials CHECK (jsonb_typeof(credentials) = 'object')
);
```

### 9. AI Model Usage & Billing Table

```sql
CREATE TABLE ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Request Details
    model_provider VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    request_type VARCHAR(50) NOT NULL, -- 'completion', 'embedding', 'tool_call', etc.
    
    -- Usage Metrics
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    
    -- Cost Tracking
    input_cost DECIMAL(10,4) DEFAULT 0,
    output_cost DECIMAL(10,4) DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    
    -- Context
    agent_id UUID REFERENCES agents(id),
    execution_id UUID REFERENCES workflow_executions(id),
    user_id UUID REFERENCES users(id),
    
    -- Performance
    response_time_ms INTEGER,
    cached_response BOOLEAN DEFAULT FALSE,
    
    -- Timestamp
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Monthly aggregation helper
    year_month INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM timestamp) * 100 + EXTRACT(MONTH FROM timestamp)) STORED
);
```

---

## Essential Indexes

```sql
-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_status ON organizations(status);

-- Users
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Agents
CREATE INDEX idx_agents_organization_id ON agents(organization_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_type ON agents(agent_type);

-- Workflows
CREATE INDEX idx_workflows_organization_id ON workflows(organization_id);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_category ON workflows(category);

-- Workflow Executions
CREATE INDEX idx_executions_organization_id ON workflow_executions(organization_id);
CREATE INDEX idx_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_executions_status ON workflow_executions(status);
CREATE INDEX idx_executions_started_at ON workflow_executions(started_at);

-- Approval Requests
CREATE INDEX idx_approval_requests_organization_id ON approval_requests(organization_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_approver_id ON approval_requests(approver_id);
CREATE INDEX idx_approval_requests_created_at ON approval_requests(created_at);

-- Audit Trail
CREATE INDEX idx_audit_trail_organization_id ON audit_trail(organization_id);
CREATE INDEX idx_audit_trail_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_trail_actor ON audit_trail(actor_type, actor_id);
CREATE INDEX idx_audit_trail_timestamp ON audit_trail(timestamp);
CREATE INDEX idx_audit_trail_event_type ON audit_trail(event_type);
CREATE INDEX idx_audit_trail_correlation_id ON audit_trail(correlation_id);

-- AI Usage Logs
CREATE INDEX idx_ai_usage_organization_id ON ai_usage_logs(organization_id);
CREATE INDEX idx_ai_usage_timestamp ON ai_usage_logs(timestamp);
CREATE INDEX idx_ai_usage_year_month ON ai_usage_logs(year_month);
CREATE INDEX idx_ai_usage_agent_id ON ai_usage_logs(agent_id);
```

---

## Views for Common Queries

### Organization Dashboard View

```sql
CREATE VIEW organization_dashboard AS
SELECT 
    o.id,
    o.name,
    o.plan_type,
    o.monthly_ai_calls_limit,
    o.monthly_ai_calls_used,
    
    -- User counts
    COUNT(DISTINCT u.id) FILTER (WHERE u.status = 'active') as active_users,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active') as active_agents,
    COUNT(DISTINCT w.id) FILTER (WHERE w.status = 'active') as active_workflows,
    
    -- Recent activity
    COUNT(DISTINCT we.id) FILTER (WHERE we.started_at >= NOW() - INTERVAL '24 hours') as executions_24h,
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'pending') as pending_approvals,
    
    -- Success metrics
    COALESCE(AVG(a.success_rate), 0) as avg_agent_success_rate,
    COUNT(DISTINCT we.id) FILTER (WHERE we.status = 'completed' AND we.started_at >= NOW() - INTERVAL '7 days') as successful_executions_7d,
    
    o.created_at,
    o.updated_at

FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id
LEFT JOIN agents a ON o.id = a.organization_id
LEFT JOIN workflows w ON o.id = w.organization_id
LEFT JOIN workflow_executions we ON o.id = we.organization_id
LEFT JOIN approval_requests ar ON o.id = ar.organization_id
WHERE o.status = 'active'
GROUP BY o.id, o.name, o.plan_type, o.monthly_ai_calls_limit, o.monthly_ai_calls_used, o.created_at, o.updated_at;
```

### Agent Performance View

```sql
CREATE VIEW agent_performance AS
SELECT 
    a.id,
    a.organization_id,
    a.name,
    a.agent_type,
    a.llm_model,
    a.execution_count,
    a.success_rate,
    a.avg_execution_time,
    a.last_executed,
    
    -- Recent performance (last 30 days)
    COUNT(we.id) FILTER (WHERE we.started_at >= NOW() - INTERVAL '30 days') as executions_30d,
    COUNT(we.id) FILTER (WHERE we.status = 'completed' AND we.started_at >= NOW() - INTERVAL '30 days') as successes_30d,
    
    -- Average confidence and timing
    AVG(we.confidence_score) FILTER (WHERE we.started_at >= NOW() - INTERVAL '30 days') as avg_confidence_30d,
    AVG(EXTRACT(EPOCH FROM (we.completed_at - we.started_at))) FILTER (WHERE we.completed_at IS NOT NULL AND we.started_at >= NOW() - INTERVAL '30 days') as avg_duration_seconds_30d,
    
    -- Cost analysis
    COALESCE(SUM(aul.total_cost) FILTER (WHERE aul.timestamp >= NOW() - INTERVAL '30 days'), 0) as cost_30d,
    COALESCE(SUM(aul.total_tokens) FILTER (WHERE aul.timestamp >= NOW() - INTERVAL '30 days'), 0) as tokens_30d

FROM agents a
LEFT JOIN workflow_executions we ON a.id = we.agent_id
LEFT JOIN ai_usage_logs aul ON a.id = aul.agent_id
WHERE a.status IN ('active', 'paused')
GROUP BY a.id, a.organization_id, a.name, a.agent_type, a.llm_model, a.execution_count, a.success_rate, a.avg_execution_time, a.last_executed;
```

---

## Sample SQL Queries

### 1. Organization Setup Query

```sql
-- Insert a new organization with comprehensive AI configuration
INSERT INTO organizations (
    name, 
    slug, 
    industry, 
    size_category, 
    headquarters_location,
    ai_configuration,
    automation_preferences,
    risk_tolerance,
    approval_thresholds,
    business_objectives,
    key_processes,
    compliance_requirements,
    plan_type
) VALUES (
    'TechCorp Inc',
    'techcorp-inc',
    'Software Development',
    'medium',
    'San Francisco, CA',
    '{
        "default_llm_provider": "gemini",
        "default_model": "gemini-2.5-flash",
        "max_tokens_per_request": 8192,
        "temperature": 0.7,
        "enable_function_calling": true,
        "enable_code_execution": false,
        "safety_settings": {
            "harassment": "low",
            "hate_speech": "low",
            "dangerous_content": "medium"
        }
    }',
    '{
        "auto_approve_low_risk": true,
        "require_approval_above_confidence": 0.85,
        "max_execution_time": 600,
        "enable_parallel_execution": true,
        "notification_channels": ["email", "slack"],
        "working_hours_only": false
    }',
    'medium',
    '{
        "financial_impact": {
            "low": 1000,
            "medium": 10000,
            "high": 50000
        },
        "data_access": {
            "public": "auto",
            "internal": "approval",
            "confidential": "manual_review"
        },
        "integration_changes": "always_approve"
    }',
    ARRAY['Improve development velocity', 'Reduce manual processes', 'Enhance code quality', 'Automate deployment pipelines'],
    ARRAY['Code review automation', 'CI/CD pipeline management', 'Issue triaging', 'Documentation generation'],
    ARRAY['SOC2', 'GDPR', 'HIPAA'],
    'professional'
);
```

### 2. Create AI Agent Query

```sql
-- Create a comprehensive AI agent for workflow automation
INSERT INTO agents (
    organization_id,
    name,
    description,
    agent_type,
    llm_provider,
    llm_model,
    system_prompt,
    tools,
    auto_approve_threshold,
    max_execution_time,
    created_by
) VALUES (
    (SELECT id FROM organizations WHERE slug = 'techcorp-inc'),
    'Code Review Assistant',
    'AI agent that analyzes pull requests, provides feedback, and ensures code quality standards',
    'workflow',
    'gemini',
    'gemini-2.5-pro',
    'You are an expert software engineer and code reviewer. Your role is to analyze pull requests and provide constructive feedback on code quality, security, performance, and maintainability. Always explain your reasoning and suggest specific improvements.',
    '[
        {
            "name": "analyze_code_diff",
            "description": "Analyze git diff for code quality issues",
            "parameters": {
                "type": "object",
                "properties": {
                    "diff": {"type": "string", "description": "Git diff content"},
                    "programming_language": {"type": "string", "description": "Primary programming language"}
                }
            }
        },
        {
            "name": "check_security_vulnerabilities",
            "description": "Scan code for potential security issues",
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {"type": "string", "description": "Code to analyze"},
                    "language": {"type": "string", "description": "Programming language"}
                }
            }
        },
        {
            "name": "suggest_improvements",
            "description": "Generate improvement suggestions",
            "parameters": {
                "type": "object",
                "properties": {
                    "analysis_results": {"type": "object", "description": "Results from code analysis"}
                }
            }
        }
    ]',
    0.80,
    300,
    (SELECT id FROM users WHERE email = 'admin@techcorp.com')
);
```

### 3. Complex Analytics Query

```sql
-- Comprehensive organization analytics query
SELECT 
    o.name as organization,
    o.plan_type,
    
    -- User & Resource Counts
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT a.id) as total_agents,
    COUNT(DISTINCT w.id) as total_workflows,
    
    -- Execution Statistics (Last 30 Days)
    COUNT(DISTINCT we.id) FILTER (WHERE we.started_at >= NOW() - INTERVAL '30 days') as executions_30d,
    COUNT(DISTINCT we.id) FILTER (WHERE we.status = 'completed' AND we.started_at >= NOW() - INTERVAL '30 days') as successful_executions_30d,
    
    -- Success Rate Calculation
    CASE 
        WHEN COUNT(DISTINCT we.id) FILTER (WHERE we.started_at >= NOW() - INTERVAL '30 days') > 0 
        THEN ROUND(
            (COUNT(DISTINCT we.id) FILTER (WHERE we.status = 'completed' AND we.started_at >= NOW() - INTERVAL '30 days')::DECIMAL / 
             COUNT(DISTINCT we.id) FILTER (WHERE we.started_at >= NOW() - INTERVAL '30 days')) * 100, 
            2
        )
        ELSE 0 
    END as success_rate_30d,
    
    -- Approval Statistics
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.created_at >= NOW() - INTERVAL '30 days') as approval_requests_30d,
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'approved' AND ar.created_at >= NOW() - INTERVAL '30 days') as approvals_granted_30d,
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'pending') as pending_approvals,
    
    -- AI Usage & Costs
    COALESCE(SUM(aul.total_tokens) FILTER (WHERE aul.timestamp >= NOW() - INTERVAL '30 days'), 0) as tokens_used_30d,
    COALESCE(SUM(aul.total_cost) FILTER (WHERE aul.timestamp >= NOW() - INTERVAL '30 days'), 0) as ai_cost_30d,
    
    -- Performance Metrics
    AVG(EXTRACT(EPOCH FROM (we.completed_at - we.started_at))) FILTER (WHERE we.completed_at IS NOT NULL AND we.started_at >= NOW() - INTERVAL '30 days') as avg_execution_time_seconds,
    AVG(we.confidence_score) FILTER (WHERE we.started_at >= NOW() - INTERVAL '30 days') as avg_confidence_score,
    
    -- Risk Assessment
    COUNT(DISTINCT we.id) FILTER (WHERE we.status = 'requires_approval' AND we.started_at >= NOW() - INTERVAL '30 days') as high_risk_executions_30d,
    
    -- Growth Metrics
    COUNT(DISTINCT u.id) FILTER (WHERE u.created_at >= NOW() - INTERVAL '30 days') as new_users_30d,
    COUNT(DISTINCT a.id) FILTER (WHERE a.created_at >= NOW() - INTERVAL '30 days') as new_agents_30d

FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id AND u.status = 'active'
LEFT JOIN agents a ON o.id = a.organization_id AND a.status IN ('active', 'paused')
LEFT JOIN workflows w ON o.id = w.organization_id AND w.status = 'active'
LEFT JOIN workflow_executions we ON o.id = we.organization_id
LEFT JOIN approval_requests ar ON o.id = ar.organization_id
LEFT JOIN ai_usage_logs aul ON o.id = aul.organization_id
WHERE o.status = 'active'
GROUP BY o.id, o.name, o.plan_type
ORDER BY tokens_used_30d DESC;
```

### 4. Audit Trail Analysis Query

```sql
-- Comprehensive audit trail analysis for security and compliance
SELECT 
    DATE_TRUNC('day', at.timestamp) as date,
    o.name as organization,
    
    -- Activity Breakdown
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE at.actor_type = 'user') as user_actions,
    COUNT(*) FILTER (WHERE at.actor_type = 'agent') as agent_actions,
    COUNT(*) FILTER (WHERE at.actor_type = 'system') as system_actions,
    
    -- Event Types
    COUNT(*) FILTER (WHERE at.event_type = 'workflow_execution') as workflow_events,
    COUNT(*) FILTER (WHERE at.event_type = 'approval_request') as approval_events,
    COUNT(*) FILTER (WHERE at.event_type = 'configuration_change') as config_changes,
    COUNT(*) FILTER (WHERE at.event_type = 'security_event') as security_events,
    
    -- Risk Levels
    COUNT(*) FILTER (WHERE at.severity = 'error') as error_events,
    COUNT(*) FILTER (WHERE at.severity = 'warning') as warning_events,
    COUNT(*) FILTER (WHERE at.severity = 'critical') as critical_events,
    
    -- AI-specific metrics
    AVG(at.confidence_score) FILTER (WHERE at.confidence_score IS NOT NULL) as avg_ai_confidence,
    SUM(at.tokens_used) FILTER (WHERE at.tokens_used IS NOT NULL) as total_ai_tokens,
    
    -- Unique actors
    COUNT(DISTINCT at.actor_id) FILTER (WHERE at.actor_type = 'user') as unique_users,
    COUNT(DISTINCT at.actor_id) FILTER (WHERE at.actor_type = 'agent') as unique_agents

FROM audit_trail at
JOIN organizations o ON at.organization_id = o.id
WHERE at.timestamp >= NOW() - INTERVAL '7 days'
  AND o.status = 'active'
GROUP BY DATE_TRUNC('day', at.timestamp), o.id, o.name
ORDER BY date DESC, total_events DESC;
```

### 5. Organization Performance Optimization Query

```sql
-- Identify optimization opportunities for organizations
WITH agent_performance AS (
    SELECT 
        organization_id,
        agent_id,
        COUNT(*) as executions,
        AVG(confidence_score) as avg_confidence,
        COUNT(*) FILTER (WHERE status = 'completed') as successes,
        AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration
    FROM workflow_executions 
    WHERE started_at >= NOW() - INTERVAL '30 days'
    GROUP BY organization_id, agent_id
),
approval_patterns AS (
    SELECT 
        organization_id,
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
        AVG(EXTRACT(EPOCH FROM (decided_at - created_at))) as avg_approval_time,
        AVG(ai_confidence) as avg_ai_confidence
    FROM approval_requests
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY organization_id
)

SELECT 
    o.name as organization,
    o.risk_tolerance,
    
    -- Current Performance
    COALESCE(ap_perf.avg_confidence, 0) as avg_agent_confidence,
    COALESCE(ap_patterns.avg_ai_confidence, 0) as avg_approval_ai_confidence,
    
    -- Optimization Opportunities
    CASE 
        WHEN ap_patterns.avg_ai_confidence > 0.9 AND o.risk_tolerance = 'low' 
        THEN 'Consider increasing auto-approval threshold'
        WHEN ap_perf.avg_confidence < 0.7 
        THEN 'Review agent prompts and training'
        WHEN ap_patterns.avg_approval_time > 3600 
        THEN 'Approval workflow optimization needed'
        ELSE 'Performance within acceptable range'
    END as recommendation,
    
    -- Metrics for Decision Making
    ap_patterns.total_requests as approval_requests_30d,
    ap_patterns.approved_requests,
    ap_patterns.avg_approval_time / 3600 as avg_approval_hours,
    
    -- Cost Optimization Potential
    CASE 
        WHEN aul.total_cost > 1000 AND ap_perf.avg_confidence > 0.85
        THEN 'Consider using lighter model for high-confidence scenarios'
        WHEN aul.total_tokens > 100000 AND o.plan_type = 'starter'
        THEN 'Plan upgrade recommended'
        ELSE 'Cost optimization not immediately needed'
    END as cost_optimization

FROM organizations o
LEFT JOIN (
    SELECT organization_id, AVG(avg_confidence) as avg_confidence
    FROM agent_performance 
    GROUP BY organization_id
) ap_perf ON o.id = ap_perf.organization_id
LEFT JOIN approval_patterns ap_patterns ON o.id = ap_patterns.organization_id
LEFT JOIN (
    SELECT organization_id, SUM(total_cost) as total_cost, SUM(total_tokens) as total_tokens
    FROM ai_usage_logs 
    WHERE timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY organization_id
) aul ON o.id = aul.organization_id
WHERE o.status = 'active'
ORDER BY ap_patterns.total_requests DESC NULLS LAST;
```

---

## Triggers for Automated Updates

```sql
-- Auto-update organization updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update monthly AI usage
CREATE OR REPLACE FUNCTION update_ai_usage_counter()
RETURNS TRIGGER AS $$
BEGIN
    -- Update organization's monthly usage counter
    UPDATE organizations 
    SET monthly_ai_calls_used = monthly_ai_calls_used + 1,
        updated_at = NOW()
    WHERE id = NEW.organization_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_ai_usage
    AFTER INSERT ON ai_usage_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_usage_counter();

-- Auto-calculate agent success rates
CREATE OR REPLACE FUNCTION update_agent_stats()
RETURNS TRIGGER AS $$
DECLARE
    total_executions INTEGER;
    successful_executions INTEGER;
    new_success_rate DECIMAL(5,2);
BEGIN
    -- Calculate new statistics
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'completed')
    INTO total_executions, successful_executions
    FROM workflow_executions 
    WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id);
    
    -- Calculate success rate
    IF total_executions > 0 THEN
        new_success_rate := (successful_executions::DECIMAL / total_executions) * 100;
    ELSE
        new_success_rate := 0;
    END IF;
    
    -- Update agent statistics
    UPDATE agents 
    SET 
        execution_count = total_executions,
        success_rate = new_success_rate,
        last_executed = NOW(),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.agent_id, OLD.agent_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agent_statistics
    AFTER INSERT OR UPDATE OR DELETE ON workflow_executions
    FOR EACH ROW
    WHEN (NEW.agent_id IS NOT NULL OR OLD.agent_id IS NOT NULL)
    EXECUTE FUNCTION update_agent_stats();
```

---

## Security & Compliance Features

### Row Level Security (RLS)

```sql
-- Enable RLS on all organization-scoped tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for organization isolation
CREATE POLICY organization_isolation ON organizations
    FOR ALL TO authenticated
    USING (id = current_setting('app.current_organization_id')::UUID);

CREATE POLICY user_organization_access ON users
    FOR ALL TO authenticated
    USING (organization_id = current_setting('app.current_organization_id')::UUID);

-- Similar policies for other tables...
```

### Encryption Configuration

```sql
-- Create extension for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT, key TEXT DEFAULT 'default_org_key')
RETURNS TEXT AS $$
BEGIN
    RETURN encode(pgp_sym_encrypt(data, key), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT, key TEXT DEFAULT 'default_org_key')
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(decode(encrypted_data, 'base64'), key);
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

This comprehensive database schema provides:

1. **Complete Organization Management** - Full org structure with AI configuration
2. **Advanced AI Integration** - Native support for Portia SDK and Gemini models
3. **Human-AI Collaboration** - Sophisticated approval workflows
4. **Complete Audit Trail** - Every action tracked with AI reasoning
5. **Performance Analytics** - Built-in views for monitoring and optimization
6. **Security & Compliance** - RLS, encryption, and compliance tracking
7. **Scalability** - Proper indexing and query optimization
8. **Cost Management** - Token usage and billing integration

The schema is production-ready and designed to support the full OpsFlow Guardian 2.0 vision of AI-powered enterprise automation with complete human oversight.
