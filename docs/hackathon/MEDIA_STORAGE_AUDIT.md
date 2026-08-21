# Media Storage Architecture Audit & Decision

**Project:** Nivaran — Community Demand Intelligence  
**Date:** 2026-08-21  

---

## 1. Current Media Handling Matrix

| File Type | Current Storage | In-Memory Processing | Persistence Layer | Used By | Production-Safe? | Decision / Status |
|---|---|---|---|---|---|---|
| **Text / Notes** | PostgreSQL / SQLite | None | `issues.user_note`, `clusters.summary` | Policymaker workspace & demand correlation | Yes | KEPT (Canonical SQLModel storage) |
| **Image Evidence** | `LocalStorageProvider` or `CloudinaryStorageProvider` | Pillow optimization (strips EXIF, extracts GPS, converts to JPEG) | Local disk (`static/uploads/`) or Cloudinary HTTPS CDN | Stage 0 Gemini analysis, feed cards, map popup | Yes (with Cloudinary in prod, Local in dev/ephemeral) | KEPT (Graceful fallback) |
| **Voice Audio** | Ephemeral / `audio_url` | Transmitted to `/voice/analyze` | Optional persistence in `issues.audio_url` | Sarvam STT & Gemini demand extraction | Yes | KEPT (Transient processing with optional audit URL) |
| **PDF Briefs** | ReportLab generation | In-memory stream (`BytesIO`) | Generated dynamically on-demand (`/action-drafts/{id}/pdf`) | Officer export & RTI escalation | Yes | KEPT (Zero local disk clutter) |

---

## 2. Cloudinary Architecture Decision

### Audit Findings:
1. **Is Cloudinary called at runtime?**
   - Yes, when `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are provided or `STORAGE_PROVIDER=cloudinary` is set.
2. **Is it required for the demo?**
   - For free-tier Render deployments where local disk is ephemeral across restarts, Cloudinary provides a persistent CDN URL (`https://res.cloudinary.com/...`).
   - If Cloudinary credentials are not provided (e.g. local development, test CI, or quick evaluation), `LocalStorageProvider` activates transparently.
3. **Decision**:
   - **Retain the clean, decoupled provider pattern**: `StorageProvider` interface with `LocalStorageProvider` and `CloudinaryStorageProvider`.
   - Local storage is the default (`STORAGE_PROVIDER=local`). Cloudinary is strictly optional and zero-risk. No code changes needed to break existing workflows.
