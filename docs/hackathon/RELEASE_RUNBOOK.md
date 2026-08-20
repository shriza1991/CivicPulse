# RELEASE & OPERATIONS RUNBOOK
**Nivaran — Community Demand Intelligence**
Track 1: AI for Digital Public Infrastructure & Governance
Date: 2026-08-21

---

## 1. Prerequisites & Environment Setup

### Required API Keys & Services:
1. **Google Gemini API Key**: [Google AI Studio](https://aistudio.google.com/) (Gemini 2.5 Flash).
2. **Sarvam AI API Key**: [Sarvam AI Platform](https://www.sarvam.ai/) (Indic Speech-to-Text).
3. **Neon PostgreSQL Database URL**: [Neon Tech](https://neon.tech/) (Serverless Postgres).
4. **Cloudinary or Cloudflare R2 Credentials** (Optional for local dev, recommended for production).

---

## 2. Step-by-Step Deployment Guide

### A. Backend Deployment (Render / Railway / Docker)
1. Set Environment Variables:
   ```bash
   DATABASE_URL=postgresql://neondb_owner:password@ep-xyz.neon.tech/neondb?sslmode=require
   GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
   SARVAM_API_KEY=your_sarvam_api_key_here
   FRONTEND_ORIGIN=https://nivaran.vercel.app,http://localhost:5173
   ENVIRONMENT=production
   JWT_SECRET_KEY=generate_a_random_32_char_string
   ```
2. Build & Launch:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### B. Frontend Deployment (Vercel)
1. Configure Environment in Vercel:
   ```bash
   VITE_API_BASE_URL=https://nivaran-backend.onrender.com
   ```
2. Build Settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## 3. Post-Deployment Verification & Smoke Test Checklist

- [ ] **Liveness Probe**: `curl -I https://nivaran-backend.onrender.com/health` (Expect `200 OK`, `{"status":"ok","database":"connected"}`).
- [ ] **Readiness Probe**: `curl -I https://nivaran-backend.onrender.com/ready` (Expect `200 OK`, `{"status":"ready"}`).
- [ ] **Version Probe**: `curl https://nivaran-backend.onrender.com/version` (Expect valid commit SHA and version).
- [ ] **Diagnostics**: `curl https://nivaran-backend.onrender.com/api/diagnostics` (Verify AI provider connectivity).
- [ ] **Intake Smoke Test**: Navigate to `/intake`, upload a test photo or record voice note, verify stage progression and creation.
- [ ] **Hotspot Workspace Smoke Test**: Navigate to `/government/queue`, inspect India/Brazil/South Africa clusters, verify priority breakdown and AI Policy Brief generation.

---

## 4. Troubleshooting & Operational Diagnostics

| Symptom | Probable Cause | Resolution Action |
|---|---|---|
| `/health` returns `503` or `database disconnected` | Neon Postgres scaled to zero or bad credentials. | Check `DATABASE_URL` format (`?sslmode=require`), verify Neon project is active. |
| AI analysis returns fallback message | Gemini API key quota exhausted or network block. | Add backup Gemini API keys separated by commas in `GEMINI_API_KEY`. |
| Voice transcription fails | Missing `SARVAM_API_KEY`. | Confirm Sarvam key validity in `/api/diagnostics`. Audio remains safe. |
| Map tiles not displaying | External tile network throttling. | Map automatically falls back to card/table view; check browser network tab. |

---
