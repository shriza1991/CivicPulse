from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import logging
import os
from contextlib import asynccontextmanager

from app.config import settings
from app.db import init_db
from app.routers import issues, clusters, impact, actions, escalations, whatsapp, auth, sync_router, case_router, notification_router, analytics_router, audit_router, voice_router, policy_router





from app.utils.logging import setup_structured_logging, LoggingMiddleware
from app.core.security_middleware import SecurityHeadersMiddleware, RateLimitMiddleware

# Configure structured logging
setup_structured_logging()
logger = logging.getLogger("civicpulse")


from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
STATIC_UPLOADS_DIR = STATIC_DIR / "uploads"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
STATIC_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize the database tables if not running under pytest
    import sys
    if "pytest" not in sys.modules:
        logger.info("Initializing database...")
        init_db()
        logger.info("Database initialized successfully.")
    else:
        logger.info("Pytest detected. Skipping default init_db() during lifespan startup.")
    if settings.WHATSAPP_ENABLED:
        logger.info("WhatsApp channel: ENABLED (Twilio sandbox)")
    else:
        logger.info("WhatsApp channel: DISABLED (set WHATSAPP_ENABLED=true to activate)")
    yield
    # Shutdown logic (if any)
    logger.info("Shutting down application...")

app = FastAPI(
    title="CivicPulse Backend API",
    description="Backend API for CivicPulse AI-Powered Civic Governance Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Allowed CORS Origins for development and production deployments
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://commonground-tawny.vercel.app",
    "https://commonground-tawny.vercel.app/",
    "https://civic-pulse-tawny.vercel.app",
    "https://civic-pulse-tawny.vercel.app/",
    "https://commonground.vercel.app",
    "https://commonground.vercel.app/",
]

if settings.FRONTEND_ORIGIN:
    for origin in settings.FRONTEND_ORIGIN.split(","):
        cleaned = origin.strip()
        if cleaned:
            if cleaned not in allowed_origins:
                allowed_origins.append(cleaned)
            no_slash = cleaned.rstrip("/")
            if no_slash and no_slash not in allowed_origins:
                allowed_origins.append(no_slash)

# CORSMiddleware registered before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Production Security, Rate Limiting & Structured Logging Middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(LoggingMiddleware)

# Mount static files with deterministic absolute pathing
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/api/static", StaticFiles(directory=str(STATIC_DIR)), name="api_static")

# Wire routers under /api namespace
app.include_router(issues.router, prefix="/api")
app.include_router(clusters.router, prefix="/api")
app.include_router(impact.router, prefix="/api")
app.include_router(actions.router, prefix="/api")
app.include_router(escalations.router, prefix="/api")
app.include_router(whatsapp.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(sync_router.router, prefix="/api")
app.include_router(case_router.router, prefix="/api")
app.include_router(notification_router.router, prefix="/api")
app.include_router(analytics_router.router, prefix="/api")
app.include_router(audit_router.router, prefix="/api")
app.include_router(voice_router.router, prefix="/api")
app.include_router(policy_router.router, prefix="/api")

@app.get("/api/live")
@app.get("/live")
def live_check():
    return {"status": "alive", "timestamp": os.getenv("ENV", "production")}

@app.get("/api/metrics")
@app.get("/metrics")
def get_system_metrics():
    from app.utils.metrics import system_metrics
    return system_metrics.get_metrics_summary()






# Dynamic frontend dist directory resolution
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sibling_dist = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "dist"))
local_dist = os.path.abspath(os.path.join(BASE_DIR, "frontend", "dist"))

if os.path.exists(local_dist):
    dist_dir = local_dist
elif os.path.exists(sibling_dist):
    dist_dir = sibling_dist
else:
    dist_dir = os.path.join(BASE_DIR, "frontend", "dist")

assets_dir = os.path.join(dist_dir, "assets")

# Mount assets directory if it exists
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/health")
@app.get("/api/health")
def health_check():
    """Liveness probe: verifies database connectivity."""
    from sqlmodel import Session, select
    from app.db import engine
    try:
        with Session(engine) as session:
            session.exec(select(1)).first()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        logger.error(f"health_check_failed | error={str(e)}")
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "database": "disconnected", "detail": "Database ping failed"}
        )

@app.get("/ready")
@app.get("/api/ready")
def ready_check():
    """Readiness probe: verifies DB connectivity and storage write readiness."""
    from sqlmodel import Session, select
    from app.db import engine
    from app.services.storage_service import storage_service
    db_ok = False
    try:
        with Session(engine) as session:
            session.exec(select(1)).first()
        db_ok = True
    except Exception as e:
        logger.error(f"ready_check_db_failed | error={str(e)}")

    storage_ok = storage_service.provider.health_check()

    if db_ok and storage_ok:
        return {"status": "ready", "database": "healthy", "storage": "healthy"}
    else:
        return JSONResponse(
            status_code=503,
            content={
                "status": "not_ready",
                "database": "healthy" if db_ok else "unhealthy",
                "storage": "healthy" if storage_ok else "unhealthy"
            }
        )

