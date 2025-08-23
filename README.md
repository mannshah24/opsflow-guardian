# 🤖 OpsFlow Guardian 2.0 - AI-Powered Workflow Automation

**Powered by Google Gemini 2.5 Pro** | Multi-Agent Orchestration | Real-Time Monitoring | Enterprise Security

> **✨ Now featuring Google Gemini 2.5 Pro for cost-effective, high-performance AI automation!**

OpsFlow Guardian is an AI-powered workflow automation platform that combines multi-agent AI capabilities with human oversight and complete audit trails. Built to solve the enterprise automation trust gap with transparency, steerability, and authenticated operations.

## 🚀 Why Gemini 2.5 Pro?

- **💰 Cost Effective**: ~90% cheaper than OpenAI ($0.00025 vs $0.03 per 1K tokens)
- **🧠 Advanced Reasoning**: Latest Google AI with superior planning capabilities  
- **📚 2M Token Context**: Handle complex workflows with massive context windows
- **⚡ High Performance**: Fast response times with reliable availability
- **🔒 Enterprise Ready**: Google-grade security and privacy standards

## Project Overview

**Repository**: https://github.com/Kartikvyas1604/opsflow-guardian

## Development Setup

**Local Development**

To run this project locally, you'll need Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository
git clone https://github.com/Kartikvyas1604/opsflow-guardian.git

# Step 2: Navigate to the project directory
cd opsflow-guardian

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server
npm run dev
```

**Backend Setup (with Gemini 2.5 Pro)**

```sh
# Step 1: Navigate to backend directory
cd backend

# Step 2: Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Set up environment variables
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# Step 5: Test Gemini integration
python test_gemini.py

# Step 6: Start the backend
python main.py
```

**Getting Your Gemini API Key:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and add it to your `.env` file as `GOOGLE_API_KEY`
4. The API includes a generous free tier - perfect for development!

The project also includes a Python FastAPI backend. To run the backend:

```sh
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

**Using Docker**

You can also run the entire application using Docker:

```sh
# From the project root
docker-compose up
```

## Technology Stack

This project is built with:

**Frontend:**
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

**Backend:**
- Python
- FastAPI
- SQLAlchemy
- Redis
- WebSockets

**AI/ML:**
- Portia AI integration
- Multi-agent workflow orchestration
- Natural language processing

## Features

- **Multi-Agent AI Orchestration**: Coordinate multiple AI agents for complex workflows
- **Human-in-the-Loop**: Built-in approval mechanisms for critical decisions
- **Complete Audit Trail**: Every action tracked and logged for compliance
- **Real-time Monitoring**: Live dashboard for workflow execution status
- **Integration Ready**: Connect with existing enterprise systems
- **Secure & Scalable**: Enterprise-grade security and performance

## Deployment

The application can be deployed using various methods:

1. **Docker Deployment**: Use the provided Dockerfile and docker-compose.yml
2. **Cloud Platforms**: Deploy to AWS, Google Cloud, or Azure
3. **Local Server**: Run on your own infrastructure

For production deployment, make sure to:
- Set up proper environment variables
- Configure SSL certificates
- Set up monitoring and logging
- Configure backup strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: kartik.vyas@example.com
- GitHub: [@Kartikvyas1604](https://github.com/Kartikvyas1604)

---

Built with ❤️ by Kartik Vyas
