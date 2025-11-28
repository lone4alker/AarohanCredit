"""
Configuration management for the platform.
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_TITLE: str = "MSME Credit Intelligence Platform"
    API_VERSION: str = "1.0.0"
    
    # Database Settings
    DB_PATH: str = "data/policies.db"
    DATA_DIR: str = "data"
    
    # Agent Settings
    AGENT_TIMEOUT: int = 300  # seconds
    MAX_RETRIES: int = 3
    
    # Scoring Weights
    FINANCIAL_HEALTH_WEIGHT: float = 0.3
    BEHAVIORAL_SCORE_WEIGHT: float = 0.4
    POLICY_MATCH_WEIGHT: float = 0.3
    
    # LLM Settings (Gemini via LangChain)
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_API_KEY: Optional[str] = None
    LLM_TEMPERATURE: float = 0.3
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: Optional[str] = None
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()

