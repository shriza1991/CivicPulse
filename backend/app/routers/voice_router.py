"""
Voice Transcription API Router.
Handles audio uploads and delegates speech-to-text processing to Sarvam AI.
"""
import os
import logging
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, File, UploadFile, status
from fastapi.responses import JSONResponse

from app.config import settings
from app.services.speech_service import SpeechService

logger = logging.getLogger("nivaran")

router = APIRouter(prefix="/voice", tags=["Voice"])


class VoiceTranscribeResponse(BaseModel):
    success: bool = True
    transcript: str


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
