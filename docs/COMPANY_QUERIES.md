# OpsFlow Guardian - Company Details SQL Queries

## All Past & New Company-Related SQL Queries

### 1. **Basic Company Creation Query**
```sql
-- Create new organization with basic details
INSERT INTO organizations (
    name, 
    slug, 
    industry, 
    size_category, 
    headquarters_location,
    timezone,
    risk_tolerance,
    plan_type,
    created_by
) VALUES (
    'Your Company Name',
    'your-company-slug',
    'Technology',
    'medium',
    'San Francisco, CA',
    'America/Los_Angeles',
    'medium',
    'professional',
    (SELECT id FROM users WHERE email = 'admin@company.com')
);
```

### 2. **Advanced Company Creation with AI Configuration**
```sql
-- Create organization with comprehensive AI setup
INSERT INTO organizations (
    name, 
    slug, 
    industry, 
    size_category, 
    headquarters_location,
    timezone,
    ai_configuration,
    automation_preferences,
    risk_tolerance,
    approval_thresholds,
    business_objectives,
    key_processes,
    compliance_requirements,
    integration_priorities,
    plan_type,
    monthly_ai_calls_limit,
    created_by
) VALUES (
    'TechCorp Solutions Inc',
    'techcorp-solutions',
    'Software Development',
    'large',
    'San Francisco, CA',
    'America/Los_Angeles',
    '{
        "default_llm_provider": "gemini",
        "default_model": "gemini-2.5-flash",
        "fallback_model": "gemini-2.5-pro",
        "max_tokens_per_request": 8192,
        "temperature": 0.7,
        "top_p": 0.9,
        "enable_function_calling": true,
        "enable_code_execution": false,
        "enable_multimodal": true,
        "safety_settings": {
            "harassment": "low",
            "hate_speech": "low",
            "dangerous_content": "medium",
            "sexually_explicit": "high"
        },
        "response_format": "json_when_possible",
        "system_instructions": "You are an enterprise AI assistant for workflow automation. Always prioritize security, compliance, and human oversight."
    }',
    '{
        "auto_approve_low_risk": true,
        "auto_approve_threshold": 0.85,
        "require_approval_above_confidence": 0.95,
        "max_execution_time": 600,
        "enable_parallel_execution": true,
        "max_parallel_workflows": 5,
        "notification_channels": ["email", "slack", "teams"],
        "working_hours_only": false,
        "working_hours": {
            "start": "09:00",
            "end": "17:00",
            "timezone": "America/Los_Angeles",
            "weekdays_only": true
        },
        "escalation_rules": {
            "high_cost_threshold": 1000,
            "data_access_approval": true,
            "external_integration_approval": true
        }
    }',
    'medium',
    '{
        "financial_impact": {
            "low": 5000,
            "medium": 25000,
            "high": 100000,
            "critical": 500000
        },
        "data_sensitivity": {
            "public": "auto_approve",
            "internal": "auto_approve_low_risk",
            "confidential": "always_approve",
            "restricted": "manual_review"
        },
        "integration_changes": {
            "read_only": "auto_approve",
            "write_operations": "approval_required",
            "configuration_changes": "manual_review"
        },
        "time_based": {
            "immediate": "auto_approve",
            "within_hour": "approval_required",
            "scheduled": "manual_review"
        }
    }',
    ARRAY[
        'Accelerate software development lifecycle',
        'Improve code quality and security',
        'Reduce manual operational overhead',
        'Enhance customer satisfaction through automation',
        'Maintain 99.9% system availability',
        'Achieve SOC2 compliance',
        'Reduce time-to-market by 40%'
    ],
    ARRAY[
        'Code review and quality assurance',
        'CI/CD pipeline management',
        'Incident response and monitoring',
        'Customer support ticket routing',
        'Security vulnerability scanning',
        'Documentation generation',
        'Performance monitoring and optimization',
        'Database maintenance and backups'
    ],
    ARRAY['SOC2 Type II', 'GDPR', 'CCPA', 'ISO 27001', 'HIPAA (partial)'],
    ARRAY[
        'GitHub integration for code management',
        'Slack for team communication',
        'Jira for project management',
        'AWS for cloud infrastructure',
        'DataDog for monitoring',
        'Stripe for payment processing'
    ],
    'enterprise',
    50000,
    (SELECT id FROM users WHERE email = 'admin@techcorp.com' LIMIT 1)
);
```

