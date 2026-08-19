"""
Unit & Integration Tests for Voice Transcription API, Gemini Issue Analysis & Speech Service.
"""
import io
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi import HTTPException, status
from fastapi.testclient import TestClient

from app.main import app
from app.services.speech_service import resolve_content_type, SpeechService
from app.services.issue_analysis_service import IssueAnalysisService, IssueAnalysis


def test_resolve_content_type_normalization():
    """Test resolve_content_type helper for various audio extensions and MIME overrides."""
    assert resolve_content_type("sample.mp3", "video/mpeg") == "audio/mpeg"
    assert resolve_content_type("sample.wav", None) == "audio/wav"
    assert resolve_content_type("sample.webm", "video/webm") == "audio/webm"
    assert resolve_content_type("recording.m4a", "application/octet-stream") == "audio/mp4"
    assert resolve_content_type("voice.aac", None) == "audio/aac"
    assert resolve_content_type("audio.ogg", "video/ogg") == "audio/ogg"


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
async def test_speech_service_transcribe_success_and_mime_handling():
    """Test SpeechService transcribe_audio method verifies normalized outgoing MIME type."""
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
        audio_file.filename = "sample.mp3"
        audio_file.content_type = "video/mpeg"

        result = await SpeechService.transcribe_audio(audio_file)
        assert "transcript" in result
        assert result["transcript"] == "सड़क में बड़ा गड्ढा है"

        mock_post.assert_called_once()
        _, kwargs = mock_post.call_args
        files_arg = kwargs.get("files")
        assert files_arg is not None
        file_tuple = files_arg.get("file")
        assert file_tuple[0] == "sample.mp3"
        assert file_tuple[2] == "audio/mpeg"


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


@pytest.mark.asyncio
async def test_issue_analysis_service_success():
    """Test IssueAnalysisService.analyze_transcript with mocked GeminiClient."""
    mock_analysis = IssueAnalysis(
        detected_language="Hindi",
        english_translation="There is a large pothole near VESIT College.",
        issue_category="Road Infrastructure",
        issue_subcategory="Pothole",
        severity="HIGH",
        department="Roads and Infrastructure Department",
        priority_score=88,
        summary="Large pothole near VESIT College creating safety risks."
    )

    mock_gemini = MagicMock()
    mock_gemini.generate_structured_output = AsyncMock(return_value=mock_analysis)

    res = await IssueAnalysisService.analyze_transcript(
        "वेसेट कॉलेज के पास सड़क पर बड़ा गड्ढा है",
        gemini_client=mock_gemini
    )

    assert res["detected_language"] == "Hindi"
    assert res["issue_category"] == "Road Infrastructure"
    assert res["severity"] == "HIGH"
    assert res["priority_score"] == 88


@pytest.mark.asyncio
async def test_issue_analysis_service_empty_transcript():
    """Test IssueAnalysisService.analyze_transcript raises ValueError for empty transcript."""
    with pytest.raises(ValueError, match="Transcript text cannot be empty"):
        await IssueAnalysisService.analyze_transcript("   ")


def test_voice_analyze_endpoint_success(client: TestClient):
    """Test POST /api/voice/analyze full pipeline success."""
    mock_analysis_dict = {
        "detected_language": "Hindi",
        "english_translation": "There is a large pothole near VESIT College.",
        "issue_category": "Road Infrastructure",
        "issue_subcategory": "Pothole",
        "severity": "HIGH",
        "department": "Roads and Infrastructure Department",
        "priority_score": 88,
        "summary": "Large pothole near VESIT College."
    }

    with patch(
        "app.services.speech_service.SpeechService.transcribe_audio",
        new_callable=AsyncMock
    ) as mock_stt, patch(
        "app.services.issue_analysis_service.IssueAnalysisService.analyze_transcript",
        new_callable=AsyncMock
    ) as mock_analysis:
        mock_stt.return_value = {"transcript": "वेसेट कॉलेज के पास सड़क पर बड़ा गड्ढा है"}
        mock_analysis.return_value = mock_analysis_dict

        file_tuple = ("complaint.wav", b"fake audio data", "audio/wav")
        response = client.post(
            "/api/voice/analyze",
            files={"file": file_tuple}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["transcript"] == "वेसेट कॉलेज के पास सड़क पर बड़ा गड्ढा है"
        assert data["analysis"]["issue_category"] == "Road Infrastructure"
        assert data["analysis"]["severity"] == "HIGH"


def test_voice_analyze_endpoint_empty_transcript_error(client: TestClient):
    """Test POST /api/voice/analyze when transcription produces empty text."""
    with patch(
        "app.services.speech_service.SpeechService.transcribe_audio",
        new_callable=AsyncMock
    ) as mock_stt:
        mock_stt.return_value = {"transcript": "   "}

        file_tuple = ("silent.wav", b"fake silence", "audio/wav")
        response = client.post(
            "/api/voice/analyze",
            files={"file": file_tuple}
        )

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "empty text" in data["message"]


def test_voice_analyze_endpoint_gemini_failure(client: TestClient):
    """Test POST /api/voice/analyze when Gemini AI service fails."""
    with patch(
        "app.services.speech_service.SpeechService.transcribe_audio",
        new_callable=AsyncMock
    ) as mock_stt, patch(
        "app.services.issue_analysis_service.IssueAnalysisService.analyze_transcript",
        new_callable=AsyncMock
    ) as mock_analysis:
        mock_stt.return_value = {"transcript": "Pothole on Main Road"}
        mock_analysis.side_effect = HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={"error": "ai_unavailable", "retryable": True}
        )

        file_tuple = ("complaint.wav", b"fake audio data", "audio/wav")
        response = client.post(
            "/api/voice/analyze",
            files={"file": file_tuple}
        )

        assert response.status_code == 502
        data = response.json()
        assert data["success"] is False
        assert "unavailable" in data["message"]
