# FALLBACK & GRACEFUL DEGRADATION MATRIX
**Nivaran — Community Demand Intelligence**
Track 1: AI for Digital Public Infrastructure & Governance
Date: 2026-08-21

---

## 1. Resilience Philosophy
- **Never Fabricate Data**: Fallbacks must use documented rules, historical aggregates, or clear "Temporarily Unavailable" states rather than hallucinatory or fake metrics.
- **Data Preservation First**: Failures in downstream processors (e.g. STT or LLM reasoning) must NEVER discard original user-submitted evidence (audio, photos, GPS coordinates).
- **Truthful UI Communication**: If an AI operation is degraded, the user interface must explicitly explain what succeeded, what failed, and provide an actionable retry option.

---

## 2. Dependency Degradation Matrix

| Dependency | Primary Role | Failure Mode | Graceful Fallback Strategy | User Experience | Data Preserved? |
|---|---|---|---|---|---|
| **Google Gemini 2.5** | Evidence validation & policy reasoning | API rate-limit, timeout, or outage | 1. Failover to backup API keys (round-robin).<br>2. Fallback to deterministic rules (heuristic category tagging, deterministic priority engine).<br>3. Cache last generated policy recommendations. | User sees structured demand; policy brief shows *"AI policy reasoning temporarily unavailable — deterministic priority score active"*. | **YES** (Original photo, note, coordinates, and priority score intact) |
| **Sarvam AI** | Indic speech transcription (`saaras:v3`) | Rate-limit, timeout, or unparseable audio | 1. Preserves raw audio file to storage.<br>2. Allows citizen to type text note manually or retry transcription.<br>3. Non-blocking upload. | User hears audio playback, sees *"Voice note saved. Transcription service unavailable — please add brief text or retry"*. | **YES** (Audio file and GPS coordinates preserved) |
| **Neon PostgreSQL** | Structured storage & PostGIS queries | Connection drop or transient outage | 1. Read-only cached responses for static maps/demographics.<br>2. Frontend stores draft in `localStorage` (`nivaran_report_draft_v1`).<br>3. Controlled 503 error returned. | User alerted with clear message; drafts remain in local browser storage for automatic resubmission. | **YES** (Browser local draft retained) |
| **Object Storage** (R2/S3/Cloudinary) | Image & audio asset hosting | Network partition or bucket auth failure | 1. Automatic local filesystem fallback (`static/uploads`).<br>2. Preserves relative URLs. | Citizen upload succeeds transparently; image served via local API static mount. | **YES** (File saved locally) |
| **Map Tile Provider** (OpenStreetMap / MapLibre) | Interactive spatial clustering & hotspot map | Tile server timeout or network block | 1. Automatic fallback to tabular / card evidence list (`listFallback` prop in `MapWrapper`).<br>2. Coordinate badges displayed. | Citizen/policymaker continues working via structured list, sorting by severity, ward, and report count. | **YES** (All geospatial coordinates intact) |
| **Census / Demographic Datasets** | Population & infrastructure fusion | External ward lookup failure | 1. Fallback to pre-loaded local census & ward infrastructure fixtures (`demographics_data.json`).<br>2. Clear provenance tag (`Census Data + Municipal Registry (Local Fixture)`). | Complete demographic density and vulnerability indices displayed honestly with explicit provenance. | **YES** (Fully traceable) |

---