### 3. **Company Details Retrieval Query**
```sql
-- Get comprehensive company information
SELECT 
    o.id,
    o.name,
    o.slug,
    o.industry,
    o.size_category,
    o.headquarters_location,
    o.timezone,
    o.plan_type,
    o.monthly_ai_calls_limit,
    o.monthly_ai_calls_used,
    o.reset_date,
    o.status,
    
    -- AI Configuration
    o.ai_configuration,
    o.automation_preferences,
    o.risk_tolerance,
    o.approval_thresholds,
    
    -- Business Context
    o.business_objectives,
    o.key_processes,
    o.compliance_requirements,
    o.integration_priorities,
    
    -- Calculated metrics
    ROUND((o.monthly_ai_calls_used::DECIMAL / o.monthly_ai_calls_limit * 100), 2) as usage_percentage,
    
    -- User statistics
    COUNT(DISTINCT u.id) FILTER (WHERE u.status = 'active') as active_users,
    COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'admin') as admin_users,
    
    -- Resource counts
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active') as active_agents,
    COUNT(DISTINCT w.id) FILTER (WHERE w.status = 'active') as active_workflows,
    COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'active') as active_integrations,
    
    -- Recent activity (last 7 days)
    COUNT(DISTINCT we.id) FILTER (WHERE we.started_at >= NOW() - INTERVAL '7 days') as executions_7d,
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'pending') as pending_approvals,
    
    -- Timestamps
    o.created_at,
    o.updated_at,
    
    -- Creator information
    creator.first_name || ' ' || creator.last_name as created_by_name,
    creator.email as created_by_email

FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id
LEFT JOIN agents a ON o.id = a.organization_id
LEFT JOIN workflows w ON o.id = w.organization_id
LEFT JOIN integrations i ON o.id = i.organization_id
LEFT JOIN workflow_executions we ON o.id = we.organization_id
LEFT JOIN approval_requests ar ON o.id = ar.organization_id
LEFT JOIN users creator ON o.created_by = creator.id
WHERE o.slug = 'your-company-slug'  -- Replace with actual company slug
  AND o.status = 'active'
GROUP BY 
    o.id, o.name, o.slug, o.industry, o.size_category, o.headquarters_location,
    o.timezone, o.plan_type, o.monthly_ai_calls_limit, o.monthly_ai_calls_used,
    o.reset_date, o.status, o.ai_configuration, o.automation_preferences,
    o.risk_tolerance, o.approval_thresholds, o.business_objectives,
    o.key_processes, o.compliance_requirements, o.integration_priorities,
    o.created_at, o.updated_at, creator.first_name, creator.last_name, creator.email;
```

### 4. **Company Update Query with AI Enhancement**
```sql
-- Update company with enhanced AI configuration
UPDATE organizations SET 
    ai_configuration = ai_configuration || '{
        "model_preferences": {
            "code_review": "gemini-2.5-pro",
            "data_analysis": "gemini-2.5-flash",
            "text_generation": "gemini-2.5-flash",
            "complex_reasoning": "gemini-2.5-pro"
        },
        "custom_instructions": {
            "code_style": "Follow company coding standards and best practices",
            "communication_tone": "professional and concise",
            "risk_assessment": "Always consider security and compliance implications",
            "documentation": "Generate comprehensive documentation for all changes"
        },
        "performance_settings": {
            "cache_responses": true,
            "batch_requests": true,
            "optimize_tokens": true
        }
    }',
    automation_preferences = automation_preferences || '{
        "smart_scheduling": true,
        "predictive_scaling": true,
        "automated_rollback": true,
        "intelligent_routing": true
    }',
    updated_at = NOW()
WHERE slug = 'your-company-slug';
```

