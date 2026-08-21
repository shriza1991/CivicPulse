# Vercel Free Tier Frontend Deployment Guide

**Project:** Nivaran — Community Demand Intelligence  
**Component:** React 19 + Vite Frontend SPA  

---

## 1. Prerequisites
- Free Vercel Account ([vercel.com](https://vercel.com))
- Deployed Render backend URL (e.g. `https://nivaran-backend.onrender.com`)

---

## 2. Project Import & Settings

1. In Vercel Dashboard, click **Add New...** -> **Project**.
2. Select the GitHub repository.
3. Configure the Project Settings:
   - **Root Directory**: `frontend` (Click Edit and select `frontend`)
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build` (`tsc -b && vite build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
4. Add Environment Variables:
   - `VITE_API_BASE_URL`: `https://<your-render-backend-url>/api`
   - `VITE_ENABLE_EVALUATION`: `false`
5. Click **Deploy**.

---

## 3. Verification Checklist

1. **SPA Client Routing**: Navigate directly to `/discover`, `/community`, `/government/queue`, `/report`. Verify `vercel.json` rewrite returns `index.html` without 404s.
2. **Microphone Permissions**: Test `/report` -> **Speak Demand** voice recording modal. Ensure HTTPS allows audio stream capture.
3. **MapLibre Tiles**: Open `/discover` or `/issue/:id` and verify cluster markers render smoothly.
4. **API Integration**: Verify intake submissions and policy workspace load from the Render backend.
