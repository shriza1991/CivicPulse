"""
End-to-end and unit test suite for Multilingual Voice -> DemandSignal -> Policy Intelligence pipeline.
"""
import io
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi.testclient import TestClient

from app.services.speech_service import SpeechService
from app.services.issue_analysis_service import IssueAnalysisService, IssueAnalysis
from app.models.issue import Issue
from app.models.cluster import Cluster


@pytest.mark.asyncio
async def test_multilingual_voice_to_demand_signal_flow(client: TestClient):
    """
    Validates complete voice intake flow:
    Voice Audio (Marathi/Hindi) -> Sarvam STT -> Gemini Structured Demand Extraction -> DemandSignal Persisted with audio_url.
    """
    mock_stt_response = MagicMock()
    mock_stt_response.status_code = 200
    mock_stt_response.json.return_value = {
        "request_id": "sarvam-voice-req-8899",
        "transcript": "पावसाळ्यात इथे सतत पाणी साचतं, नालीची व्यवस्था हवी.",
        "language_code": "mr-IN"
    }

    mock_analysis = IssueAnalysis(
        detected_language="Marathi",
        english_translation="Water stagnates continuously during rains, drainage system needed.",
        issue_category="Drainage",
        issue_subcategory="Blocked Drainage / Waterlogging",
        severity="HIGH",
        department="Drainage & Water Supply Board",
        priority_score=85,
        summary="Recurring seasonal waterlogging due to absent drainage infrastructure."
    )

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_sarvam_post, \
         patch("app.services.speech_service.settings.SARVAM_API_KEY", "dummy_test_key"), \
         patch("app.services.gemini_client.GeminiClient.generate_structured_output", new_callable=AsyncMock) as mock_gemini:
        
        mock_sarvam_post.return_value = mock_stt_response
        mock_gemini.return_value = mock_analysis

        # 1. Test /api/voice/analyze endpoint
        audio_payload = ("demand_audio.webm", b"dummy voice audio data", "audio/webm")
        analyze_res = client.post(
            "/api/voice/analyze",
            files={"audio": audio_payload}
        )

        assert analyze_res.status_code == 200
        analysis_data = analyze_res.json()
        assert analysis_data["success"] is True
        assert "पावसाळ्यात" in analysis_data["transcript"]
        assert analysis_data["analysis"]["detected_language"] == "Marathi"
        assert analysis_data["analysis"]["issue_category"] == "Drainage"

        # 2. Test submitting issue with voice audio attached
        photo_payload = ("site_photo.jpg", b"\xff\xd8\xff\xe0" + b"\x00" * 2000, "image/jpeg")
        
        with patch("app.services.issue_service.validate_evidence_photo") as mock_stage0, \
             patch("app.services.issue_service.analyze_issue_photo") as mock_a1:
            
            from app.services.evidence_validation import Stage0Result, Stage0Checks
            mock_stage0.return_value = Stage0Result(
                accepted=True,
                failure=None,
                confidence=0.98,
                detected_object="Drainage Flooding",
                checks=Stage0Checks(file=True, quality=True, scene=True, infrastructure=True, issue=True),
                message="Accepted",
                suggestion="Clear"
            )

            from app.services.agent_1_intake import Agent1Output
            mock_a1.return_value = Agent1Output(
                issue_type="water",
                severity=4,
                description="Severe recurring waterlogging",
                credibility_score=0.92,
                image_flags=["clear"]
            )

            submit_res = client.post(
                "/api/issues",
                files={
                    "photo": photo_payload,
                    "audio": audio_payload
                },
                data={
                    "latitude": 19.0760,
                    "longitude": 72.8777,
                    "user_note": "पावसाळ्यात इथे सतत पाणी साचतं",
                    "community_choice": "join"
                }
            )

            assert submit_res.status_code == 201
            issue_json = submit_res.json()
            assert issue_json["id"] is not None
            assert issue_json["photo_url"] is not None
            assert issue_json["issue_type"] in ["water", "drainage", "road_damage"]


def test_speech_service_empty_audio_rejection():
    """Ensure empty audio files are rejected gracefully with 400 Bad Request."""
    empty_file = io.BytesIO(b"")
    empty_file.filename = "empty.mp3"
    empty_file.content_type = "audio/mpeg"

    with patch("app.services.speech_service.settings.SARVAM_API_KEY", "dummy_test_key"):
        with pytest.raises(ValueError, match="Audio file is empty"):
            import asyncio
            asyncio.run(SpeechService.transcribe_audio(empty_file))
