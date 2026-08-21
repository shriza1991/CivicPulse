# Database Runtime Architecture Audit

**Project:** Nivaran — Community Demand Intelligence  
**Date:** 2026-08-21  
**Target:** Neon PostgreSQL (Production) / SQLite (Local Dev & CI)  

---

## 1. Runtime Database Stack

- **ORM / Data Layer**: `SQLModel` / `SQLAlchemy 2.0`
- **Driver**: `psycopg2-binary` (PostgreSQL) and `sqlite3` (development/testing)
- **Engine Setup** (`app/db.py`):
  - Automatically detects PostgreSQL vs SQLite.
  - For PostgreSQL: `pool_size=10`, `max_overflow=20`, `pool_recycle=300`, `pool_pre_ping=True`.
  - For SQLite: `journal_mode=WAL`, `synchronous=NORMAL`, `foreign_keys=ON`.
- **Health Check Probe**: `@app.get("/health")` and `@app.get("/api/health")` executes `session.exec(select(1)).first()` and returns `200 OK` or `503 Service Unavailable`.

---

## 2. Schema Entities

1. `users` & `roles`: RBAC authentication and session control.
2. `issues`: Citizen demand signals with coordinates, severity, category, audio/photo URLs, credibility scores.
3. `clusters`: Spatially clustered demand hotspots with aggregated priority scores, report counts, and AI summaries.
4. `census_demographics`: Census tract demographics (population density, poverty rate, vulnerable ratio, primary language).
5. `infrastructure_assets`: Public facilities (schools, hospitals, transit stops, water mains).
6. `public_investments`: Capital projects and municipal budget allocations.
7. `policy_recommendations`: Gemini-grounded intervention briefs with evidence traceability and funding pathways.
8. `action_drafts`, `impact_summaries`, `escalations`: Operational workflow objects.

---

## 3. Seed Strategy & Idempotency

- `backend/scripts/seed_demo_data.py` provides deterministic, idempotent database seeding.
- Verified: Running the seed twice results in **0 duplicate rows** and preserves existing data.
- Covers India (IND: Mumbai/Bengaluru), Brazil (BRA: São Paulo), and South Africa (ZAF: Soweto).
