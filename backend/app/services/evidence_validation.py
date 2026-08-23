import os
import io
import time
import threading
from enum import Enum
from typing import Optional, Dict
from pydantic import BaseModel, Field
from PIL import Image, ImageFilter, ImageStat, ImageOps, ImageEnhance
from app.services.gemini_client import GeminiClient

class ValidationFailure(str, Enum):
    DOCUMENT = "DOCUMENT"
    SCREENSHOT = "SCREENSHOT"
    SELFIE = "SELFIE"
    LOW_QUALITY = "LOW_QUALITY"
    NO_INFRASTRUCTURE = "NO_INFRASTRUCTURE"
    NO_VISIBLE_ISSUE = "NO_VISIBLE_ISSUE"
    MANUAL_REVIEW = "MANUAL_REVIEW"
    UNKNOWN = "UNKNOWN"

class Stage0Checks(BaseModel):
    file: bool
    quality: bool
    scene: bool
    infrastructure: bool
    issue: bool

class Stage0Result(BaseModel):
    accepted: bool
    failure: Optional[ValidationFailure]
    confidence: float
    detected_object: str
    checks: Stage0Checks
    message: str
    suggestion: str

# Thread-safe cache and metrics singleton
STAGE0_HASH_CACHE: Dict[str, Stage0Result] = {}
cache_lock = threading.Lock()

class MetricsTracker:
    def __init__(self):
        self._lock = threading.Lock()
        self.rejected_uploads = 0
        self.accepted_uploads = 0
        self.gemini_calls_saved = 0
        self.validation_latencies = []
        self.cache_hits = 0

    def track_upload(self, accepted: bool, cached: bool, latency_ms: float):
        with self._lock:
            if accepted:
                self.accepted_uploads += 1
            else:
                self.rejected_uploads += 1
            
            if cached:
                self.cache_hits += 1
                self.gemini_calls_saved += 1
                
            self.validation_latencies.append(latency_ms)

    def get_metrics(self):
        with self._lock:
            avg_latency = (
                sum(self.validation_latencies) / len(self.validation_latencies)
                if self.validation_latencies else 0.0
            )
            return {
                "rejected_uploads": self.rejected_uploads,
                "accepted_uploads": self.accepted_uploads,
                "gemini_calls_saved": self.gemini_calls_saved,
                "cache_hits": self.cache_hits,
                "average_validation_latency_ms": round(avg_latency, 2),
                "total_validations": len(self.validation_latencies)
            }

metrics_tracker = MetricsTracker()

def auto_fix_and_normalize_image(
    photo_bytes: bytes,
    mime_type: str = "image/jpeg",
    min_dim: int = 600,
    max_dim: int = 2048,
    target_quality: int = 88,
) -> tuple[bytes, str, bool]:
    """
    Self-healing image preprocessor:
    Accepts images of any resolution, format, or condition.
    - Decodes image (JPEG, PNG, WEBP, BMP, etc.)
    - Transposes EXIF orientation
    - Converts mode to RGB (compositing alpha on white background if RGBA/transparent)
    - Auto-upscales low-resolution images (< min_dim) to >= min_dim with LANCZOS + subtle edge sharpening
    - Auto-downscales high-resolution images (> max_dim) to <= max_dim with LANCZOS
    - Auto-enhances underexposed/dark images
    - Returns (fixed_bytes, 'image/jpeg', was_fixed)
    """
    if not photo_bytes:
        return photo_bytes, mime_type, False

    try:
        with Image.open(io.BytesIO(photo_bytes)) as img:
            # Auto-orient based on EXIF orientation tag
            img = ImageOps.exif_transpose(img)

            # Handle alpha transparency / palettes
            if img.mode in ("RGBA", "LA", "P"):
                img_rgba = img.convert("RGBA")
                bg = Image.new("RGB", img_rgba.size, (255, 255, 255))
                if len(img_rgba.split()) >= 4:
                    bg.paste(img_rgba, mask=img_rgba.split()[3])
                else:
                    bg.paste(img_rgba)
                img = bg
            elif img.mode != "RGB":
                img = img.convert("RGB")

            w, h = img.size
            if w <= 0 or h <= 0:
                return photo_bytes, mime_type, False

            # Resolution self-healing:
            # If smaller than min_dim in either dimension, upscale while preserving aspect ratio
            if w < min_dim or h < min_dim:
                scale = max(min_dim / max(w, 1), min_dim / max(h, 1))
                new_w = max(int(round(w * scale)), min_dim)
                new_h = max(int(round(h * scale)), min_dim)
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
                # Apply subtle sharpening to preserve edge clarity after upscaling
                try:
                    enhancer = ImageEnhance.Sharpness(img)
                    img = enhancer.enhance(1.25)
                except Exception:
                    pass
            elif w > max_dim or h > max_dim:
                scale = max_dim / max(w, h)
                new_w = max(int(round(w * scale)), 1)
                new_h = max(int(round(h * scale)), 1)
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

            # Adaptive lighting/contrast enhancement if image is too dark
            try:
                gray = img.convert("L")
                stat = ImageStat.Stat(gray)
                mean_b = stat.mean[0]
                if mean_b < 35:
                    bright_factor = min(2.2, 65.0 / max(mean_b, 5.0))
                    img = ImageEnhance.Brightness(img).enhance(bright_factor)
                    img = ImageEnhance.Contrast(img).enhance(1.15)
                elif mean_b > 240:
                    img = ImageEnhance.Brightness(img).enhance(0.9)
            except Exception:
                pass

            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=target_quality, optimize=True)
            return buf.getvalue(), "image/jpeg", True

    except Exception:
        # If parsing completely fails (e.g. non-image binary payload), return original
        return photo_bytes, mime_type, False

