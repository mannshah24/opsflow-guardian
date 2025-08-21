"""
API v1 routes for OpsFlow Guardian 2.0
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    agents,
    workflows,
    approvals,
    audit,
    analytics,
    auth
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

api_router.include_router(
    agents.router,
    prefix="/agents",
    tags=["Agents"]
)

api_router.include_router(
    workflows.router,
    prefix="/workflows",
    tags=["Workflows"]
)

api_router.include_router(
    approvals.router,
    prefix="/approvals",
    tags=["Approvals"]
)

api_router.include_router(
    audit.router,
    prefix="/audit",
    tags=["Audit"]
)

api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)