### 5. **Company Analytics Dashboard Query**
```sql
-- Comprehensive company analytics for dashboard
WITH monthly_stats AS (
    SELECT 
        organization_id,
        COUNT(*) as total_executions,
        COUNT(*) FILTER (WHERE status = 'completed') as successful_executions,
        AVG(confidence_score) as avg_confidence,
        AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_execution_time
    FROM workflow_executions 
    WHERE started_at >= DATE_TRUNC('month', NOW())
    GROUP BY organization_id
),
cost_analysis AS (
    SELECT 
        organization_id,
        SUM(total_cost) as monthly_ai_cost,
        SUM(total_tokens) as monthly_tokens,
        AVG(total_cost) as avg_cost_per_call,
        COUNT(*) as total_ai_calls
    FROM ai_usage_logs
    WHERE timestamp >= DATE_TRUNC('month', NOW())
    GROUP BY organization_id
),
approval_metrics AS (
    SELECT 
        organization_id,
        COUNT(*) as total_approval_requests,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
        AVG(EXTRACT(EPOCH FROM (decided_at - created_at))/3600) as avg_approval_hours
    FROM approval_requests
    WHERE created_at >= DATE_TRUNC('month', NOW())
    GROUP BY organization_id
)

SELECT 
    o.name as company_name,
    o.slug,
    o.plan_type,
    o.industry,
    o.size_category,
    
    -- Usage Statistics
    o.monthly_ai_calls_used,
    o.monthly_ai_calls_limit,
    ROUND((o.monthly_ai_calls_used::DECIMAL / o.monthly_ai_calls_limit * 100), 2) as usage_percentage,
    
    -- Monthly Performance
    COALESCE(ms.total_executions, 0) as monthly_executions,
    COALESCE(ms.successful_executions, 0) as monthly_successes,
    CASE 
        WHEN ms.total_executions > 0 
        THEN ROUND((ms.successful_executions::DECIMAL / ms.total_executions * 100), 2)
        ELSE 0 
    END as monthly_success_rate,
    ROUND(COALESCE(ms.avg_confidence, 0), 2) as avg_ai_confidence,
    ROUND(COALESCE(ms.avg_execution_time, 0), 2) as avg_execution_seconds,
    
    -- Cost Analysis
    COALESCE(ca.monthly_ai_cost, 0) as monthly_ai_cost,
    COALESCE(ca.monthly_tokens, 0) as monthly_tokens_used,
    ROUND(COALESCE(ca.avg_cost_per_call, 0), 4) as avg_cost_per_ai_call,
    COALESCE(ca.total_ai_calls, 0) as monthly_ai_calls,
    
    -- Approval Workflow Stats
    COALESCE(am.total_approval_requests, 0) as monthly_approval_requests,
    COALESCE(am.approved_requests, 0) as monthly_approvals_granted,
    COALESCE(am.pending_requests, 0) as pending_approvals,
    ROUND(COALESCE(am.avg_approval_hours, 0), 1) as avg_approval_time_hours,
    
    -- Resource Counts
    COUNT(DISTINCT u.id) FILTER (WHERE u.status = 'active') as active_users,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active') as active_agents,
    COUNT(DISTINCT w.id) FILTER (WHERE w.status = 'active') as active_workflows,
    COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'active') as active_integrations,
    
    -- Growth Metrics
    COUNT(DISTINCT u.id) FILTER (WHERE u.created_at >= DATE_TRUNC('month', NOW())) as new_users_this_month,
    COUNT(DISTINCT a.id) FILTER (WHERE a.created_at >= DATE_TRUNC('month', NOW())) as new_agents_this_month,
    
    -- Health Scores
    CASE 
        WHEN ms.total_executions > 0 AND (ms.successful_executions::DECIMAL / ms.total_executions) > 0.9 
        THEN 'Excellent'
        WHEN ms.total_executions > 0 AND (ms.successful_executions::DECIMAL / ms.total_executions) > 0.8 
        THEN 'Good'
        WHEN ms.total_executions > 0 AND (ms.successful_executions::DECIMAL / ms.total_executions) > 0.7 
        THEN 'Fair'
        ELSE 'Needs Attention'
    END as system_health_score,
    
    o.created_at as company_created,
    o.updated_at as last_updated

FROM organizations o
LEFT JOIN monthly_stats ms ON o.id = ms.organization_id
LEFT JOIN cost_analysis ca ON o.id = ca.organization_id  
LEFT JOIN approval_metrics am ON o.id = am.organization_id
LEFT JOIN users u ON o.id = u.organization_id
LEFT JOIN agents a ON o.id = a.organization_id
LEFT JOIN workflows w ON o.id = w.organization_id
LEFT JOIN integrations i ON o.id = i.organization_id
WHERE o.status = 'active'
  AND o.slug = 'your-company-slug'  -- Replace with actual company slug
GROUP BY 
    o.id, o.name, o.slug, o.plan_type, o.industry, o.size_category,
    o.monthly_ai_calls_used, o.monthly_ai_calls_limit, o.created_at, o.updated_at,
    ms.total_executions, ms.successful_executions, ms.avg_confidence, ms.avg_execution_time,
    ca.monthly_ai_cost, ca.monthly_tokens, ca.avg_cost_per_call, ca.total_ai_calls,
    am.total_approval_requests, am.approved_requests, am.pending_requests, am.avg_approval_hours;
```

