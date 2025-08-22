# 🔗 OpsFlow Guardian 2.0 - Agent Links & Integration Requirements

## 📋 **Required Agent Links Configuration**

This document outlines all the essential URLs and endpoints required for the OpsFlow Guardian 2.0 agent system to function properly.

---

## 🤖 **AI Model Provider URLs**

### Required for AI Agent Functionality:
```env
OPENAI_BASE_URL=https://api.openai.com/v1
ANTHROPIC_BASE_URL=https://api.anthropic.com
GOOGLE_AI_BASE_URL=https://generativelanguage.googleapis.com/v1
MISTRAL_BASE_URL=https://api.mistral.ai/v1
OLLAMA_BASE_URL=http://localhost:11434
```

**Purpose**: Direct communication with AI model providers for agent decision-making and task execution.

---

## 🎯 **Portia SDK Integration**

### Core Portia Platform URLs:
```env
PORTIA_BASE_URL=https://app.portialabs.ai
PORTIA_WEBSOCKET_URL=wss://app.portialabs.ai
PORTIA_DOCS_URL=https://docs.portialabs.ai
PORTIA_STATUS_URL=https://status.portialabs.ai
PORTIA_DASHBOARD_URL=https://app.portialabs.ai
PORTIA_API_URL=https://api.portialabs.ai
PORTIA_GITHUB_URL=https://github.com/portiaAI/portia-sdk-python
PORTIA_EXAMPLES_URL=https://github.com/portiaAI/portia-agent-examples
PORTIA_DISCORD_URL=https://discord.gg/DvAJz9ffaR
```

**Purpose**: Integration with Portia Labs' multi-agent orchestration platform for advanced workflow automation with transparent, steerable, and authenticated agents.

---

## 🔗 **Third-Party Service Integrations**

### Slack Integration:
```env
SLACK_API_URL=https://slack.com/api
SLACK_OAUTH_URL=https://slack.com/oauth/v2/authorize
SLACK_WEBHOOK_URL=https://hooks.slack.com/services
```

### Notion Integration:
```env
NOTION_API_URL=https://api.notion.com/v1
NOTION_OAUTH_URL=https://api.notion.com/v1/oauth/authorize
```

### JIRA Integration:
```env
JIRA_API_BASE_URL=https://your-domain.atlassian.net/rest/api/3
JIRA_WEBHOOK_URL=https://your-domain.atlassian.net/rest/webhooks/1.0
```

### OAuth Providers:
```env
GOOGLE_OAUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
GOOGLE_TOKEN_URL=https://oauth2.googleapis.com/token
GOOGLE_USERINFO_URL=https://www.googleapis.com/oauth2/v1/userinfo

GITHUB_API_URL=https://api.github.com
GITHUB_OAUTH_URL=https://github.com/login/oauth/authorize
GITHUB_TOKEN_URL=https://github.com/login/oauth/access_token

MICROSOFT_GRAPH_URL=https://graph.microsoft.com/v1.0
MICROSOFT_OAUTH_URL=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
MICROSOFT_TOKEN_URL=https://login.microsoftonline.com/common/oauth2/v2.0/token
```

---

## 💳 **Payment & Billing Services**

### Stripe Integration:
```env
STRIPE_API_URL=https://api.stripe.com/v1
STRIPE_DASHBOARD_URL=https://dashboard.stripe.com
STRIPE_WEBHOOK_URL=https://api.stripe.com/v1/webhook_endpoints
```

**Purpose**: Handle subscription billing and payment processing for enterprise features.

---

## 📱 **Communication Services**

### Email & SMS:
```env
SENDGRID_API_URL=https://api.sendgrid.com/v3
TWILIO_API_URL=https://api.twilio.com/2010-04-01
TWILIO_VERIFY_URL=https://verify.twilio.com/v2
```

**Purpose**: Send notifications, alerts, and verification messages.

---

## 🌐 **Browser Automation**

### Web Scraping & Automation:
```env
BROWSERBASE_API_URL=https://api.browserbase.com
PLAYWRIGHT_SERVICE_URL=http://localhost:3000
```

**Purpose**: Enable agents to interact with web applications and perform browser-based tasks.

---

## 🗄️ **Database & Storage**

### Core Storage:
```env
POSTGRESQL_CONNECTION_URL=postgresql://opsflow:password@localhost:5432/opsflow_guardian
REDIS_ADMIN_URL=http://localhost:8001
REDIS_INSIGHT_URL=http://localhost:8001
```

