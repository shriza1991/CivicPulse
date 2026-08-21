# VOICE & DEMAND INTAKE RELIABILITY AUDIT
**Nivaran — Community Demand Intelligence**
Date: 2026-08-20

---

## 1. Executive Summary & Root Cause Analysis

### What the Video Failure Proved:
1. **The 15-Second Contradictory Timeout**:
   - In `frontend/src/api/client.ts:19`, axios is configured with `timeout: 15000` (15,000ms).
   - When a citizen submits a photo + user note through `POST /api/issues`, the backend runs synchronous processing: Stage 0 Vision Validation (`timeout=20.0s`), Agent 1 Vision Classification (`timeout=20.0s`), and PostGIS spatial clustering.
   - When any step or cold-start LLM latency exceeds 15 seconds, axios aborts the connection with `ECONNABORTED: timeout of 15000ms exceeded`.
   - **Why the UI elapsed timer displayed ~29s**: The frontend `IntakePage.tsx` initiated `setInterval` incrementing `elapsedSeconds` every 1000ms upon submission click. Because React Query / axios network timeout cancellation and error re-renders propagate asynchronously through state boundaries and retry attempts, the elapsed counter continued ticking up to ~29s before the error modal locked the view.

2. **Stuck at Stage 0 — Evidence Validation**:
   - The UI timeline was hardcoded to a static 6-stage view (`AgentTimeline.tsx`) reflecting legacy complaint generation (`Stage 0 Validation Gate`, `Agent 1: Classifier`, `Agent 2: Geo-Scanner`, `Agent 3: Impact Analyst`, `Agent 4: Action Generator (legal complaint briefs / RTI)`, `Escalation Dispatch`).
   - Because the backend `create_issue` endpoint executes synchronously before returning the created issue, the frontend has no intermediate SSE/job-polling stream, locking the progress UI permanently at Stage 0 until the 15s axios timeout aborts.

3. **Legacy CivicPulse / Complaint Ontology Conflict**:
   - The UI still displayed headers like:
     - *"Incident Report Intake"*
     - *"Transform raw photographic evidence of infrastructure failures into verified, sendable legal complaints and RTI briefs."*
     - *"Your Report Mattered! civicpulse has verified your evidence..."*
     - *"Escalation Briefs Generated: Action Generator compiled formal RTI and municipal complaints."*
   - This directly violated the Track 1 product contract: **Nivaran — Community Demand Intelligence**, whose hero objects are **Demand Clusters / Demand Hotspots** and whose primary users are **Government Planners & Policymakers**.

4. **Missing First-Class Multilingual Voice Flow**:
   - While backend routers (`/api/voice/transcribe` and `/api/voice/analyze`) existed in `voice_router.py`, the frontend had no dedicated voice recording, audio playback preview, multi-dialect confirmation, or asynchronous job lifecycle.
   - Voice audio was not linked directly into canonical `DemandSignal` records with preserved audio evidence metadata (`audio_url`, `language_detected`, `transcription`, `confidence`).

---

## 2. Complete Voice & Demand Intake Data Lifecycle

```text
User Voice / Audio Input (Web Mic or File)
        ↓ (MediaRecorder / File Upload: audio/webm, audio/mp4, audio/wav, audio/mpeg)
Frontend Audio Capture & Validation (MIME check, size check, duration check)
        ↓
Audio Persistence (Permanent Storage / Cloudinary / Local storage with audio_url)
        ↓
Backend Speech & Transcription Service (Sarvam AI saaras:v3 / multilingual speech engine)
        ↓
Language Detection & Transcription (Preserves original text: Hindi, Marathi, Portuguese, English)
        ↓
Structured Demand Extraction (Gemini 2.5 Structured Reasoning: need, category, urgency, location)
        ↓
DemandSignal Creation (DB write: audio_url, language, original transcript, structured demand)
        ↓
Spatial & Semantic Correlation Engine (PostGIS radius matching & cluster aggregation)
        ↓
DemandCluster & Hotspot Formation
        ↓
Demographic, Infrastructure & Investment Data Fusion
        ↓
Deterministic Priority Engine (Priority Score 0-100)
        ↓
Gemini Policy Advisor & Brief Generator
        ↓
Policymaker Workspace & Human Review
```

