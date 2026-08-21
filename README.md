# CommonGround — Community Demand Intelligence

> **Built for India. Designed to adapt beyond India.**

CommonGround is an AI-powered Community Demand Intelligence Digital Public Good built for **Build with AI: Code for Communities (Second Edition) — Track 1: AI for Digital Public Infrastructure & Governance**.

It transforms fragmented citizen voice, photo, and text reports into verified **Demand Hotspots**, combining citizen demand with Indian census demographics and infrastructure indices to recommend high-priority public development projects for policymakers.

---

## Key Capabilities

- 🎙️ **Multilingual Citizen Voice Ingestion**: Speak community infrastructure needs in Hindi, Marathi, English, or regional Indian languages via Sarvam AI Speech-to-Text.
- 📸 **Visual Verification & Demand Extraction**: Google Gemini 2.5 performs multimodal verification of photographic evidence and extracts structured demand parameters.
- 📍 **Spatial & Semantic Clustering**: Automatically aggregates related citizen reports into localized demand hotspots (150m–500m radii).
- 📊 **Indian Data Fusion & Prioritization**: Enriches hotspots with Census of India demographic metrics (population density, poverty rates, vulnerability indices) and public asset condition ratings.
- ⚖️ **Deterministic 0–100 Priority Engine**: Mathematical, transparent scoring formula that eliminates LLM numerical hallucinations.
- 🏛️ **Gemini Policy Reasoning**: Synthesizes actionable policy briefs, identifies public funding pathways, and flags operational execution risks for planners.
- 🌐 **Cross-Border Modular Architecture**: Engineered with decoupled country and language adapters (`country_adapters.py`) demonstrating future portability across BRICS contexts.

---

## The Core Intelligence Loop

```
Citizen Voice / Text / Photo / WhatsApp
                  ↓
       Demand Understanding (Sarvam + Gemini)
                  ↓
       Evidence Trust Verification Gate
                  ↓
       Semantic & Spatial Clustering
                  ↓
       Demand Hotspot (Hero Object)
                  ↓
       Indian Data Fusion (Census + Asset Deficit + Budgets)
                  ↓
       Deterministic Priority Score (0–100)
                  ↓
       Google Gemini Policy Reasoning (Structured Briefs)
                  ↓
       Human Review (Policymakers & Planners)
                  ↓
       High-Priority Public Infrastructure Action
```

---

## AI & Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Voice STT** | Sarvam AI | Indian regional language speech-to-text |
| **Multimodal AI & Reasoning** | Google Gemini 2.5 Flash | Multimodal verification, structured demand extraction, policy reasoning |
| **Data & Priority Engine** | Python / SQLModel / PostGIS | Spatial clustering, demographic data fusion, deterministic scoring |
| **Backend API** | FastAPI / Uvicorn | High-performance asynchronous REST API |
| **Frontend SPA** | React 19 / TypeScript / Vite / TailwindCSS | Responsive policymaker console & citizen intake |
| **Mapping & Geospatial** | MapLibre GL | Vector tiles & demand cluster visualization |
| **Database** | Neon PostgreSQL / SQLite | Serverless PostgreSQL in production, SQLite in dev/CI |

---

## Quick Start (Local Development)

### 1. Prerequisites
- Python 3.11+
- Node.js 20+

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows: .venv\Scripts\activate | On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt

# Run idempotent demo seeder
python scripts/seed_demo_data.py

# Start development server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm ci
npm run dev
```

### 4. Run Test Suite
```bash
# Backend pytest suite (108 tests)
cd backend && python -m pytest

# Frontend verification (Lint + Typecheck + Smoke Tests + Build)
cd frontend && npm run verify
```

---

## Production Deployment Overview

- **Backend**: Deployed to **Render** via `render.yaml` (Docker container binding to `0.0.0.0:${PORT}`).
- **Frontend**: Deployed to **Vercel** with SPA rewrites (`frontend/vercel.json`).
- **Database**: **Neon Serverless PostgreSQL** with SSL pooling.
- Detailed step-by-step instructions are available in [`docs/hackathon/DEPLOYMENT_GUIDE.md`](docs/hackathon/DEPLOYMENT_GUIDE.md).

---

## Canonical Documentation

1. [`docs/hackathon/HACKATHON_CONTRACT.md`](docs/hackathon/HACKATHON_CONTRACT.md) — Official challenge requirements & judging criteria.
2. [`docs/hackathon/PRODUCT_CONTRACT.md`](docs/hackathon/PRODUCT_CONTRACT.md) — Canonical product thesis & AI responsibilities.
3. [`docs/hackathon/JUDGING_CONTRACT.md`](docs/hackathon/JUDGING_CONTRACT.md) — Judging rubric & scoring evidence alignment.
4. [`docs/hackathon/DEVELOPMENT_GUIDE.md`](docs/hackathon/DEVELOPMENT_GUIDE.md) — Architecture & engineering standards.
5. [`docs/hackathon/DEPLOYMENT_GUIDE.md`](docs/hackathon/DEPLOYMENT_GUIDE.md) — Production cloud operations.
6. [`docs/research/RESEARCH_SUMMARY.md`](docs/research/RESEARCH_SUMMARY.md) — Research synthesis & governance foundations.

---

## License

Built for Build with AI: Code for Communities 2026 under the MIT License.
