"""
Database configuration and initialization for OpsFlow Guardian 2.0
Real PostgreSQL database connection
"""

from typing import Generator
import logging
import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import OperationalError
import asyncpg
import asyncio

logger = logging.getLogger(__name__)

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://opsflow:password@localhost:5432/opsflow_guardian")

logger.info(f"🔗 Connecting to database: {DATABASE_URL.replace('password', '***')}")

# SQLAlchemy setup with PostgreSQL optimizations
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=3600,   # Recycle connections after 1 hour
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def test_connection():
    """Test database connection"""
    try:
        # Parse DATABASE_URL for asyncpg connection
        import urllib.parse as urlparse
        url = urlparse.urlparse(DATABASE_URL)
        
        # Connect using asyncpg for testing
        conn = await asyncpg.connect(
            host=url.hostname,
            port=url.port or 5432,
            user=url.username,
            password=url.password,
            database=url.path[1:]  # Remove leading slash
        )
        
        # Test query
        result = await conn.fetchval("SELECT version()")
        logger.info(f"✅ Database connected successfully: {result}")
        
        await conn.close()
        return True
        
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False


def check_database_exists():
    """Check if database exists and is accessible"""
    try:
        # Test connection with SQLAlchemy
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            logger.info("✅ SQLAlchemy database connection successful")
            return True
            
    except OperationalError as e:
        logger.error(f"❌ Database connection error: {e}")
        if "does not exist" in str(e):
            logger.warning("🚨 Database does not exist. Please run the setup SQL script first.")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected database error: {e}")
        return False


async def init_db():
    """Initialize database connection and verify setup"""
    try:
        logger.info("🚀 Initializing database connection...")
        
        # Test async connection
        if await test_connection():
            logger.info("✅ Async database connection test passed")
        else:
            logger.warning("⚠️ Async database connection test failed, but continuing...")
        
        # Test SQLAlchemy connection
        if check_database_exists():
            logger.info("✅ SQLAlchemy database connection verified")
        else:
            raise Exception("Database connection verification failed")
        
        # Check if tables exist
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT COUNT(*) as table_count 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
            """))
            table_count = result.fetchone()[0]
            
            if table_count > 0:
                logger.info(f"✅ Found {table_count} tables in database")
            else:
                logger.warning("⚠️ No tables found. Please run COMPLETE_DATABASE_SETUP.sql")
        
        logger.info("✅ Database initialization completed")
        return True
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize database: {e}")
        logger.info("💡 To fix this, please:")
        logger.info("1. Ensure PostgreSQL is running")
        logger.info("2. Run: psql -U postgres -c 'CREATE DATABASE opsflow_guardian;'")
        logger.info("3. Run: psql -U postgres -f COMPLETE_DATABASE_SETUP.sql")
        return False


async def get_database():
    """Get database connection"""
    return SessionLocal()


async def close_db():
    """Close database connections"""
    try:
        logger.info("🔒 Closing database connections...")
        engine.dispose()
        logger.info("✅ Database connections closed")
        
    except Exception as e:
        logger.error(f"❌ Error closing database: {e}")


# Utility functions for raw SQL queries
async def execute_raw_query(query: str, params: dict = None):
    """Execute raw SQL query with asyncpg"""
    try:
        import urllib.parse as urlparse
        url = urlparse.urlparse(DATABASE_URL)
        
        conn = await asyncpg.connect(
            host=url.hostname,
            port=url.port or 5432,
            user=url.username,
            password=url.password,
            database=url.path[1:]
        )
        
        if params:
            result = await conn.fetch(query, *params.values())
        else:
            result = await conn.fetch(query)
            
        await conn.close()
        return result
        
    except Exception as e:
        logger.error(f"Error executing raw query: {e}")
        return None


def execute_sync_query(query: str, params: dict = None):
    """Execute raw SQL query with SQLAlchemy (synchronous)"""
    try:
        with engine.connect() as connection:
            if params:
                result = connection.execute(text(query), params)
            else:
                result = connection.execute(text(query))
            return result.fetchall()
            
    except Exception as e:
        logger.error(f"Error executing sync query: {e}")
        return None