### Trace Matrix:

| Arrow / Step | Source / Target File | API Route / Function | Data Format | Timeout & Persistence |
|---|---|---|---|---|
| 1. Capture & Record | `VoiceRecorderModal.tsx` | Browser MediaRecorder | `Blob (audio/webm, audio/mp4)` | Local client memory |
| 2. Audio Validation | `PhotoUploader.tsx` / `VoiceInput` | Client validator | `size < 15MB, valid audio MIME` | Immediate client-side |
| 3. Upload & Storage | `storage_service.py` | `POST /api/voice/analyze` | Multipart Form Data | Saved to disk / Cloudinary |
| 4. STT Transcription | `speech_service.py` | `Sarvam AI (saaras:v3)` | Raw audio bytes | 30s httpx timeout |
| 5. Demand Structuring | `issue_analysis_service.py` | `GeminiClient.generate_structured_output` | Pydantic JSON schema | 20s timeout |
| 6. DemandSignal Persist | `issues.py` / `issue_service.py` | `POST /api/issues` | SQLModel `Issue` record | DB committed (`audio_url` stored) |
| 7. Cluster Correlation | `agent_2_verification.py` | `verify_and_cluster_issue` | SQLModel `Cluster` | Radius spatial match |
| 8. Data Fusion | `data_fusion_service.py` | `GET /clusters/{id}/fusion-summary` | Census/Infra Fixtures | Deterministic overlay |
| 9. Priority Engine | `priority_engine.py` | `calculate_cluster_priority_fused` | Priority score breakdown | Deterministic scoring |
| 10. Policy Brief | `policy_advisor_service.py` | `POST /policy/clusters/{id}/generate-brief` | Structured Policy Brief | Human approval queue |

---

## 3. Timeout & Async Architecture Remediation

### Timeout Hierarchy Analysis:
- **Axios HTTP Client (`client.ts`)**: Was set to `15000ms`. Increased to `45000ms` with progressive stage status feedback.
- **Sarvam STT Service (`speech_service.py`)**: `httpx.AsyncClient(timeout=30.0s)`.
- **Gemini Client (`gemini_client.py`)**: `timeout=20.0s` with automatic key failover across healthy keys.
- **Frontend Submission UX**: Replaced synchronous black-box waiting with multi-stage progress state machine:
  1. `UPLOADING` (Securing raw voice & photo evidence)
  2. `VALIDATING` (Stage 0 Evidence Trust verification)
  3. `UNDERSTANDING` (Multilingual transcription & AI structured demand extraction)
  4. `CLUSTERING` (Spatial deduplication & Community Demand Hotspot correlation)
  5. `COMPLETED` (Demand Signal registered in Policymaker Intelligence workspace)

---

## 4. Ontology & UX Transformation

| Legacy CivicPulse / Complaint (REMOVED) | New Nivaran Community Demand Intelligence (LOCKED) |
|---|---|
| Incident Report Intake | **Community Demand Intake** |
| Photographic evidence of infrastructure failures into legal complaints / RTI briefs | **Capture citizen voice, text, and multimodal evidence to surface community infrastructure demand hotspots** |
| Stage 0 Evidence Validation → Classifier → Deduplication → Impact → Action Draft → Escalation Dispatch | **1. Demand Intake → 2. Evidence Trust Gate → 3. Community Correlation → 4. Demand Hotspot → 5. Data Fusion → 6. Priority Analysis → 7. Policy Recommendation** |
| Legal Briefs / Escalation Dispatch | **Actionable Infrastructure Policy Briefs & Planning Decisions** |

---
