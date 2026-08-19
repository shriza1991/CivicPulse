"""
Sarvam AI Speech-to-Text Service.
Provides audio transcription capabilities using Sarvam AI saaras:v3 model.
"""
import os
import logging
import httpx
from typing import Any, Dict, Optional
from app.config import settings

logger = logging.getLogger("nivaran")

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"


def resolve_content_type(filename: str, original_content_type: Optional[str]) -> str:
    """Normalize MIME type based on audio file extension."""
    if not filename:
        return original_content_type or "application/octet-stream"

    ext = filename.lower().split(".")[-1]

    mapping = {
        "mp3": "audio/mpeg",
        "wav": "audio/wav",
        "webm": "audio/webm",
        "m4a": "audio/mp4",
        "aac": "audio/aac",
        "ogg": "audio/ogg",
    }

    return mapping.get(ext, original_content_type or "application/octet-stream")


class SpeechService:

    @staticmethod
    async def transcribe_audio(file: Any) -> Dict[str, str]:
        """
        Transcribe an audio file using Sarvam AI Speech-to-Text API.

        Accepts:
            file: UploadFile, bytes, or file-like object

        Returns:
            dict: {"transcript": "<text>"}
        """
        api_key = settings.SARVAM_API_KEY or os.getenv("SARVAM_API_KEY", "")
        if not api_key:
            logger.error("speech_service | SARVAM_API_KEY is missing or empty")
            raise ValueError("SARVAM_API_KEY environment variable is not set.")

        file_bytes = b""
        filename = "audio.mp3"
        raw_content_type = "audio/mpeg"

        if hasattr(file, "read"):
            read_res = file.read()
            if hasattr(read_res, "__await__"):
                file_bytes = await read_res
            else:
                file_bytes = read_res
            filename = getattr(file, "filename", None) or "audio.mp3"
            raw_content_type = getattr(file, "content_type", None)
        elif isinstance(file, bytes):
            file_bytes = file
            raw_content_type = "audio/mpeg"
        else:
            raise ValueError("Unsupported file format provided for transcription.")

        if not file_bytes:
            raise ValueError("Audio file is empty.")

        logger.info(
            f"Voice upload received: filename={filename}, content_type={raw_content_type}"
        )

        content_type = resolve_content_type(filename, raw_content_type)

        headers = {
            "api-subscription-key": api_key
        }

        files = {
            "file": (
                filename,
                file_bytes,
                content_type,
            )
        }
        data = {
            "model": "saaras:v3",
            "mode": "transcribe"
        }

        logger.info(
            f"Sending file to Sarvam: filename={filename}, content_type={content_type}"
        )

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    SARVAM_STT_URL,
                    headers=headers,
                    files=files,
                    data=data
                )

            if response.status_code == 200:
                res_data = response.json()
                if hasattr(res_data, "__await__"):
                    res_data = await res_data
                transcript = res_data.get("transcript") or res_data.get("text") or ""
                req_id = res_data.get("request_id", "unknown")
                logger.info(f"speech_service | Transcription successful | request_id={req_id}")
                return {"transcript": transcript}
            else:
                error_msg = f"Sarvam API returned HTTP {response.status_code}: {response.text}"
                logger.error(f"speech_service | {error_msg}")
                raise RuntimeError(error_msg)

        except httpx.HTTPError as exc:
            logger.exception("speech_service | Network error during Sarvam API request")
            raise RuntimeError(f"Network error connecting to Sarvam AI: {str(exc)}") from exc
        except Exception as exc:
            logger.exception("speech_service | Error processing audio transcription")
            raise
