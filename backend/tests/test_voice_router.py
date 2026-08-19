"""
Unit & Integration Tests for Voice Transcription API & Speech Service.
"""
import io
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi.testclient import TestClient

from app.main import app


def test_voice_health_endpoint(client: TestClient):
    """Test voice health check endpoint."""
    response = client.get("/api/voice/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "degraded"]
    assert data["provider"] == "sarvam"
    assert "configured" in data


def test_voice_transcribe_missing_file(client: TestClient):
    """Test transcribe endpoint when no audio file is attached."""
    response = client.post("/api/voice/transcribe")
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert "No audio file provided" in data["message"]


@pytest.mark.asyncio
async def test_speech_service_transcribe_success():
    """Test SpeechService transcribe_audio method with mocked httpx client."""
    from app.services.speech_service import SpeechService

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "request_id": "test-req-123",
        "transcript": "सड़क में बड़ा गड्ढा है",
        "language_code": "hi-IN"
    }

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_response
        audio_file = io.BytesIO(b"fake audio data")
        audio_file.filename = "test.mp3"
        audio_file.content_type = "audio/mpeg"

        result = await SpeechService.transcribe_audio(audio_file)
        assert "transcript" in result
        assert result["transcript"] == "सड़क में बड़ा गड्ढा है"


def test_voice_transcribe_endpoint_success(client: TestClient):
    """Test POST /api/voice/transcribe endpoint with mocked SpeechService."""
    with patch(
        "app.services.speech_service.SpeechService.transcribe_audio",
        new_callable=AsyncMock
    ) as mock_transcribe:
        mock_transcribe.return_value = {"transcript": "Pothole on Main Street"}

        file_tuple = ("sample.wav", b"fake audio data", "audio/wav")
        response = client.post(
            "/api/voice/transcribe",
            files={"file": file_tuple}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["transcript"] == "Pothole on Main Street"
        mock_transcribe.assert_called_once()


def test_voice_transcribe_endpoint_error_handling(client: TestClient):
    """Test POST /api/voice/transcribe endpoint when service fails."""
    with patch(
        "app.services.speech_service.SpeechService.transcribe_audio",
        new_callable=AsyncMock
    ) as mock_transcribe:
        mock_transcribe.side_effect = RuntimeError("Sarvam API error")

        file_tuple = ("sample.wav", b"fake audio data", "audio/wav")
        response = client.post(
            "/api/voice/transcribe",
            files={"audio": file_tuple}
        )

        assert response.status_code == 500
        data = response.json()
        assert data["success"] is False
        assert "Sarvam API error" in data["message"]
