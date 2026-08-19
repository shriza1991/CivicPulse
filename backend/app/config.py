from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    DATABASE_URL: str = "sqlite:///nivaran.db"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    MODEL_FALLBACK_ORDER: List[str] = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite"
    ]
    ESCALATION_THRESHOLD: int = 3
    DEMO_THRESHOLD_OVERRIDE: Optional[int] = None
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = "noreply@nivaran.org"
    AGENT5_PDF_FALLBACK: bool = True
    APP_BASE_URL: str = ""

    # Redis & Caching Configuration
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"
    RATE_LIMIT_PER_MINUTE: int = 120
    ENVIRONMENT: str = "production"

    # Auth & JWT Configuration

    JWT_SECRET_KEY: str = "nivaran_super_secret_jwt_key_2026_change_in_production!"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ISSUER: str = "nivaran-auth"
    JWT_AUDIENCE: str = "nivaran-app"


    # WhatsApp channel (Twilio Sandbox for development; Meta Cloud API in production)
    # Set WHATSAPP_ENABLED=true and supply Twilio credentials to activate.
    WHATSAPP_ENABLED: bool = False
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_NUMBER: str = ""  # e.g. whatsapp:+14155238886 (Twilio sandbox)

    @property
    def threshold(self) -> int:
        if self.DEMO_THRESHOLD_OVERRIDE is not None:
            return self.DEMO_THRESHOLD_OVERRIDE
        return self.ESCALATION_THRESHOLD

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()




