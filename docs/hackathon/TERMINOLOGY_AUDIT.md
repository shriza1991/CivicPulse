# TERMINOLOGY AUDIT — Obsolete vs Canonical Terms

## Canonical Product Identity
- **Product Name**: Nivaran — Community Demand Intelligence
- **Hero Object**: Demand Cluster / Demand Hotspot (NOT individual complaints)
- **Primary Persona**: Policymakers & Infrastructure Planners (NOT grievance ticketing handlers)
- **Core Paradigm**: Citizen voice → Trusted demand → Community intelligence → Infrastructure/data fusion → Priority → Policy action

---

## Obsolete & Contradictory Terminology Found in Codebase

| Term / Phrase | Locations Found | Context / Status | Required Action |
|---|---|---|---|
| `CivicPulse` / `civicpulse` | `package.json`, `frontend/index.html`, `backend/app/main.py`, `backend/app/routers/whatsapp.py`, `backend/app/templates/*`, `docs/*`, `README.md` | Legacy product name used across APIs, page titles, logger names, and headers | **RENAME** in future tasks (API titles, headers, page titles to "Nivaran") |
| `civic complaint platform` / `grievance platform` | `README.md`, `frontend/index.html`, `ProjectDescription.md` | Legacy framing focusing on individual complaints | **REPLACE** in UI/Docs with "Community Demand Intelligence Platform" |
| `RTI` / `RTI generator` / `legal dispatches` | `backend/app/templates/rti.py`, `backend/app/routers/admin.py`, `ProjectDescription.md`, `README.md` | Escalation mechanism generating RTI legal letters | **REPOSITION / TRANSFORM** into Policy Action Briefs & Demand Dossiers for planners |
| `complaint` / `complaints` | Backend models, schemas, frontend components (`IntakePage.tsx`, `complaint.py`) | Individual report framing | **TRANSFORM**: Reposition citizen submission as "Demand Signal" / "Demand Intake" |
| `officer` / `admin_officer` | `backend/app/routers/admin.py`, `backend/app/models/user.py` | Legacy ticketing admin role | **TRANSFORM**: Transition primary persona to Planner / Policymaker |
