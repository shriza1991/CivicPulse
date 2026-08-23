"""
test_cors.py — Automated verification of CORS configuration for CivicPulse backend.
Ensures origins (localhost, Vercel deployments) receive Access-Control-Allow-Origin,
Access-Control-Allow-Credentials, and preflight headers across endpoints.
"""

import pytest
from fastapi.testclient import TestClient

TEST_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://commonground-tawny.vercel.app",
    "https://civic-pulse-tawny.vercel.app",
    "https://commonground.vercel.app",
]

TEST_ENDPOINTS = [
    "/live",
    "/api/live",
    "/api/issues",
    "/api/issues/metrics",
]

@pytest.mark.parametrize("origin", TEST_ORIGINS)
@pytest.mark.parametrize("endpoint", TEST_ENDPOINTS)
def test_cors_headers_get_request(client: TestClient, origin: str, endpoint: str):
    """Verify GET requests include Access-Control-Allow-Origin for all allowed origins."""
    response = client.get(endpoint, headers={"Origin": origin})
    assert response.headers.get("access-control-allow-origin") == origin
    assert response.headers.get("access-control-allow-credentials") == "true"

@pytest.mark.parametrize("origin", TEST_ORIGINS)
@pytest.mark.parametrize("endpoint", TEST_ENDPOINTS)
def test_cors_preflight_options_request(client: TestClient, origin: str, endpoint: str):
    """Verify OPTIONS preflight requests return 200 OK with proper CORS headers."""
    response = client.options(
        endpoint,
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization, Content-Type, X-Request-ID",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin
    assert response.headers.get("access-control-allow-credentials") == "true"
    assert response.headers.get("access-control-allow-methods") is not None
