"""
OpsFlow Guardian 2.0 - Simplified Main Application Entry Point
FastAPI-based backend with PostgreSQL database integration
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import logging
import os
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import database initialization
from app.db.database import init_db, close_db

# Create FastAPI application
app = FastAPI(
    title="OpsFlow Guardian 2.0",
    description="AI-Powered Enterprise Workflow Automation with Human Oversight & Complete Audit Trails",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8082", 
        "http://localhost:8081", 
        "http://localhost:8080",
        "http://localhost:3000", 
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8082",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8080",
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
app.include_router(endpoints.company.router, prefix="/api/v1", tags=["Company Profile"])


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    logger.info("🚀 Starting OpsFlow Guardian 2.0...")
    
    # Initialize database connection
    try:
        db_success = await init_db()
        if db_success:
            logger.info("✅ Database initialization successful")
        else:
            logger.warning("⚠️ Database initialization failed - running in limited mode")
    except Exception as e:
        logger.error(f"❌ Database startup error: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up database connections on shutdown"""
    logger.info("🛑 Shutting down OpsFlow Guardian 2.0...")
    await close_db()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "OpsFlow Guardian 2.0 - AI-Powered Workflow Automation",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs",
        "database": "postgresql",
        "features": [
            "Real PostgreSQL database integration",
            "AI-powered workflow automation",
            "Company-specific personalization", 
            "Complete audit trails",
            "Human approval workflows"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint with database status"""
    try:
        from app.db.database import check_database_exists
        db_status = check_database_exists()
        
        return {
            "status": "healthy" if db_status else "degraded",
            "version": "2.0.0",
            "services": {
                "api": "operational",
                "database": "connected" if db_status else "disconnected",
                "database_type": "postgresql"
            },
            "database_url": os.getenv("DATABASE_URL", "").replace("password", "***") if db_status else "not configured"
        }
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return {
            "status": "unhealthy",
            "version": "2.0.0", 
            "error": str(e)
        }


@app.get("/database/status")
async def database_status():
    """Detailed database status endpoint"""
    try:
        from app.db.database import execute_sync_query
        
        # Get table count
        table_result = execute_sync_query("""
            SELECT COUNT(*) as table_count 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        """)
        
        table_count = table_result[0][0] if table_result else 0
        
        # Get database version
        version_result = execute_sync_query("SELECT version()")
        db_version = version_result[0][0] if version_result else "unknown"
        
        return {
            "connected": True,
            "database_type": "postgresql",
            "version": db_version,
            "tables_count": table_count,
            "connection_url": os.getenv("DATABASE_URL", "").replace("password", "***"),
            "status": "operational" if table_count > 0 else "setup_required"
        }
        
    except Exception as e:
        return {
            "connected": False,
            "error": str(e),
            "setup_instructions": [
                "1. Ensure PostgreSQL is running",
                "2. Create database: createdb opsflow_guardian",
                "3. Run setup script: psql -U opsflow -d opsflow_guardian -f COMPLETE_DATABASE_SETUP.sql"
            ]
        }


if __name__ == "__main__":
    import uvicorn
    print("🎉 OpsFlow Guardian 2.0 Backend starting...")
    print("📊 API Documentation: http://localhost:8001/docs") 
    print("🔗 Health Check: http://localhost:8001/health")
    print("🗄️ Database Status: http://localhost:8001/database/status")
    print("🌐 WebSocket: ws://localhost:8001/ws")
    print("🔄 Press CTRL+C to stop the server")
    print("-" * 50)
    
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8001, 
        reload=True,
        log_level="info"
    )
