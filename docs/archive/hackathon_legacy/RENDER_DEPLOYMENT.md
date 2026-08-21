# Render Free Tier Backend Deployment Guide

**Project:** Nivaran — Community Demand Intelligence  
**Component:** Backend API & Processing Pipeline  

---

## 1. Prerequisites
- Free Render Account ([render.com](https://render.com))
- Free Neon PostgreSQL Database instance ([neon.tech](https://neon.tech))
- Google AI Studio API Key (`GEMINI_API_KEY`)
- Sarvam AI API Key (`SARVAM_API_KEY`)

---

## 2. Deployment via Blueprint (`render.yaml`)

1. Connect your GitHub repository to Render.
2. In the Render Dashboard, click **New +** -> **Blueprint**.
3. Select this repository. Render will automatically parse `render.yaml`.
4. Supply the required environment variables when prompted:
   - `DATABASE_URL`: Your Neon connection string (`postgresql://user:pass@ep-xyz.neon.tech/nivaran?sslmode=require`)
   - `GEMINI_API_KEY`: Your Gemini API key
   - `SARVAM_API_KEY`: Your Sarvam AI API key
   - `JWT_SECRET_KEY`: A secure random secret string
   - `FRONTEND_ORIGIN`: Your deployed Vercel domain (e.g. `https://nivaran-app.vercel.app,http://localhost:5173`)
5. Click **Apply**. Render will build the Docker container and start the service.

---

## 3. Database Initialization & Seeding
Once the backend service is deployed:
1. Open the Render Dashboard -> **nivaran-backend** -> **Shell**.
2. Run:
   ```bash
   python scripts/seed_demo_data.py
   ```
3. Verify output confirms `Demo data seed completed successfully (Idempotent: 0 duplicates created)`.
4. Test health check in your browser or curl:
   ```bash
   curl https://<your-render-url>/health
   # Response: {"status":"ok","database":"connected"}
   ```
