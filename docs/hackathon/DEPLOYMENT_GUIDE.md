# DEPLOYMENT GUIDE — Production Cloud Operations

**Project**: Nivaran — Community Demand Intelligence  
**Target Infrastructure**: Vercel (Frontend) + Render (Backend) + Neon (PostgreSQL)  
**Document Authority**: Level 5 (Deployment Operations)  

---

## 1. Architecture Overview

- **Frontend**: React 19 + TypeScript + Vite Single Page Application deployed to **Vercel** with clean URLs and SPA routing rewrites (`frontend/vercel.json`).
- **Backend**: Python 3.11+ FastAPI containerized web service deployed to **Render** with dynamic host `0.0.0.0` and port binding (`render.yaml`).
- **Database**: Serverless **Neon PostgreSQL** with SSL pooling (`DATABASE_URL=postgresql://user:pass@ep-xyz.neon.tech/nivaran?sslmode=require`).
- **Storage Layer**: Decoupled `StorageProvider` abstraction. Default is `LocalStorageProvider` (`STORAGE_PROVIDER=local`) with zero external storage requirements; `CloudinaryStorageProvider` is an optional CDN layer.

---

## 2. Environment Variables

### Backend Environment Variables (`backend/.env.example` / Render Dashboard)

| Variable | Required? | Purpose | Default / Example |
|---|---|---|---|
| `DATABASE_URL` | **Yes** (Prod) | Neon PostgreSQL connection string | `postgresql://...neon.tech/nivaran?sslmode=require` |
| `GEMINI_API_KEY` | **Yes** | Google AI Studio API Key | `AIzaSy...` |
| `SARVAM_API_KEY` | Optional | Sarvam AI STT API Key | `sk-...` |
| `JWT_SECRET_KEY` | **Yes** (Prod) | Cryptographic signature key for JWT auth | Long random secret string |
| `FRONTEND_ORIGIN` | **Yes** (Prod) | Allowed CORS origins (comma-separated) | `https://nivaran-app.vercel.app,http://localhost:5173` |
| `STORAGE_PROVIDER` | No | Storage backend (`local` or `cloudinary`) | `local` |
| `ENVIRONMENT` | No | Runtime environment mode | `production` |
| `PORT` | No | Render dynamic port | `8000` |

### Frontend Environment Variables (`frontend/.env.example` / Vercel Dashboard)

| Variable | Required? | Purpose | Default / Example |
|---|---|---|---|
| `VITE_API_BASE_URL` | **Yes** (Prod) | URL to deployed Render backend API | `https://nivaran-backend.onrender.com/api` |
| `VITE_ENABLE_EVALUATION`| No | Feature flag for evaluation suite | `false` |

---

## 3. Step-by-Step Deployment Procedure

### A. Database (Neon PostgreSQL)
1. Create a database on [neon.tech](https://neon.tech) named `nivaran`.
2. Copy the pooled connection string with `?sslmode=require`.

### B. Backend (Render)
1. In Render Dashboard, create a **New Blueprint** from this repository using `render.yaml`.
2. Provide `DATABASE_URL`, `GEMINI_API_KEY`, `SARVAM_API_KEY`, `JWT_SECRET_KEY`, and `FRONTEND_ORIGIN`.
3. After deployment, open Render Shell and seed idempotent demo data:
   ```bash
   python scripts/seed_demo_data.py
   ```
4. Verify health probe: `curl https://<render-backend-url>/health` -> `{"status":"ok","database":"connected"}`.

### C. Frontend (Vercel)
1. In Vercel Dashboard, import the repository with Root Directory set to `frontend`.
2. Framework preset: `Vite`. Build command: `npm run build`. Output directory: `dist`.
3. Set environment variable `VITE_API_BASE_URL` pointing to `https://<render-backend-url>/api`.
4. Deploy and verify client routing.

---

## 4. Operational Debugging & Troubleshooting

- **Health Check Probe**: `/health` probes database connectivity (`select(1)`). Returns `503 Service Unavailable` if DB is down.
- **CORS Errors**: Ensure exact Vercel frontend URL is present in backend `FRONTEND_ORIGIN`.
- **Structured Logs**: All requests log `correlation_id`, method, path, status, and duration with zero sensitive citizen data or credentials leaked.