def calculate_dhash_from_bytes(photo_bytes: bytes, hash_size: int = 8) -> str:
    try:
        with Image.open(io.BytesIO(photo_bytes)) as img:
            img = img.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.BILINEAR)
            pixels = list(img.getdata())
            diff = []
            for row in range(hash_size):
                for col in range(hash_size):
                    left = pixels[row * (hash_size + 1) + col]
                    right = pixels[row * (hash_size + 1) + col + 1]
                    diff.append(left > right)
            decimal_value = 0
            for index, value in enumerate(diff):
                if value:
                    decimal_value += 2 ** index
            return f"{decimal_value:016x}"
    except Exception:
        return ""

def run_cheap_validations(photo_bytes: bytes, mime_type: str) -> tuple[bool, Optional[ValidationFailure], Optional[Stage0Checks], str]:
    # 1. Image decodability verification
    try:
        with Image.open(io.BytesIO(photo_bytes)) as img:
            img.verify()
    except Exception as e:
        return (
            False,
            ValidationFailure.LOW_QUALITY,
            Stage0Checks(file=False, quality=False, scene=False, infrastructure=False, issue=False),
            f"Failed to parse image file: {str(e)}"
        )

    # 2. Upper bound file size check (25MB max to prevent memory exhaustion)
    file_size_mb = len(photo_bytes) / (1024 * 1024)
    if file_size_mb > 25.0:
        return (
            False,
            ValidationFailure.LOW_QUALITY,
            Stage0Checks(file=False, quality=False, scene=False, infrastructure=False, issue=False),
            "The uploaded file exceeds the 25MB size limit."
        )

    # Valid image format and quality (resolution is automatically self-healed)
    return (
        True,
        None,
        Stage0Checks(file=True, quality=True, scene=False, infrastructure=False, issue=False),
        "Image validated and resolution auto-optimized."
    )