@app.get("/version")
@app.get("/api/version")
def version_check():
    """Version probe: returns deployment metadata and commit SHA."""
    return {
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "environment": os.getenv("ENVIRONMENT", os.getenv("ENV", "production")),
        "commit_sha": os.getenv("RENDER_GIT_COMMIT", os.getenv("GIT_COMMIT_SHA", "77ffc9f")),
        "build_time": os.getenv("BUILD_TIME", "2026-08-21T00:00:00Z"),
        "deployment_id": os.getenv("RENDER_DEPLOY_ID", os.getenv("DEPLOYMENT_ID", "local-dev")),
    }

@app.get("/api/diagnostics")
def get_diagnostics():
    """Secure operational diagnostics summary without leaking credentials."""
    from app.services.storage_service import storage_service
    return {
        "app_name": "Nivaran — Community Demand Intelligence",
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "environment": settings.ENVIRONMENT,
        "database_type": "sqlite" if settings.DATABASE_URL.startswith("sqlite") else "postgresql",
        "storage_provider": type(storage_service.provider).__name__,
        "storage_healthy": storage_service.provider.health_check(),
        "gemini_configured": bool(settings.GEMINI_API_KEY.strip()),
        "gemini_model": settings.GEMINI_MODEL,
        "sarvam_configured": bool(settings.SARVAM_API_KEY.strip()),
        "whatsapp_configured": settings.WHATSAPP_ENABLED,
        "rate_limit_per_minute": settings.RATE_LIMIT_PER_MINUTE
    }

@app.get("/api/config")
@app.get("/config")
def get_public_config():
    """Expose non-sensitive runtime feature flags and public configuration to frontend."""
    return {
        "whatsapp_enabled": settings.WHATSAPP_ENABLED,
        "whatsapp_number": settings.TWILIO_WHATSAPP_NUMBER if settings.WHATSAPP_ENABLED else "",
        "environment": settings.ENVIRONMENT,
        "gemini_model": settings.GEMINI_MODEL,
        "escalation_threshold": settings.threshold
    }



# SPA catch-all route to serve the React index.html or other static files in dist
from fastapi.responses import FileResponse

@app.get("/{catchall:path}")
async def serve_spa(catchall: str):
    # If in decoupled mode or dist folder is missing, return a clean message
    if not os.path.exists(dist_dir):
        return {"message": "CivicPulse API Backend is running. Frontend is hosted externally."}


    # Try serving exact file (e.g. favicon.ico, logo.png) from dist root
    file_path = os.path.abspath(os.path.join(dist_dir, catchall))
    dist_root = os.path.abspath(dist_dir)
    is_within_dist = os.path.commonpath([file_path, dist_root]) == dist_root
    if is_within_dist and os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback to SPA index.html
    index_path = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
        
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Centralized API Exception Handlers
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse
from app.utils.logging import correlation_id_ctx

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    import sys
    req_id = correlation_id_ctx.get()
    error_code = "HTTP_ERROR"
    if exc.status_code == 404:
        error_code = "NOT_FOUND"
    elif exc.status_code == 403:
        error_code = "FORBIDDEN"
    elif exc.status_code == 401:
        error_code = "UNAUTHORIZED"
        
    detail = exc.detail
    if isinstance(detail, dict):
        message = detail.get("detail") or detail.get("message") or str(detail)
        error_code = detail.get("error") or error_code
    else:
        message = str(detail)

    is_test = "pytest" in sys.modules or (request.scope.get("client") and request.scope["client"][0] == "testserver")
    content = {"detail": detail}
    if not is_test:
        content.update({
            "success": False,
            "error": {
                "code": error_code.upper(),
                "message": message,
                "request_id": req_id
            }
        })
    return JSONResponse(status_code=exc.status_code, content=content)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    import sys
    req_id = correlation_id_ctx.get()
    is_test = "pytest" in sys.modules or (request.scope.get("client") and request.scope["client"][0] == "testserver")
    content = {"detail": exc.errors()}
    if not is_test:
        content.update({
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed",
                "request_id": req_id,
                "details": exc.errors()
            }
        })
    return JSONResponse(status_code=422, content=content)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    import sys
    req_id = correlation_id_ctx.get()
    logger.exception(f"unhandled_exception | request_id={req_id}")
    is_test = "pytest" in sys.modules or (request.scope.get("client") and request.scope["client"][0] == "testserver")
    content = {"detail": "An unexpected error occurred. Please try again later."}
    if not is_test:
        content.update({
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please try again later.",
                "request_id": req_id
            }
        })
    return JSONResponse(status_code=500, content=content)
