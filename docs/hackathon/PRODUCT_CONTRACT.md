# PRODUCT CONTRACT — Permanent Product Definition

## Canonical Identity
- **Product Name**: Nivaran — Community Demand Intelligence
- **Product Thesis**: Nivaran is the intelligence layer between fragmented community demand signals and national infrastructure planning.

---

## User Personas & Roles

### Primary User
- **Government Planner / Policymaker**: Uses consolidated community demand hotspots and data fusion to prioritize infrastructure investments and draft policy recommendations.

### Secondary Users
- **District / Municipal Planners**: Inspect local ward-level demand clusters and evidence ledgers.
- **Infrastructure Officials & Evaluators**: Review evidence trust scores, verify citizen inputs, and audit public spending impact.

### Citizen Role
- **Demand Provider & Beneficiary**: Provides structured voice, text, or photo demand signals via web, WhatsApp, or mobile web channels.

---

## Architecture Foundations

### Hero Object
- **Demand Cluster / Demand Hotspot**: Aggregated spatial-semantic cluster of verified citizen demand signals enriched with census demographics and infrastructure indices.

### Core Decision Question
> *“What infrastructure need should policymakers prioritize, where, and why?”*

### Core Output
- **Evidence-Backed Infrastructure Priority & Policy Recommendation Brief**: Grounded in deterministic metrics and summarized via Google Gemini reasoning.

---

## Core Product Loop
```
Citizen Voice / Text / Photo Demand
   │
   ▼
Structured Demand & Evidence Trust Gate (EXIF, Hash, Verification)
   │
   ▼
Semantic & Spatial Correlation (PostGIS / Vector Matching)
   │
   ▼
Demand Cluster / Hotspot Generation
   │
   ▼
Demographic, Infrastructure & Investment Data Fusion
   │
   ▼
Deterministic Priority & Impact Scoring
   │
   ▼
Google Gemini Policy Reasoning & Recommendation Generation
   │
   ▼
Human-Reviewed Policymaker Action Brief
```

---

## Boundary Definitions (What Nivaran IS NOT)
- **NOT** a generic AI chatbot or conversational interface.
- **NOT** a individual complaint/grievance ticketing system.
- **NOT** an automated complaint tracker or municipal helpdesk.
- **NOT** a static analytics dashboard without actionable policy synthesis.
- **NOT** an autonomous policy execution engine (human approval is strictly mandatory).
