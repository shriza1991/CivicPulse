"""
Voice Transcription & AI Analysis API Router.
Handles audio uploads, speech-to-text processing via Sarvam AI, and AI issue classification via Gemini.
"""
import os
import logging
from typing import Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, File, UploadFile, status, HTTPException
from fastapi.responses import JSONResponse

from app.config import settings
from app.services.speech_service import SpeechService
from app.services.issue_analysis_service import IssueAnalysisService

logger = logging.getLogger("nivaran")

router = APIRouter(prefix="/voice", tags=["Voice"])


class VoiceTranscribeResponse(BaseModel):
    success: bool = True
    transcript: str


class VoiceAnalyzeResponse(BaseModel):
    success: bool = True
    transcript: str
    analysis: Dict[str, Any]


class VoiceTranscribeErrorResponse(BaseModel):
    success: bool = False
    message: str


class VoiceHealthResponse(BaseModel):
    status: str = "ok"
    provider: str = "sarvam"
    configured: bool = True


@router.get("/health", response_model=VoiceHealthResponse)
def voice_health_check():
    """Verify voice transcription service health and Sarvam configuration status."""
    api_key = settings.SARVAM_API_KEY or os.getenv("SARVAM_API_KEY", "")
    is_configured = bool(api_key and api_key.strip())
    return VoiceHealthResponse(
        status="ok" if is_configured else "degraded",
        provider="sarvam",
        configured=is_configured
    )


@router.post("/transcribe")
async def transcribe_audio_endpoint(
    file: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None)
):
    """
    Transcribe an uploaded audio file using Sarvam AI.
    Accepts multipart/form-data with 'file' or 'audio' field.
    """
    upload_file = file or audio
    if not upload_file:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "No audio file provided in request."}
        )

    try:
        result = await SpeechService.transcribe_audio(upload_file)
        return VoiceTranscribeResponse(
            success=True,
            transcript=result.get("transcript", "")
        )
    except ValueError as val_err:
        logger.warning(f"voice_router | Validation error: {str(val_err)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": str(val_err)}
        )
    except Exception as exc:
        logger.exception("voice_router | Transcription request failed")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": str(exc)}
        )


@router.post("/analyze")
async def analyze_voice_endpoint(
    file: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None)
):
    """
    Full Voice Pipeline: Upload Audio -> Sarvam STT -> Gemini Analysis -> Structured JSON.
    Accepts multipart/form-data with 'file' or 'audio' field.
    """
    upload_file = file or audio
    if not upload_file:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "No audio file provided in request."}
        )

    try:
        stt_result = await SpeechService.transcribe_audio(upload_file)
        transcript = stt_result.get("transcript", "")
        if not transcript or not transcript.strip():
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False, "message": "Audio transcription produced empty text."}
            )

        analysis_result = await IssueAnalysisService.analyze_transcript(transcript)

        return VoiceAnalyzeResponse(
            success=True,
            transcript=transcript,
            analysis=analysis_result
        )
    except ValueError as val_err:
        logger.warning(f"voice_router | Validation error during voice analysis: {str(val_err)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": str(val_err)}
        )
    except HTTPException as http_exc:
        detail_msg = http_exc.detail.get("error") if isinstance(http_exc.detail, dict) else str(http_exc.detail)
        if detail_msg == "ai_unavailable":
            detail_msg = "AI analysis service is currently unavailable. Please try again later."
        logger.error(f"voice_router | AI Service error: {detail_msg}")
        return JSONResponse(
            status_code=http_exc.status_code,
            content={"success": False, "message": detail_msg}
        )
    except Exception as exc:
        logger.exception("voice_router | Voice analysis processing failed")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": str(exc)}
        )
