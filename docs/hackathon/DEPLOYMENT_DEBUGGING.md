# Deployment Debugging & Troubleshooting Guide

**Project:** Nivaran — Community Demand Intelligence  
**Date:** 2026-08-21  

---

## 1. Quick Triage Reference

| Symptom / Failure | Where to Look | Key Log Pattern | Likely Cause | Resolution |
|---|---|---|---|---|
| **Render Health Check Fails (503)** | Render Logs -> Web Service | `health_check_failed \| error=...` | Neon PostgreSQL connection string invalid or DB unreachable | Check `DATABASE_URL` format; ensure `?sslmode=require` is appended for Neon. |
| **CORS Blocked on Vercel Frontend** | Browser DevTools Console / Network | `Access-Control-Allow-Origin missing` | `FRONTEND_ORIGIN` on backend does not include the Vercel domain | Add Vercel URL (e.g. `https://nivaran-*.vercel.app`) to `FRONTEND_ORIGIN` in Render dashboard. |
| **Voice Processing Fails (503 / 502)** | Backend Logs -> `/api/voice/analyze` | `sarvam_api_error` or `gemini_timeout` | Missing `SARVAM_API_KEY` or invalid key | Ensure `SARVAM_API_KEY` and `GEMINI_API_KEY` are configured in environment variables. |
| **Image Analysis Timeout (45s+)** | Frontend Toast / Network Tab | `timeout of 45000ms exceeded` | Cold start on Gemini multimodal model | Retry submission; backend uses automatic retry with fallback models. |
| **Demo Data Missing on Clean Deploy** | Backend Console | `issues_count: 0` | Neon DB initialized empty without seed run | Run `python scripts/seed_demo_data.py` via Render Shell or SSH console. |

---

## 2. Structured Logging Format

Nivaran uses structured log lines with sanitized payloads:
```
[TIMESTAMP] | [LEVEL] | [ACTION] | key1=val1 | key2=val2
```
Example:
```
2026-08-21 23:12:14,024 | INFO | seed_completed | clusters=2 | issues=2 | country=BRA,ZAF
```
*Note: API keys, database passwords, JWT tokens, and raw citizen personal identifiers are never printed to log streams.*
