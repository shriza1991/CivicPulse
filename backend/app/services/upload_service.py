"""
Resumable & Chunked Media Upload Session Management Service.
"""
import os
import shutil
import hashlib
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
from sqlmodel import Session as DBSession, select
from fastapi import HTTPException, status, UploadFile

from app.models.sync import UploadSession, MediaAsset

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf"
}
MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 # 25 MB max
TEMP_UPLOADS_BASE = os.path.abspath("static/uploads/temp")
FINAL_UPLOADS_BASE = os.path.abspath("static/uploads")

os.makedirs(TEMP_UPLOADS_BASE, exist_ok=True)
os.makedirs(FINAL_UPLOADS_BASE, exist_ok=True)

class UploadService:

    @staticmethod
    def create_upload_session(
        db: DBSession,
        filename: str,
        file_size: int,
        mime_type: str,
        total_chunks: int = 1,
        expected_sha256: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> UploadSession:
        """Create a new resumable upload session."""
        if mime_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported media type: '{mime_type}'. Supported: {', '.join(sorted(ALLOWED_MIME_TYPES))}"
            )

        if file_size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size exceeds maximum limit of 25MB ({file_size} bytes provided)."
            )

        if total_chunks < 1:
            total_chunks = 1

        import uuid
        session_id = f"UPL-{uuid.uuid4().hex[:12].upper()}"
        session_temp_dir = os.path.join(TEMP_UPLOADS_BASE, session_id)
        os.makedirs(session_temp_dir, exist_ok=True)

        expires_at = datetime.now(timezone.utc) + timedelta(hours=24)

        session_rec = UploadSession(
            id=session_id,
            user_id=user_id,
            filename=filename,
            file_size=file_size,
            mime_type=mime_type,
            expected_sha256=expected_sha256,
            total_chunks=total_chunks,
            uploaded_chunks=[],
            bytes_uploaded=0,
            status="pending",
            temp_dir=session_temp_dir,
            expires_at=expires_at
        )
        db.add(session_rec)
        db.commit()
        db.refresh(session_rec)
        return session_rec

    @staticmethod
    def save_chunk(
        db: DBSession,
        session_id: str,
        chunk_index: int,
        chunk_file: UploadFile,
        user_id: Optional[str] = None
    ) -> UploadSession:
        """Store an individual chunk file for an active upload session."""
        session_rec = db.exec(select(UploadSession).where(UploadSession.id == session_id)).first()
        if not session_rec:
            raise HTTPException(status_code=404, detail="Upload session not found")

        if session_rec.status in ["completed", "cancelled", "expired"]:
            raise HTTPException(status_code=400, detail=f"Upload session is {session_rec.status}")

        if chunk_index < 0 or chunk_index >= session_rec.total_chunks:
            raise HTTPException(status_code=400, detail=f"Invalid chunk index: {chunk_index}")

        # Check ownership if user bound
        if session_rec.user_id and user_id and session_rec.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to modify this upload session")

        chunk_path = os.path.join(session_rec.temp_dir, f"chunk_{chunk_index}.dat")
        chunk_bytes = chunk_file.file.read()

        with open(chunk_path, "wb") as f:
            f.write(chunk_bytes)

        # Update session record
        current_chunks = set(session_rec.uploaded_chunks or [])
        if chunk_index not in current_chunks:
            current_chunks.add(chunk_index)
            session_rec.uploaded_chunks = sorted(list(current_chunks))
            session_rec.bytes_uploaded += len(chunk_bytes)

        session_rec.status = "uploading"
        db.add(session_rec)
        db.commit()
        db.refresh(session_rec)
        return session_rec

    @staticmethod
    def complete_upload(
        db: DBSession,
        session_id: str,
        user_id: Optional[str] = None
    ) -> MediaAsset:
        """Assemble all uploaded chunks into the final static file and create MediaAsset."""
        session_rec = db.exec(select(UploadSession).where(UploadSession.id == session_id)).first()
        if not session_rec:
            raise HTTPException(status_code=404, detail="Upload session not found")

        if session_rec.status == "completed":
            existing_asset = db.exec(select(MediaAsset).where(MediaAsset.upload_session_id == session_id)).first()
            if existing_asset:
                return existing_asset

        uploaded_chunks = set(session_rec.uploaded_chunks or [])
        expected_chunks = set(range(session_rec.total_chunks))
        if uploaded_chunks != expected_chunks:
            missing = sorted(list(expected_chunks - uploaded_chunks))
            raise HTTPException(
                status_code=400,
                detail=f"Cannot complete upload. Missing chunks: {missing}"
            )

        # Determine final extension and path
        ext = os.path.splitext(session_rec.filename)[1] or ".jpg"
        final_filename = f"{session_rec.id}{ext}"
        final_abs_path = os.path.join(FINAL_UPLOADS_BASE, final_filename)

        # Assemble chunks into final file
        hasher = hashlib.sha256()
        with open(final_abs_path, "wb") as final_f:
            for idx in sorted(list(uploaded_chunks)):
                chunk_path = os.path.join(session_rec.temp_dir, f"chunk_{idx}.dat")
                if not os.path.exists(chunk_path):
                    raise HTTPException(status_code=500, detail=f"Chunk file missing: chunk_{idx}.dat")
                with open(chunk_path, "rb") as c_f:
                    data = c_f.read()
                    hasher.update(data)
                    final_f.write(data)

        actual_sha256 = hasher.hexdigest()

        # Checksum validation if expected
        if session_rec.expected_sha256 and session_rec.expected_sha256.lower() != actual_sha256.lower():
            os.remove(final_abs_path)
            raise HTTPException(
                status_code=400,
                detail=f"Checksum verification failed. Expected {session_rec.expected_sha256}, got {actual_sha256}"
            )

        rel_static_path = f"/static/uploads/{final_filename}"
        session_rec.status = "completed"
        session_rec.final_file_path = rel_static_path
        db.add(session_rec)

        # Create MediaAsset record
        asset = MediaAsset(
            upload_session_id=session_rec.id,
            user_id=user_id or session_rec.user_id,
            filename=session_rec.filename,
            file_path=rel_static_path,
            file_size=session_rec.bytes_uploaded,
            mime_type=session_rec.mime_type,
            sha256_hash=actual_sha256
        )
        db.add(asset)
        db.commit()
        db.refresh(asset)

        # Clean temp directory
        try:
            shutil.rmtree(session_rec.temp_dir, ignore_errors=True)
        except Exception:
            pass

        return asset

    @staticmethod
    def cancel_upload(db: DBSession, session_id: str, user_id: Optional[str] = None) -> bool:
        """Cancel an upload session and delete temporary files."""
        session_rec = db.exec(select(UploadSession).where(UploadSession.id == session_id)).first()
        if not session_rec:
            return False

        session_rec.status = "cancelled"
        db.add(session_rec)
        db.commit()

        try:
            shutil.rmtree(session_rec.temp_dir, ignore_errors=True)
        except Exception:
            pass
        return True
