"""
Prometheus Observability & System Metrics Collector.
"""
import time
import threading
from typing import Dict, Any

class SystemMetricsCollector:
    def __init__(self):
        self._lock = threading.Lock()
        self.request_count = 0
        self.error_count = 0
        self.total_latency_ms = 0.0
        self.start_time = time.time()

    def record_request(self, status_code: int, latency_ms: float):
        with self._lock:
            self.request_count += 1
            self.total_latency_ms += latency_ms
            if status_code >= 400:
                self.error_count += 1

    def get_metrics_summary(self) -> Dict[str, Any]:
        with self._lock:
            uptime_seconds = round(time.time() - self.start_time, 1)
            avg_latency = round(self.total_latency_ms / self.request_count, 2) if self.request_count > 0 else 0.0
            error_rate = round((self.error_count / self.request_count * 100), 2) if self.request_count > 0 else 0.0

            return {
                "uptime_seconds": uptime_seconds,
                "total_requests": self.request_count,
                "error_count": self.error_count,
                "error_rate_percent": error_rate,
                "average_latency_ms": avg_latency,
                "status": "healthy"
            }

system_metrics = SystemMetricsCollector()
