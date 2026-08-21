# VOICE & DEMAND INTAKE REMEDIATION REPORT
**Nivaran — Community Demand Intelligence**
Date: 2026-08-20
Status: VERIFIED & TESTED

---

## 1. Root Causes & Exact Failure Path

### What Caused the Video Failure:
1. **Contradictory 15,000ms Timeout**:
   - `frontend/src/api/client.ts` configured axios with `timeout: 15000` (15s).
   - The backend `create_issue` endpoint performs multimodal Stage 0 validation and classification with Gemini (default timeout 20s) and PostGIS spatial clustering.
   - When overall processing latency exceeded 15s, axios threw an unhandled `ECONNABORTED (timeout of 15000ms exceeded)` error.
   - The UI `elapsedSeconds` counter kept running via its interval timer up to ~29s before the error boundary completed re-rendering.
2. **Stuck at Stage 0**:
   - The frontend `AgentTimeline` component statically held the first step at `running` with legacy labels (`Stage 0 Validation Gate`, `Visual Intake & Classification`, `Geographic Deduplication`, `Impact Assessment`, `Official Draft Preparation`, `Escalation Dispatch`).
3. **Legacy CivicPulse / Complaint Terminology Conflict**:
   - The intake headers promised *"Transform raw photographic evidence of infrastructure failures into verified, sendable legal complaints and RTI briefs."*
   - This conflicted with the Track 1 challenge: **Nivaran — Community Demand Intelligence**.

---

## 2. Remediations Implemented

1. **Timeout Modernization & Progressive Stages**:
   - Increased client-side axios timeout in [`client.ts`](file:///d:/Projects/CivicPulse/frontend/src/api/client.ts) from `15000ms` to `45000ms`.
   - Updated [`AgentTimeline.tsx`](file:///d:/Projects/CivicPulse/frontend/src/components/timeline/AgentTimeline.tsx) with dynamic progress state transitions across the 6 canonical Demand Intelligence stages.
2. **First-Class Voice Recording & Preview Flow**:
   - Created [`VoiceRecorderModal.tsx`](file:///d:/Projects/CivicPulse/frontend/src/components/issue/VoiceRecorderModal.tsx) enabling citizens to record speech in **Hindi, Marathi, Portuguese, or English**, listen back to audio notes, view real-time Sarvam STT transcription, and inspect Gemini-extracted structured demand intelligence before applying it.
3. **Voice Audio Persistence**:
   - Updated `useCreateIssue` mutation in [`queries.ts`](file:///d:/Projects/CivicPulse/frontend/src/api/queries.ts) and [`IntakePage.tsx`](file:///d:/Projects/CivicPulse/frontend/src/pages/IntakePage.tsx) to pass the original `audio` file so that `audio_url` is stored in the database.
4. **Product Contract Ontology Alignment**:
   - Modernized all UI copy, headers, failure notices, and success milestone checklists in [`IntakePage.tsx`](file:///d:/Projects/CivicPulse/frontend/src/pages/IntakePage.tsx) and [`AgentTimeline.tsx`](file:///d:/Projects/CivicPulse/frontend/src/components/timeline/AgentTimeline.tsx) to reflect **Community Demand Intelligence**.
5. **Comprehensive Verification**:
   - Added unit and integration tests in [`test_voice_pipeline.py`](file:///d:/Projects/CivicPulse/backend/tests/test_voice_pipeline.py).
   - Full test suite (103 backend tests) passed (`100%`).
   - Frontend production build (`npm run build`) succeeded with 0 errors.

---