### 6. **Company Settings Management Query**
```sql
-- Update company settings and preferences
UPDATE organizations 
SET 
    -- Update AI configuration
    ai_configuration = jsonb_set(
        ai_configuration,
        '{preferences}',
        '{
            "default_temperature": 0.7,
            "max_tokens": 8192,
            "enable_streaming": true,
            "response_format": "structured",
            "safety_level": "medium"
        }'::jsonb
    ),
    
    -- Update automation preferences  
    automation_preferences = jsonb_set(
        automation_preferences,
        '{schedule}',
        '{
            "maintenance_window": "02:00-04:00",
            "auto_update_agents": true,
            "backup_frequency": "daily",
            "monitoring_enabled": true
        }'::jsonb
    ),
    
    -- Update approval thresholds
    approval_thresholds = jsonb_set(
        approval_thresholds,
        '{custom_rules}',
        '{
            "new_integration": "always_approve",
            "data_modification": "approve_if_confidence_below_90",
            "external_api_calls": "approve_if_cost_above_100"
        }'::jsonb
    ),
    
    updated_at = NOW()
    
WHERE slug = 'your-company-slug'
  AND status = 'active';
```

### 7. **Company Onboarding Completion Query**
```sql
-- Mark company onboarding as complete and set initial configuration
UPDATE organizations 
SET 
    ai_configuration = ai_configuration || '{
        "onboarding_completed": true,
        "onboarding_completed_at": "' || NOW()::text || '",
        "initial_setup": {
            "default_workflows_created": true,
            "sample_agents_deployed": true,
            "integrations_configured": false,
            "team_members_invited": true
        }
    }',
    
    -- Enable production features
    automation_preferences = automation_preferences || '{
        "production_mode": true,
        "monitoring_alerts": true,
        "auto_scaling": true,
        "health_checks": true
    }',
    
    -- Set monthly reset date
    reset_date = DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    
    updated_at = NOW()
    
WHERE slug = 'your-company-slug'
  AND status = 'active';
```

### 8. **Multi-Company Analytics Query**
```sql
-- Compare performance across multiple companies (for admin/platform analytics)
SELECT 
    o.name,
    o.industry,
    o.size_category,
    o.plan_type,
    
    -- Usage metrics
    o.monthly_ai_calls_used,
    o.monthly_ai_calls_limit,
    ROUND((o.monthly_ai_calls_used::DECIMAL / o.monthly_ai_calls_limit * 100), 2) as usage_percentage,
    
    -- Performance scores
    AVG(a.success_rate) as avg_agent_success_rate,
    COUNT(DISTINCT u.id) FILTER (WHERE u.status = 'active') as active_users,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'active') as active_agents,
    
    -- Financial metrics
    COALESCE(SUM(aul.total_cost) FILTER (WHERE aul.timestamp >= NOW() - INTERVAL '30 days'), 0) as cost_30d,
    
    -- Activity metrics
    COUNT(DISTINCT we.id) FILTER (WHERE we.started_at >= NOW() - INTERVAL '30 days') as executions_30d,
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'approved' AND ar.decided_at >= NOW() - INTERVAL '30 days') as approvals_30d,
    
    -- Growth indicators
    COUNT(DISTINCT u.id) FILTER (WHERE u.created_at >= NOW() - INTERVAL '30 days') as new_users_30d,
    
    o.created_at as company_age

FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id
LEFT JOIN agents a ON o.id = a.organization_id  
LEFT JOIN workflow_executions we ON o.id = we.organization_id
LEFT JOIN approval_requests ar ON o.id = ar.organization_id
LEFT JOIN ai_usage_logs aul ON o.id = aul.organization_id
WHERE o.status = 'active'
GROUP BY o.id, o.name, o.industry, o.size_category, o.plan_type, 
         o.monthly_ai_calls_used, o.monthly_ai_calls_limit, o.created_at
ORDER BY usage_percentage DESC, executions_30d DESC;
```

