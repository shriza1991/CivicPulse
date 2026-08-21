# Master Environment Variable & Provider Audit

**Project:** Nivaran — Community Demand Intelligence  
**Date:** 2026-08-21  

---

## 1. Master Environment Variable Matrix

| Variable | Defined In | Used In | Required? | Production? | Layer | Secret? | Default? | Status |
|---|---|---|---|---|---|---|---|---|
| `DATABASE_URL` | `backend/.env.example`, `config.py` | `app/db.py` (SQLModel Engine) | **Yes** (in prod) | Yes | Backend | Yes | `sqlite:///nivaran.db` | ACTIVE (Neon in prod, SQLite in dev/CI) |
| `GEMINI_API_KEY` | `backend/.env.example`, `config.py` | `app/services/gemini_client.py` | **Yes** | Yes | Backend | Yes | `""` (mocked in tests) | ACTIVE (Google Gemini 2.5 Flash) |
| `GEMINI_MODEL` | `backend/.env.example`, `config.py` | `app/services/gemini_client.py` | No | Yes | Backend | No | `gemini-2.5-flash` | ACTIVE |
| `SARVAM_API_KEY` | `backend/.env.example`, `config.py` | `app/services/speech_service.py`, `voice_router.py` | No | Yes | Backend | Yes | `""` (graceful fallback in dev) | ACTIVE (Sarvam AI STT) |
| `JWT_SECRET_KEY` | `backend/.env.example`, `config.py` | `app/utils/security.py`, `app/routers/auth.py` | **Yes** (in prod) | Yes | Backend | Yes | `nivaran_super_secret...` | ACTIVE |
| `FRONTEND_ORIGIN` | `backend/.env.example`, `config.py` | `app/main.py` (CORS Middleware) | **Yes** (in prod) | Yes | Backend | No | `http://localhost:5173` | ACTIVE (Supports Vercel & local dev) |
| `STORAGE_PROVIDER` | `backend/.env.example`, `render.yaml` | `app/services/storage_provider.py` | No | Yes | Backend | No | `local` | ACTIVE (`local` or `cloudinary`) |
| `CLOUDINARY_CLOUD_NAME` | `backend/.env.example`, `render.yaml` | `app/services/storage_provider.py` | No | Optional | Backend | Yes | `""` | OPTIONAL CDN |
| `CLOUDINARY_API_KEY` | `backend/.env.example`, `render.yaml` | `app/services/storage_provider.py` | No | Optional | Backend | Yes | `""` | OPTIONAL CDN |
| `CLOUDINARY_API_SECRET` | `backend/.env.example`, `render.yaml` | `app/services/storage_provider.py` | No | Optional | Backend | Yes | `""` | OPTIONAL CDN |
| `SENDGRID_API_KEY` | `backend/.env.example`, `config.py` | `app/routers/escalations.py` | No | Optional | Backend | Yes | `""` | OPTIONAL (PDF fallback active) |
| `SENDGRID_FROM_EMAIL` | `backend/.env.example`, `config.py` | `app/routers/escalations.py` | No | Optional | Backend | No | `noreply@nivaran.org` | OPTIONAL |
| `REDIS_URL` | `backend/.env.example`, `config.py` | `app/main.py` (Rate limiter) | No | Optional | Backend | Yes | `redis://localhost:6379/0` | OPTIONAL (in-memory fallback) |
| `ENVIRONMENT` | `backend/.env.example`, `render.yaml` | `app/main.py` | No | Yes | Backend | No | `production` | ACTIVE |
| `PORT` | `render.yaml`, `Dockerfile` | `uvicorn` startup | No | Yes | Backend | No | `8000` | ACTIVE (Render dynamic port) |
| `VITE_API_BASE_URL` | `frontend/.env.example` | `api/client.ts`, `utils/getImageUrl.ts` | No | Yes | Frontend | No | `(DEV ? http://localhost:8000/api : /api)` | ACTIVE (Dynamic Vercel to Render) |
| `VITE_ENABLE_EVALUATION`| `frontend/.env.example` | `core/providers/AuthProvider.tsx` | No | Yes | Frontend | No | `false` | ACTIVE |
| `VITE_WHATSAPP_NUMBER` | `frontend/.env.example` | `WhatsAppReportBanner.tsx` | No | Optional | Frontend | No | `""` | OPTIONAL |

---

## 2. Startup Fail-Fast vs Degraded Operation Policy

1. **Critical Missing Keys**:
   - `DATABASE_URL`: In production, if PostgreSQL connection fails, health check `/health` returns `503 Service Unavailable`.
   - `GEMINI_API_KEY`: If missing in production, calls to Gemini endpoints return structured error with status `502 ai_unavailable` and clear user guidance.
2. **Optional Missing Keys**:
   - `SARVAM_API_KEY`: If absent, voice router returns clear 503 response stating speech transcription is unavailable and encourages manual text entry.
   - `CLOUDINARY_*`: Automatically falls back to `LocalStorageProvider` without blocking intake.
