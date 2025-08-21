"""
Authentication API endpoints for OpsFlow Guardian 2.0
"""

from fastapi import APIRouter, HTTPException, Body, Depends
from typing import Dict, Any
import logging
from datetime import datetime, timedelta
import uuid

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/login")
async def login(credentials: Dict[str, Any] = Body(...)):
    """User login endpoint"""
    try:
        email = credentials.get("email", "")
        password = credentials.get("password", "")
        
        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password are required")
        
        # Mock authentication - replace with real authentication logic
        if email == "admin@opsflow.com" and password == "admin123":
            user_data = {
                "user_id": "user-001",
                "email": email,
                "name": "Admin User",
                "role": "administrator",
                "permissions": ["read", "write", "approve", "admin"],
                "company": "OpsFlow Inc"
            }
            
            # Mock JWT token
            token_data = {
                "access_token": f"mock-jwt-token-{uuid.uuid4()}",
                "token_type": "bearer",
                "expires_in": 3600,
                "refresh_token": f"mock-refresh-token-{uuid.uuid4()}"
            }
            
            return {
                "success": True,
                "message": "Login successful",
                "user": user_data,
                "tokens": token_data
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(status_code=500, detail="Login failed")


@router.post("/register")
async def register(registration_data: Dict[str, Any] = Body(...)):
    """User registration endpoint"""
    try:
        email = registration_data.get("email", "")
        password = registration_data.get("password", "")
        name = registration_data.get("name", "")
        company = registration_data.get("company", "")
        
        if not all([email, password, name]):
            raise HTTPException(status_code=400, detail="Email, password, and name are required")
        
        # Mock registration - replace with real registration logic
        user_data = {
            "user_id": f"user-{uuid.uuid4()}",
            "email": email,
            "name": name,
            "role": "user",
            "company": company,
            "created_at": datetime.utcnow().isoformat(),
            "is_verified": False
        }
        
        return {
            "success": True,
            "message": "Registration successful. Please verify your email.",
            "user": user_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")


@router.post("/refresh")
async def refresh_token(token_data: Dict[str, Any] = Body(...)):
    """Refresh access token"""
    try:
        refresh_token = token_data.get("refresh_token", "")
        
        if not refresh_token:
            raise HTTPException(status_code=400, detail="Refresh token is required")
        
        # Mock token refresh - replace with real token validation and refresh
        new_token_data = {
            "access_token": f"mock-jwt-token-{uuid.uuid4()}",
            "token_type": "bearer",
            "expires_in": 3600,
            "refresh_token": f"mock-refresh-token-{uuid.uuid4()}"
        }
        
        return {
            "success": True,
            "tokens": new_token_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(status_code=500, detail="Token refresh failed")


@router.post("/logout")
async def logout():
    """User logout endpoint"""
    try:
        # Mock logout - in real implementation, invalidate the token
        return {
            "success": True,
            "message": "Logged out successfully"
        }
        
    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(status_code=500, detail="Logout failed")


@router.get("/me")
async def get_current_user():
    """Get current user information"""
    try:
        # Mock user data - replace with real user retrieval based on JWT token
        user_data = {
            "user_id": "user-001",
            "email": "admin@opsflow.com",
            "name": "Admin User",
            "role": "administrator",
            "permissions": ["read", "write", "approve", "admin"],
            "company": "OpsFlow Inc",
            "last_login": "2025-01-23T10:00:00Z",
            "preferences": {
                "theme": "dark",
                "notifications": True,
                "timezone": "UTC"
            }
        }
        
        return {
            "success": True,
            "user": user_data
        }
        
    except Exception as e:
        logger.error(f"Failed to get user info: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user information")