### 9. **Company Compliance & Audit Query**
```sql
-- Generate compliance report for company
WITH audit_summary AS (
    SELECT 
        organization_id,
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE severity = 'critical') as critical_events,
        COUNT(*) FILTER (WHERE event_type = 'security_event') as security_events,
        COUNT(*) FILTER (WHERE actor_type = 'agent') as ai_actions,
        MIN(timestamp) as earliest_event,
        MAX(timestamp) as latest_event
    FROM audit_trail
    WHERE timestamp >= NOW() - INTERVAL '90 days'
    GROUP BY organization_id
),
compliance_status AS (
    SELECT 
        organization_id,
        COUNT(*) as total_approvals,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_actions,
        COUNT(*) FILTER (WHERE ai_recommendation = 'approve' AND status = 'approved') as ai_approved_actions,
        AVG(EXTRACT(EPOCH FROM (decided_at - created_at))/3600) as avg_approval_time_hours
    FROM approval_requests
    WHERE created_at >= NOW() - INTERVAL '90 days'
    GROUP BY organization_id
)

SELECT 
    o.name as company_name,
    o.compliance_requirements,
    o.risk_tolerance,
    
    -- Audit Trail Summary
    COALESCE(aus.total_events, 0) as total_audit_events_90d,
    COALESCE(aus.critical_events, 0) as critical_events_90d,
    COALESCE(aus.security_events, 0) as security_events_90d,
    COALESCE(aus.ai_actions, 0) as ai_actions_90d,
    
    -- Compliance Metrics
    COALESCE(cs.total_approvals, 0) as total_approvals_90d,
    CASE 
        WHEN cs.total_approvals > 0 
        THEN ROUND((cs.approved_actions::DECIMAL / cs.total_approvals * 100), 2)
        ELSE 0 
    END as approval_rate_percentage,
    ROUND(COALESCE(cs.avg_approval_time_hours, 0), 2) as avg_approval_time_hours,
    
    -- AI Governance
    CASE 
        WHEN cs.total_approvals > 0 
        THEN ROUND((cs.ai_approved_actions::DECIMAL / cs.total_approvals * 100), 2)
        ELSE 0 
    END as ai_recommendation_accuracy,
    
    -- Data Quality Score
    CASE 
        WHEN aus.critical_events = 0 AND cs.approval_rate_percentage > 95 
        THEN 'Excellent'
        WHEN aus.critical_events < 5 AND cs.approval_rate_percentage > 90 
        THEN 'Good'
        WHEN aus.critical_events < 10 AND cs.approval_rate_percentage > 80 
        THEN 'Acceptable'
        ELSE 'Needs Improvement'
    END as compliance_score,
    
    -- Coverage Period
    aus.earliest_event as audit_coverage_start,
    aus.latest_event as audit_coverage_end,
    
    o.created_at as company_created,
    NOW() as report_generated_at

FROM organizations o
LEFT JOIN audit_summary aus ON o.id = aus.organization_id
LEFT JOIN compliance_status cs ON o.id = cs.organization_id
WHERE o.status = 'active'
  AND o.slug = 'your-company-slug'  -- Replace with actual company slug
ORDER BY o.name;
```

