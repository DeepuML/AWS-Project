"""
database.py — SQLAlchemy Database Configuration

Sets up the database engine, session factory, and declarative base class used
throughout the application. The connection string is read from the DATABASE_URL
environment variable so that the same codebase can connect to different
databases across local, staging, and production environments.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Read the database connection string from the environment.
# Falls back to a local PostgreSQL instance for development convenience only.
# WARNING: The fallback value is for local development ONLY and must NOT be
# used in production. Set DATABASE_URL explicitly in all non-local environments
# (e.g. via an environment variable injected by Docker, EC2 user-data, or
# AWS Secrets Manager).
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/flexfitdb")

# Create the SQLAlchemy engine.
# `pool_pre_ping=True` can be added here to verify connections before use in long-running services.
engine = create_engine(DATABASE_URL)

# Session factory — each request gets its own short-lived session via the
# `get_db` dependency, which ensures sessions are always properly closed.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class shared by all ORM model classes.
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a database session per request.

    Opens a new session before the request is processed and guarantees that
    the session is closed after the response is returned, even if an exception
    is raised during request handling.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()