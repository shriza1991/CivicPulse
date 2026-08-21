# Unfinished Work Audit & Triage

**Project:** Nivaran — Community Demand Intelligence  
**Date:** 2026-08-21  

---

## 1. Classification Matrix (P0 / P1 / P2)

| Item / Feature | Component | Priority | Status | Details |
|---|---|---|---|---|
| **CI Smoke Test Failure** | `frontend/scripts/frontend-smoke.test.mjs` | **P0** | **RESOLVED** | Updated test to match current `VoiceRecorderModal` and route paths. |
| **Idempotent Demo Data Seeder** | `backend/scripts/seed_demo_data.py` | **P0** | **RESOLVED** | Cross-border seed script (IND, BRA, ZAF) created and tested. |
| **Render Free Tier Deployment Config** | `render.yaml`, `Dockerfile` | **P0** | **RESOLVED** | Harmonized env vars (`SARVAM_API_KEY`, `JWT_SECRET_KEY`, `STORAGE_PROVIDER`). |
| **Vercel Free Tier Deployment Config** | `frontend/vercel.json`, `frontend/.env.example` | **P0** | **RESOLVED** | SPA routing rules and API proxy configuration verified. |
| **Frontend Production Build** | `frontend/dist` | **P0** | **RESOLVED** | `vite build` and `tsc -b` pass with 0 errors. |
| **Multilingual Voice Intake Flow** | `VoiceRecorderModal.tsx`, `voice_router.py` | **P0** | **RESOLVED** | Sarvam STT + Gemini demand extraction verified with unit & integration tests. |
| **Deterministic Data Fusion & Scoring** | `priority_engine.py`, `data_fusion.py` | **P0** | **RESOLVED** | Demographic weighting and infrastructure density integration verified. |
| **Gemini Policy Reasoning Engine** | `policy_advisor.py`, `gemini_client.py` | **P0** | **RESOLVED** | Schema-validated structured outputs with deterministic evidence citations. |
| **Live WebSocket Real-time Hotspots** | `backend/app/routers/` | P1 | DEFERRED | Polling / React Query invalidation in place for prototype. |
| **Full WhatsApp Twilio Webhook Live Number**| `whatsapp_webhook.py` | P1 | OPTIONAL | Twilio webhook handler implemented with unit tests; live Twilio sandbox optional. |
| **Native iOS/Android App** | Mobile | P2 | OUT OF SCOPE | Responsive Web SPA targets all devices. |

---

## 2. P0 Resolution Summary
All **P0 items are 100% complete**. Zero blocking defects remain for hackathon submission and deployment.