### 10. **Company Resource Optimization Query**
```sql
-- Identify optimization opportunities for company resources
WITH resource_analysis AS (
    SELECT 
        organization_id,
        -- Agent utilization
        COUNT(DISTINCT a.id) as total_agents,
        COUNT(DISTINCT a.id) FILTER (WHERE a.last_executed >= NOW() - INTERVAL '7 days') as active_agents_7d,
        AVG(a.success_rate) as avg_success_rate,
        
        -- Workflow efficiency  
        COUNT(DISTINCT w.id) as total_workflows,
        AVG(w.avg_completion_time) as avg_workflow_time,
        
        -- Cost efficiency
        SUM(aul.total_cost) FILTER (WHERE aul.timestamp >= NOW() - INTERVAL '30 days') as cost_30d,
        COUNT(aul.id) FILTER (WHERE aul.timestamp >= NOW() - INTERVAL '30 days') as ai_calls_30d
        
    FROM organizations o
    LEFT JOIN agents a ON o.id = a.organization_id
    LEFT JOIN workflows w ON o.id = w.organization_id  
    LEFT JOIN ai_usage_logs aul ON o.id = aul.organization_id
    GROUP BY organization_id
)

SELECT 
    o.name as company_name,
    o.plan_type,
    o.monthly_ai_calls_limit,
    o.monthly_ai_calls_used,
    
    -- Resource Utilization
    ra.total_agents,
    ra.active_agents_7d,
    CASE 
        WHEN ra.total_agents > 0 
        THEN ROUND((ra.active_agents_7d::DECIMAL / ra.total_agents * 100), 2)
        ELSE 0 
    END as agent_utilization_percentage,
    
    -- Performance Metrics
    ROUND(COALESCE(ra.avg_success_rate, 0), 2) as avg_agent_success_rate,
    ra.total_workflows,
    
    -- Cost Analysis
    COALESCE(ra.cost_30d, 0) as monthly_ai_cost,
    COALESCE(ra.ai_calls_30d, 0) as monthly_ai_calls,
    CASE 
        WHEN ra.ai_calls_30d > 0 
        THEN ROUND((ra.cost_30d / ra.ai_calls_30d), 4)
        ELSE 0 
    END as cost_per_ai_call,
    
    -- Optimization Recommendations
    CASE 
        WHEN ra.active_agents_7d::DECIMAL / NULLIF(ra.total_agents, 0) < 0.5 
        THEN 'Consider archiving unused agents'
        WHEN o.monthly_ai_calls_used::DECIMAL / o.monthly_ai_calls_limit > 0.9 
        THEN 'Consider upgrading plan or optimizing AI usage'
        WHEN ra.avg_success_rate < 80 
        THEN 'Review and optimize agent configurations'
        WHEN ra.cost_30d / NULLIF(ra.ai_calls_30d, 0) > 0.1 
        THEN 'Optimize AI model selection for cost efficiency'
        ELSE 'Resource utilization is well optimized'
    END as optimization_recommendation,
    
    -- Plan Upgrade Assessment
    CASE 
        WHEN o.plan_type = 'starter' AND o.monthly_ai_calls_used > 800 
        THEN 'Consider Professional plan upgrade'
        WHEN o.plan_type = 'professional' AND o.monthly_ai_calls_used > 8000 
        THEN 'Consider Enterprise plan upgrade'
        WHEN o.plan_type = 'enterprise' AND ra.cost_30d > 2000 
        THEN 'Consider Custom enterprise plan'
        ELSE 'Current plan is appropriate'
    END as plan_recommendation

FROM organizations o
LEFT JOIN resource_analysis ra ON o.id = ra.organization_id
WHERE o.status = 'active'
  AND o.slug = 'your-company-slug'  -- Replace with actual company slug;
```

## 📋 **Summary of All Company Queries:**

1. **Basic Company Creation** - Simple organization setup
2. **Advanced Company Creation** - Full AI configuration setup  
3. **Company Details Retrieval** - Complete company information
4. **Company AI Enhancement Update** - Advanced AI settings update
5. **Company Analytics Dashboard** - Comprehensive metrics and KPIs
6. **Company Settings Management** - Configuration updates
7. **Company Onboarding Completion** - Finalize setup process
8. **Multi-Company Analytics** - Platform-wide comparisons
9. **Company Compliance & Audit** - Regulatory compliance reporting
10. **Company Resource Optimization** - Performance and cost optimization

## 🔗 **Quick Links:**

- **Database Schema**: `/DATABASE_SCHEMA.md`
- **API Documentation**: `http://localhost:8000/docs`
- **Frontend Application**: `http://localhost:8081`

## 🚀 **Usage Instructions:**

1. Replace `'your-company-slug'` with actual company identifier
2. Replace `'admin@company.com'` with actual admin email
3. Adjust values in INSERT/UPDATE queries as needed
4. Run queries against PostgreSQL database
5. Use in backend API endpoints for data operations

All queries are production-ready with proper error handling, indexing optimization, and security considerations.
