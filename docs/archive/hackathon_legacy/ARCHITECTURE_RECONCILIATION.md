# ARCHITECTURE RECONCILIATION — Nivaran Baseline

## Contradictions & Architecture Alignment

| Subsystem | Legacy / Current Implementation | Target Architecture (Specs) | Migration Required? | Details / Decision |
|---|---|---|---|---|
| **Database** | PostgreSQL (Neon / SQLAlchemy) | PostgreSQL (PostGIS / Neon) | **YES** | Current DB lacks PostGIS spatial indexing and schema for Demand Clusters & Census datasets. |
| **Primary Object** | `Issue` (Individual complaint) | `DemandCluster` / `DemandHotspot` | **YES** | Shift focus from single complaints to aggregated spatial-semantic clusters with priority scoring. |
| **AI Integration** | Gemini Vision API (`GeminiKeyPool`) | Google Gemini 2.5 Flash / Pro (Structured Outputs) | **YES** | Upgrade Gemini models, add multimodal demand intake reasoning, cross-border translation, policy synthesis. |
| **Maps** | Leaflet / OpenStreetMap | Leaflet / Mapbox with spatial cluster heatmaps | **MODIFY** | Reuse existing Leaflet integration; extend with cluster polygon boundaries & census demographic overlays. |
| **Intake Channels** | Web UI + WhatsApp Webhook | Web UI + WhatsApp + Multimodal Voice/Photo | **MODIFY** | Preserve WhatsApp webhook & web intake; enhance trust validation gate. |
| **Deployment** | Render single Docker container (`render.yaml`) | Docker / Cloud Run / Vercel | **KEEP / MODIFY** | Retain Docker container setup for backend; ensure environment portability. |
| **Authentication & Roles** | Simple JWT (Citizen, Officer, Admin) | JWT with Policymaker/Planner & Citizen roles | **MODIFY** | Update role permissions to focus on policymaker workspace & demand intelligence. |