### File Storage:
```env
AWS_S3_ENDPOINT=https://s3.amazonaws.com
MINIO_ENDPOINT=http://localhost:9000
CLOUDINARY_URL=https://api.cloudinary.com/v1_1/your-cloud-name
```

---

## 📊 **Monitoring & Analytics**

### Observability Stack:
```env
PROMETHEUS_URL=http://localhost:9090
GRAFANA_URL=http://localhost:3000
ELASTICSEARCH_URL=http://localhost:9200
KIBANA_URL=http://localhost:5601
```

**Purpose**: Monitor agent performance, track metrics, and analyze system behavior.

---

## 🔧 **Development & Testing**

### Development Tools:
```env
JUPYTER_NOTEBOOK_URL=http://localhost:8888
PGADMIN_URL=http://localhost:5050
REDIS_COMMANDER_URL=http://localhost:8081
```

**Purpose**: Development and debugging tools for agent development.

---

## 🎣 **Webhook & Callback URLs**

### Agent Communication:
```env
AGENT_WEBHOOK_BASE_URL=https://your-domain.com/webhooks
WORKFLOW_CALLBACK_URL=https://your-domain.com/api/v1/workflows/callback
APPROVAL_CALLBACK_URL=https://your-domain.com/api/v1/approvals/callback
AUDIT_WEBHOOK_URL=https://your-domain.com/api/v1/audit/webhook
```

**Purpose**: Enable real-time communication between agents and external services.

---

## 🔒 **Security & Authentication**

### Identity Providers:
```env
AUTH0_DOMAIN=https://your-domain.auth0.com
OKTA_DOMAIN=https://your-domain.okta.com
KEYCLOAK_URL=http://localhost:8080/auth
```

**Purpose**: Enterprise-grade authentication and authorization.

---

## 📡 **Message Queues**

### Async Communication:
```env
RABBITMQ_URL=amqp://localhost:5672
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
PULSAR_SERVICE_URL=pulsar://localhost:6650
```

**Purpose**: Handle asynchronous communication between agents and services.

---

## 🐳 **Container & Orchestration**

### Infrastructure:
```env
DOCKER_REGISTRY_URL=https://registry.docker.com
KUBERNETES_API_URL=https://kubernetes.default.svc
PORTAINER_URL=http://localhost:9000
```

**Purpose**: Container management and orchestration for scalable deployments.

---

## 🚀 **CI/CD Pipeline**

### Deployment Automation:
```env
JENKINS_URL=http://localhost:8080
GITLAB_CI_URL=https://gitlab.com/api/v4
GITHUB_ACTIONS_URL=https://api.github.com/repos/owner/repo/actions
```

**Purpose**: Automated deployment and continuous integration.

---

## 🏥 **Health Monitoring**

### System Health:
```env
HEALTH_CHECK_ENDPOINT=/health
READINESS_PROBE_ENDPOINT=/ready
LIVENESS_PROBE_ENDPOINT=/alive
METRICS_ENDPOINT=/metrics
```

**Purpose**: Monitor system health and agent availability.

---

## 🔧 **Setup Instructions**

### 1. Copy Environment File:
```bash
cp backend/.env.example backend/.env
```

### 2. Fill in Required URLs:
- Replace placeholder URLs with your actual service endpoints
- Add your API keys and credentials
- Configure OAuth redirect URLs

### 3. Validate Configuration:
```bash
python3 test_auth.py
```

### 4. Test Agent Connectivity:
- Check each service endpoint
- Verify API keys and authentication
- Test webhook endpoints

---

## ⚠️ **Important Notes**

1. **Security**: Never commit actual API keys to version control
2. **Testing**: Use test/sandbox URLs for development
3. **Rate Limits**: Configure appropriate rate limiting for external APIs
4. **Monitoring**: Set up health checks for all critical endpoints
5. **Fallbacks**: Implement fallback URLs for high-availability services

---

## 📞 **Support**

For issues with specific integrations:
- **Portia SDK**: https://docs.portia.ai/support
- **OAuth Issues**: Check provider-specific documentation
- **Database**: Verify connection strings and credentials
- **Webhooks**: Test with tools like ngrok for local development

---

*This configuration enables full agent functionality with comprehensive third-party integrations and monitoring capabilities.*
