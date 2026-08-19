import contextvars
import json
import logging
import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import uuid

# Contextvar to store the correlation ID for the current request context
correlation_id_ctx = contextvars.ContextVar("correlation_id", default="")

class StructuredJSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "correlation_id": correlation_id_ctx.get(),
        }
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        # Include extra fields if they are added to record
        if hasattr(record, "extra_fields"):
            log_data.update(record.extra_fields)
        return json.dumps(log_data)

def setup_structured_logging():
    # Get root logger
    root_logger = logging.getLogger()
    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
        
    handler = logging.StreamHandler()
    handler.setFormatter(StructuredJSONFormatter())
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)
    
    # Configure custom app logger
    logger = logging.getLogger("nivaran")
    logger.setLevel(logging.INFO)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        token = correlation_id_ctx.set(req_id)
        
        start_time = time.time()
        logger = logging.getLogger("nivaran")

        
        logger.info(f"incoming_request | method={request.method} | url={request.url.path}")
        
        try:
            response: Response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            
            # Add headers
            response.headers["X-Correlation-ID"] = req_id
            
            logger.info(
                f"request_completed | status_code={response.status_code} | latency_ms={process_time:.2f}",
                extra={"extra_fields": {"latency_ms": round(process_time, 2), "status_code": response.status_code}}
            )
            correlation_id_ctx.reset(token)
            return response
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"request_failed | latency_ms={process_time:.2f} | error={str(e)}",
                exc_info=True,
                extra={"extra_fields": {"latency_ms": round(process_time, 2)}}
            )
            correlation_id_ctx.reset(token)
            raise e
