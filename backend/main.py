"""
OpsFlow Guardian 2.0 - Simplified Main Application Entry Point
FastAPI-based backend with mock data for frontend integration
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="OpsFlow Guardian 2.0",
    description="AI-Powered Enterprise Workflow Automation with Human Oversight & Complete Audit Trails",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000", 
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Import simplified API endpoints
from app.api.v1 import endpoints

# Register routes directly
app.include_router(endpoints.agents.router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(endpoints.workflows.router, prefix="/api/v1/workflows", tags=["Workflows"])
app.include_router(endpoints.approvals.router, prefix="/api/v1/approvals", tags=["Approvals"])
app.include_router(endpoints.audit.router, prefix="/api/v1/audit", tags=["Audit"])
app.include_router(endpoints.analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(endpoints.auth.router, prefix="/api/v1/auth", tags=["Authentication"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "OpsFlow Guardian 2.0 - AI-Powered Workflow Automation",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/api/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "services": {
            "api": "operational",
            "mock_data": "operational"
        }
    }


if __name__ == "__main__":
    import uvicorn
    print("🎉 OpsFlow Guardian 2.0 Backend starting...")
    print("📊 API Documentation: http://localhost:8000/docs") 
    print("🔗 Health Check: http://localhost:8000/health")
    print("🌐 WebSocket: ws://localhost:8000/ws")
    print("🔄 Press CTRL+C to stop the server")
    print("-" * 50)
    
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
