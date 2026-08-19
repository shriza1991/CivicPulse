"""
Sarvam AI Speech-to-Text Service.
Provides audio transcription capabilities using Sarvam AI saaras:v3 model.
"""
import os
import logging
import httpx
from typing import Any, Dict
from app.config import settings

logger = logging.getLogger("nivaran")

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"


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
        content_type = "audio/mpeg"

        if hasattr(file, "read"):
            read_res = file.read()
            if hasattr(read_res, "__await__"):
                file_bytes = await read_res
            else:
                file_bytes = read_res
            filename = getattr(file, "filename", None) or "audio.mp3"
            content_type = getattr(file, "content_type", None) or "audio/mpeg"
        elif isinstance(file, bytes):
            file_bytes = file
        else:
            raise ValueError("Unsupported file format provided for transcription.")

        if not file_bytes:
            raise ValueError("Audio file is empty.")

        headers = {
            "api-subscription-key": api_key
        }

        files = {
            "file": (filename, file_bytes, content_type)
        }
        data = {
            "model": "saaras:v3",
            "mode": "transcribe"
        }

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
