"""
backend/config.py - Environment & Application Configuration
"""
import os
import secrets
import logging
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("uvicorn")

def get_admin_api_key() -> str:
    key = os.getenv("ADMIN_API_KEY")
    if not key:
        logger.warning(
            "[SECURITY WARNING] ADMIN_API_KEY environment variable is not set. "
            "Admin operations will be rejected until ADMIN_API_KEY is configured in your .env file."
        )
        return ""
    return key

class Settings(BaseModel):
    app_name: str = "Gopinath Portfolio API"
    app_version: str = "2.0.0"
    admin_api_key: str = get_admin_api_key()
    database_csv_path: str = os.getenv("DATABASE_CSV_PATH", os.path.join(os.path.dirname(__file__), "..", "database", "leads.csv"))
    sqlite_db_path: str = os.getenv("SQLITE_DB_PATH", os.path.join(os.path.dirname(__file__), "..", "database", "leads.db"))
    
    # SMTP Notification Settings
    smtp_enabled: bool = os.getenv("SMTP_ENABLED", "false").lower() in ("true", "1", "yes")
    smtp_host: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    notification_recipient_email: str = os.getenv("NOTIFICATION_RECIPIENT_EMAIL", "gnath3144@gmail.com")
    
    # Rate Limiting
    rate_limit_requests: int = int(os.getenv("RATE_LIMIT_REQUESTS", "5"))
    rate_limit_window_seconds: int = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))

settings = Settings()
