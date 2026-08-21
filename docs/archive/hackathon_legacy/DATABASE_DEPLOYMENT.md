# DATABASE DEPLOYMENT & MIGRATION GUIDE
**Nivaran — Community Demand Intelligence**
Track 1: AI for Digital Public Infrastructure & Governance
Date: 2026-08-21

---

## 1. Production Database Topology: Neon Serverless PostgreSQL

Nivaran uses **Neon Serverless PostgreSQL** for production deployments and an in-process SQLite WAL database for rapid, isolated CI/CD testing.

### Key Configurations:
- **Connection String Format**: `postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require`
- **Connection Pool Configuration** (`app/db.py`):
  - `pool_pre_ping=True` (proactively discards stale connections after serverless scale-to-zero wakeups)
  - `pool_size=10`
  - `max_overflow=20`
  - `pool_recycle=300` (recycles connections every 5 minutes to prevent dropped sockets)

---

## 2. Table Schemas & Relationships

```text
┌────────────────────────────────────────────────────────┐
│                        ISSUES                          │
│  id (UUID PK), created_at, photo_url, audio_url,       │
│  latitude, longitude, country_code, ward_id,          │
│  issue_type, severity, description, credibility_score, │
│  cluster_id (FK -> CLUSTERS.id), status                │
└──────────────────────────┬─────────────────────────────┘
                           │ N:1
                           ▼
┌────────────────────────────────────────────────────────┐
│                       CLUSTERS                         │
│  id (VARCHAR PK), created_at, country_code, ward_id,   │
│  category, report_count, priority_score, status,       │
│  centroid_lat, centroid_lng, fused_summary_json        │
└────────┬─────────────────┬───────────────────┬─────────┘
         │ 1:1             │ 1:1               │ 1:N
         ▼                 ▼                   ▼
┌──────────────────┐ ┌─────────────┐ ┌───────────────────┐
│ FUSED SUMMARY    │ │ PRIORITY    │ │ POLICY            │
│ density, poverty,│ │ BREAKDOWN   │ │ RECOMMENDATIONS   │
│ vulnerable ratio,│ │ explainable │ │ Gemini policy     │
│ infrastructure   │ │ score math  │ │ briefs & approvals│
└──────────────────┘ └─────────────┘ └───────────────────┘
```

---

## 3. Migration & Initialization Procedure

### Initializing Tables:
```python
from app.db import init_db
init_db()
```
SQLModel auto-creates all required tables and indexes on application boot if they do not already exist.

### Seeding Baseline Scenarios:
To seed standard cross-border demonstration fixtures for India, Brazil, and South Africa without fabricating data:
```bash
python -m app.db_seed
```

---

## 4. Disaster Recovery & Backup Plan
1. **Automated Continuous Neon Backups**: Neon maintains automated point-in-time recovery (PITR) for up to 30 days.
2. **Branching**: Zero-copy database branching in Neon allows instant staging sandbox creation before schema migrations.
3. **Database Health Probe**: `GET /health` runs `SELECT 1` on the active connection pool. If disconnected, returns `503 Service Unavailable`.
