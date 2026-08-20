"""
Tests for Resilience, Fallbacks, Health & Diagnostics Endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


def test_health_check_endpoint(client: TestClient):
    """Test /health and /api/health liveness probe."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    assert res.json()["database"] == "connected"

    res_api = client.get("/api/health")
    assert res_api.status_code == 200
    assert res_api.json()["status"] == "ok"


def test_ready_check_endpoint(client: TestClient):
    """Test /ready and /api/ready readiness probe."""
    res = client.get("/ready")
    assert res.status_code == 200
    assert res.json()["status"] == "ready"
    assert res.json()["database"] == "healthy"
    assert res.json()["storage"] == "healthy"


def test_version_check_endpoint(client: TestClient):
    """Test /version endpoint metadata."""
    res = client.get("/version")
    assert res.status_code == 200
    data = res.json()
    assert "version" in data
    assert "commit_sha" in data
    assert "environment" in data


def test_diagnostics_endpoint_security(client: TestClient):
    """Ensure /api/diagnostics returns operational statuses without leaking secrets."""
    res = client.get("/api/diagnostics")
    assert res.status_code == 200
    data = res.json()
    assert data["app_name"] == "Nivaran — Community Demand Intelligence"
    assert "database_type" in data
    assert "storage_healthy" in data
    assert "gemini_configured" in data
    assert "sarvam_configured" in data
    # Guarantee no secret keys are present in payload
    for k, v in data.items():
        if isinstance(v, str):
            assert "AIzaSy" not in v
            assert "secret" not in v.lower() or k == "app_name"


def test_database_disconnected_health_fallback(client: TestClient):
    """Test /health returns 503 when DB connection fails."""
    with patch("sqlmodel.Session.exec", side_effect=Exception("Database down")):
        res = client.get("/health")
        assert res.status_code == 503
        assert res.json()["status"] == "unhealthy"
        assert res.json()["database"] == "disconnected"