async def validate_evidence_photo(
    photo_bytes: bytes,
    mime_type: str,
    gemini_client: Optional[GeminiClient] = None
) -> Stage0Result:
    start_time = time.time()
    
    # 0. Auto-fix and normalize image of any resolution
    fixed_bytes, resolved_mime, was_fixed = auto_fix_and_normalize_image(photo_bytes, mime_type)
    if was_fixed:
        photo_bytes = fixed_bytes
        mime_type = resolved_mime

    # 1. Run cheap validations
    success, failure_type, checks, message = run_cheap_validations(photo_bytes, mime_type)
    if not success:
        result = Stage0Result(
            accepted=False,
            failure=failure_type,
            confidence=1.0,
            detected_object="Invalid File / Corrupt Media",
            checks=checks,
            message=message,
            suggestion="Please upload a valid image in JPEG, PNG, or WEBP format."
        )
        latency = (time.time() - start_time) * 1000
        metrics_tracker.track_upload(accepted=False, cached=False, latency_ms=latency)
        return result

    # 2. Compute perceptual dhash & check cache
    dhash = calculate_dhash_from_bytes(photo_bytes)
    if dhash:
        with cache_lock:
            if dhash in STAGE0_HASH_CACHE:
                cached_result = STAGE0_HASH_CACHE[dhash]
                latency = (time.time() - start_time) * 1000
                metrics_tracker.track_upload(accepted=cached_result.accepted, cached=True, latency_ms=latency)
                return cached_result

    # 3. Stage-0 AI Validation via Gemini Vision
    if gemini_client is None:
        gemini_client = GeminiClient()

    prompt = "Perform Stage 0 evidence validation check on this uploaded media."
    system_instruction = (
        "You are the Stage 0 Evidence Validation Gate for nivaran. "
        "Strictly evaluate the image contents and determine if it represents a valid outdoor civic infrastructure issue report.\n"
        "1. Is it a real photograph (and NOT a document, certificate, screenshot, graphic, design, animal, selfie, or random indoor item)?\n"
        "2. Is it outdoor (and NOT indoor)?\n"
        "3. Does it contain civic/public infrastructure (e.g., roads, footpaths, utility poles, municipal garbage bins, streetlights)?\n"
        "4. Is a civic infrastructure issue or hazard visible (e.g., potholes, broken streetlight, open garbage pile, water leakage, blocked drainage)?\n\n"
        "CRITICAL RULES:\n"
        "- If uncertain, reject. Never guess. Never infer damage not visible.\n"
        "- If the image is a certificate, document, selfie, animal, random indoor object, or screenshot, accepted must be False.\n"
        "- Set failure to DOCUMENT if it is a document/certificate, SCREENSHOT if it is a screenshot, SELFIE if it is a selfie, "
        "NO_INFRASTRUCTURE if it lacks civic infrastructure, NO_VISIBLE_ISSUE if it contains infrastructure but no visible hazard, "
        "and LOW_QUALITY if unusable. Otherwise None."
    )

    class GeminiStage0Output(BaseModel):
        accepted: bool = Field(..., description="True if it is a real photo, outdoor, contains civic infrastructure, and shows a visible issue.")
        failure: Optional[ValidationFailure] = Field(..., description="The failure category, or null if accepted is True.")
        confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score of the decision.")
        detected_object: str = Field(..., description="The main object detected (e.g. Document, Selfie, Pothole, Trash, Streetlight).")
        checks: Stage0Checks = Field(..., description="Booleans for each check category.")
        message: str = Field(..., description="Friendly user message explaining why it was accepted or rejected.")

    try:
        ai_res = await gemini_client.generate_structured_output(
            prompt=prompt,
            response_schema=GeminiStage0Output,
            system_instruction=system_instruction,
            image_data=photo_bytes,
            image_mime_type=mime_type
        )
        
        # Enforce confidence thresholds:
        # >= 0.90 Accept
        # 0.75-0.89 Manual Review (Treat as rejected in backend to avoid pipeline pollution)
        # < 0.75 Reject
        accepted_status = ai_res.accepted
        failure_cat = ai_res.failure
        checks_obj = ai_res.checks
        message_text = ai_res.message

        if accepted_status:
            if ai_res.confidence < 0.75:
                accepted_status = False
                failure_cat = ValidationFailure.LOW_QUALITY
                message_text = f"Confidence {ai_res.confidence:.2f} is too low. Rejected."
                checks_obj = Stage0Checks(file=True, quality=True, scene=checks_obj.scene, infrastructure=checks_obj.infrastructure, issue=False)
            elif ai_res.confidence < 0.90:
                accepted_status = False
                failure_cat = ValidationFailure.MANUAL_REVIEW
                message_text = f"Confidence {ai_res.confidence:.2f} is in manual review range. Rejected."
                checks_obj = Stage0Checks(file=True, quality=True, scene=checks_obj.scene, infrastructure=checks_obj.infrastructure, issue=False)

        # Enforce that cheap checks (file and quality) are kept as True in final output since they passed
        final_checks = Stage0Checks(
            file=True,
            quality=True,
            scene=checks_obj.scene,
            infrastructure=checks_obj.infrastructure,
            issue=checks_obj.issue
        )

        # Suggestion mapping
        suggestions = {
            ValidationFailure.DOCUMENT: "Please upload a real photograph showing a local civic infrastructure issue instead of a document or certificate.",
            ValidationFailure.SCREENSHOT: "Please capture a live photo of the civic issue directly rather than submitting a screenshot.",
            ValidationFailure.SELFIE: "Please submit a photo focusing strictly on the public utility issue, avoiding selfies or personal portraits.",
            ValidationFailure.LOW_QUALITY: "Try retaking the photo in daylight with better lighting, focus, or from a closer distance.",
            ValidationFailure.NO_INFRASTRUCTURE: "Ensure the photo clearly features civic assets like municipal roads, utility poles, streetlights, or footpaths.",
            ValidationFailure.NO_VISIBLE_ISSUE: "Focus your camera directly on the specific damaged area or hazard (e.g. pothole or garbage pile).",
            ValidationFailure.MANUAL_REVIEW: "Our verification engine is uncertain about this submission. Please submit a clearer, more direct photo of the hazard.",
            ValidationFailure.UNKNOWN: "Please try uploading a different photo showing the civic issue clearly."
        }
        suggestion_text = suggestions.get(failure_cat, "Please upload a clear, outdoor photo showing a pothole, streetlight, or garbage issue.")

        result = Stage0Result(
            accepted=accepted_status,
            failure=failure_cat,
            confidence=ai_res.confidence,
            detected_object=ai_res.detected_object,
            checks=final_checks,
            message=message_text,
            suggestion=suggestion_text
        )
    except Exception as e:
        # Fallback to an error result
        result = Stage0Result(
            accepted=False,
            failure=ValidationFailure.UNKNOWN,
            confidence=0.0,
            detected_object="Error",
            checks=Stage0Checks(file=True, quality=True, scene=False, infrastructure=False, issue=False),
            message=f"AI Validation currently unavailable: {str(e)}",
            suggestion="Please try again in a few moments."
        )

    # 4. Cache & track metrics
    if dhash and result.failure != ValidationFailure.UNKNOWN:
        with cache_lock:
            STAGE0_HASH_CACHE[dhash] = result

    latency = (time.time() - start_time) * 1000
    metrics_tracker.track_upload(accepted=result.accepted, cached=False, latency_ms=latency)
    return result
