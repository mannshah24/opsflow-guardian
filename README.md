# �� OpsFlow Guardian 2.0

**AI-Powered Enterprise Workflow Automation with Human Oversight & Complete Audit Trails**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)

## ✨ Features

### 🤖 **AI-Powered Automation**
- **Multi-Agent System**: Specialized AI agents for planning, execution, and auditing
- **Industry-Specific Personalization**: Tailored workflows based on company industry and size
- **Intelligent Decision Making**: Context-aware automation with confidence scoring
- **Continuous Learning**: Agents improve performance based on execution history

### 🔒 **Enterprise Security & Compliance**
- **Complete Audit Trails**: Every action tracked with timestamps and user context
- **Role-Based Access Control**: Fine-grained permissions for users and organizations
- **Human Approval Workflows**: Critical actions require explicit human oversight
- **Data Encryption**: Sensitive data encrypted at rest and in transit

### 🏢 **Multi-Tenant Architecture**
- **Organization Management**: Support for multiple companies with isolated data
- **User Management**: Flexible user roles and permissions per organization
- **Company Profiling**: Industry-specific settings and automation preferences
- **Scalable Infrastructure**: Designed for enterprise-level deployment

### 🔧 **Workflow Management**
- **Visual Workflow Builder**: Drag-and-drop interface for creating complex workflows
- **Template Library**: Pre-built workflows for common business processes
- **Real-Time Monitoring**: Live status updates and performance metrics
- **Error Handling**: Automatic retry logic and failure notifications

### 📊 **Analytics & Insights**
- **Performance Dashboards**: Real-time metrics for workflows and agents
- **Success Rate Tracking**: Monitor automation effectiveness over time
- **Cost Analysis**: Track resource usage and optimization opportunities
- **Compliance Reporting**: Generate reports for regulatory requirements

## 🚀 Live Demo

**🌐 Frontend:** [https://opsflow-guardian.vercel.app](https://opsflow-guardian.vercel.app)  
**🔧 Backend API:** [https://ops-backend-production-7ddf.up.railway.app](https://ops-backend-production-7ddf.up.railway.app)

### Tech Stack
- **Frontend:** React 18 + TypeScript, deployed on Vercel
- **Backend:** FastAPI + Python, deployed on Railway
- **Database:** PostgreSQL with Redis caching
- **AI:** Google Gemini 2.5 + Portia AI SDK
- **Integrations:** 20+ enterprise services

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vite)  │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼────┐ ┌──▼─────┐
            │ Planner   │ │Executor│ │Auditor │
            │ Agent     │ │ Agent  │ │ Agent  │
            └───────────┘ └────────┘ └────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **PostgreSQL 13+**
- **Git**

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/Kartikvyas1604/opsflow-guardian.git
cd opsflow-guardian
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
./setup_new_database.sh

# Start backend server
python main.py
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../  # Back to root directory

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: ops-backend-production-7ddf.up.railway.app
- **API Documentation**: ops-backend-production-7ddf.up.railway.app/docs

## 📚 Documentation

- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Complete database structure and relationships
- **[Company Onboarding](docs/COMPANY_ONBOARDING_FLOW.md)** - Multi-tenant setup process
- **[Workflow Testing](docs/WORKFLOW_RUN_PAUSE_TEST.md)** - Testing procedures and examples
- **[API Reference](ops-backend-production-7ddf.up.railway.app/docs)** - Interactive API documentation

## 🛠️ Development

### Project Structure
\`\`\`
opsflow-guardian/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── db/             # Database models and connections
│   │   ├── models/         # Pydantic models
│   │   └── services/       # Business logic
│   ├── main.py             # Application entry point
│   └── requirements.txt    # Python dependencies
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── docs/                  # Documentation
├── public/                # Static assets
└── package.json           # Node.js dependencies
\`\`\`

### Environment Configuration
Create \`.env\` files:

**Backend** (\`backend/.env\`):
\`\`\`env
DATABASE_URL=postgresql://opsflow:12345@localhost:5432/opsflow_guardian
SECRET_KEY=your-secret-key
GOOGLE_API_KEY=your-google-api-key
\`\`\`

**Frontend** (\`.env\`):
\`\`\`env
VITE_API_BASE_URL=ops-backend-production-7ddf.up.railway.app
\`\`\`

### Database Management
\`\`\`bash
# View database with GUI browser
cd backend
python3 database_browser.py

# Connect via command line
PGPASSWORD=12345 psql -h localhost -U opsflow -d opsflow_guardian

# Reset database
./setup_new_database.sh
\`\`\`

## 🔧 API Endpoints

### Authentication
- \`POST /api/v1/auth/login\` - User login
- \`POST /api/v1/auth/register\` - User registration
- \`POST /api/v1/auth/refresh\` - Token refresh

### Workflows
- \`GET /api/v1/workflows\` - List workflows
- \`POST /api/v1/workflows\` - Create workflow
- \`POST /api/v1/workflows/{id}/execute\` - Execute workflow
- \`GET /api/v1/workflows/{id}/status\` - Get execution status

### Approvals
- \`GET /api/v1/approvals\` - List pending approvals
- \`POST /api/v1/approvals/{id}/approve\` - Approve request
- \`POST /api/v1/approvals/{id}/reject\` - Reject request

### Analytics
- \`GET /api/v1/analytics/dashboard\` - Dashboard metrics
- \`GET /api/v1/analytics/performance\` - Performance data

## 🐳 Docker Deployment

\`\`\`bash
# Backend with Docker Compose
cd backend
docker-compose up -d

# Full stack deployment
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 🧪 Testing

\`\`\`bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
npm test

# End-to-end tests
npm run test:e2e
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** - Modern, fast web framework for building APIs
- **React** - A JavaScript library for building user interfaces
- **PostgreSQL** - Advanced open source relational database
- **Tailwind CSS** - A utility-first CSS framework

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/Kartikvyas1604/opsflow-guardian/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kartikvyas1604/opsflow-guardian/discussions)

---

**Built with ❤️ for Enterprise Workflow Automation**
