# DEPLOYMENT ARCHITECTURE
**Nivaran — Community Demand Intelligence**
Track 1: AI for Digital Public Infrastructure & Governance
Date: 2026-08-21

---

## 1. System Topology

```text
┌────────────────────────────────────────────────────────┐
│                   CITIZEN / POLICYMAKER                │
│             Web Browser (Desktop / Mobile)             │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / WSS
                           ▼
┌────────────────────────────────────────────────────────┐
│                  FRONTEND STATIC HOST                  │
│       Vercel / Cloudflare Pages / Render Static        │
│          • React 18 + TypeScript + Vite                │
│          • TailwindCSS + Framer Motion                 │
│          • MapLibre / OpenStreetMap / Leaflet          │
└──────────────────────────┬─────────────────────────────┘
                           │ JSON / Multipart Form-Data
                           ▼
┌────────────────────────────────────────────────────────┐
│                  BACKEND API SERVER                    │
│            FastAPI (Python 3.11+ / Uvicorn)            │
│       • Security & Rate Limiting Middleware            │
│       • Structured JSON Logging & Correlation IDs      │
│       • Evidence Validation & Classification Agents    │
│       • Deterministic Priority & Spatial Engine        │
│       • Policy Advisor & Document Generation           │
└────────┬─────────────────┬───────────────────┬─────────┘
         │                 │                   │
         ▼                 ▼                   ▼
┌──────────────────┐ ┌─────────────┐ ┌───────────────────┐
│ DATABASE         │ │ STORAGE     │ │ EXTERNAL AI       │
│ Neon PostgreSQL  │ │ Cloudflare  │ │ Google Gemini 2.5 │
│ (SQLModel/PostGIS│ │ R2 / Local  │ │ (Reasoning/Vision)│
│  or SQLite CI)   │ │ (Media/EXIF)│ │ Sarvam AI (STT)   │
└──────────────────┘ └─────────────┘ └───────────────────┘
```

---

## 2. Service Responsibilities

1. **Frontend (Vercel / Render Static Web)**:
   - Delivers responsive user interfaces for Community Demand Intake, Live Voice Capture, Spatial Demand Hotspot Explorer, Priority Breakdown, and Policymaker Decision Workspace.
   - Handles client-side GPS location capture, audio preview playback, and optimistic state updates.
2. **Backend (FastAPI on Render / Container Host)**:
   - Exposes RESTful endpoints under `/api`.
   - Coordinates multi-agent processing pipelines (Stage 0 Evidence Gate, Agent 1 Classification, Agent 2 Spatial Clustering, Agent 3 Impact Assessment, Agent 4 Action Generation, Policy Advisor).
3. **Database (Neon Serverless PostgreSQL)**:
   - Stores core business entities: `Issue`, `Cluster`, `FusedSummary`, `PriorityBreakdown`, `PolicyRecommendation`, `ActionDraft`, `AuditLog`, `User`.
4. **Media Storage (Cloudflare R2 / S3 / Cloudinary / Local)**:
   - Stores binary media assets (compressed photos, raw audio recordings).
5. **AI Services**:
   - **Google Gemini 2.5 Flash**: Visual authenticity checking, multimodal understanding, structured policy advice, municipal brief drafting.
   - **Sarvam AI**: Multilingual speech-to-text for Indic languages.

---

## 3. Environment Variables & Connectivity

| Category | Variable | Required? | Purpose / Description |
|---|---|---|---|
| **APP** | `ENVIRONMENT` | Optional (default: `production`) | Environment mode (`production`, `development`, `staging`). |
| **APP** | `FRONTEND_ORIGIN` | Required | Allowed CORS origins (e.g., `https://nivaran.vercel.app`). |
| **DATABASE** | `DATABASE_URL` | Required in Prod | Neon PostgreSQL connection string (`postgresql://user:pass@ep-xyz.neon.tech/nivaran?sslmode=require`). |
| **AI** | `GEMINI_API_KEY` | Required for Live AI | Primary Google Gemini API key. Supports comma-separated keys for auto-rotation. |
| **AI** | `SARVAM_API_KEY` | Required for Live Voice | Sarvam AI STT API key. |
| **STORAGE** | `STORAGE_PROVIDER` | Optional (default: `local`) | `cloudinary`, `s3`, or `local`. |
| **AUTH** | `JWT_SECRET_KEY` | Required | Cryptographic secret for signing JWT auth tokens. |

---

## 4. Startup Sequence & Health Probes

1. **Startup Check**:
   - `lifespan` hook initializes database tables via `init_db()`.
   - Validates required configuration; logs startup mode (Degraded mode if AI keys are omitted).
2. **Probes**:
   - `GET /health`: Liveness probe (verifies database query execution `SELECT 1`).
   - `GET /ready`: Readiness probe (checks DB connectivity and media upload directory permissions).
   - `GET /version`: Exposes deployed version, commit SHA, and deployment timestamp.
   - `GET /api/diagnostics`: Secure diagnostic summary for administrators.

---

## 5. Deployment Commands & Rollback Strategy

### Backend Deployment (Render / Docker):
```bash
# Build & Start Command
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2
```

### Frontend Deployment (Vercel / Static):
```bash
npm install
npm run build
# Output directory: dist
```

### Rollback Strategy:
- Frontend: Roll back to previous Git deployment artifact in Vercel/Cloudflare in 1 click.
- Backend: Instant image rollback in Render/Docker container registry.
- Database: Neon point-in-time recovery (PITR) or SQL schema downgrade scripts.
