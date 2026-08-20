# DECISION LOG — Architectural & Product Governance

Durable record of architectural, product, and scope decisions. New decisions MUST append new IDs (`D-011`, `D-012`, ...). Historical decisions MUST NOT be silently deleted or replaced.

---

| Decision ID | Topic | Decision | Rationale |
|---|---|---|---|
| **D-001** | Product Identity | Product is named **Nivaran — Community Demand Intelligence**. | Aligns directly with Code for Communities Track 1 focus on Digital Public Infrastructure & Governance. |
| **D-002** | Hero Object | Hero object is **Demand Cluster / Demand Hotspot**. | Aggregates individual citizen signals into actionable spatial-demographic hotspots for planners. |
| **D-003** | Primary User | Primary user is **Government Planner / Policymaker**. | Solves public infrastructure planning misalignment rather than generic ticket management. |
| **D-004** | AI vs Deterministic | Google Gemini LLM for language understanding, multimodal intake, and policy reasoning; deterministic code for math, aggregates, spatial queries, and priority scores. | Guarantees auditability, prevents hallucinated metrics, and complies with judging criteria. |
| **D-005** | Human Authority | Policy recommendations remain human-reviewed and approved. | Ensures responsible AI in public governance; prevents automated policy execution. |
| **D-006** | Cross-Border Demo | Multi-country adapters for **India, Brazil, and South Africa**. | Demonstrates BRICS cross-border applicability with diverse languages, currencies, and census datasets. |
| **D-007** | Codebase Reuse | Reuse existing evidence validation, image hashing, maps, and JWT auth infrastructure. | Accelerates delivery while preserving clean engineering foundations. |
| **D-008** | Data Honesty | No fabricated metrics; demo data strictly tagged as sample fixtures (`is_demo: True`). | Prevents misleading judges and preserves data trust. |
| **D-009** | Mandatory Tech | **Google AI (Gemini 2.5)** is mandatory for core AI operations. | Strictly complies with hackathon rules. |
| **D-010** | Architecture Scoping | Country-specific logic belongs in adapter configurations, not shared core business logic. | Ensures clean modularity and multi-country scalability. |
| **D-011** | Phase Sequencing | Fixed 12-phase lifecycle (Phase 0 Audit to Phase 11 Demo Submission); database foundation is **Phase 2**. | Corrects phase naming inconsistency from initial audit report. |
| **D-012** | Voice Reliability & Demand Intake Architecture | Upgraded HTTP timeout to 45s, added first-class audio recording/preview with Sarvam STT and Gemini structured demand extraction, preserved original voice artifacts, and updated UI to 6-stage Demand Intelligence pipeline. | Eliminates 15s false timeouts, establishes multi-lingual voice intake with provenance, and reconciles legacy complaint ontology with Track 1 contract. |
| **D-013** | Demographic, Infrastructure & Investment Data Fusion (Phase 5) | Created `data_fusion_service.py` and sample cross-border fixtures (`demographics_data.json`, `infrastructure_assets.json`, `public_investments.json`) to enrich Demand Hotspots with ward density, vulnerability ratios, asset conditions, and ongoing municipal capital allocations. | Grounds prioritization in real community and infrastructure context rather than raw complaint counts. |
| **D-014** | Deterministic Priority Factor Engine (Phase 6) | Implemented `compute_cluster_priority_breakdown` exposing exact numerical breakdown across Density (35%), Vulnerability (25%), Infrastructure Deficit (20%), Severity (10%), and Evidence Trust (10%). Added `POST /clusters/{id}/recalculate-priority`. | Provides fully explainable, transparent prioritization for government planning. |
| **D-015** | Grounded Gemini Policy Advisor Briefs (Phase 7) | Created `policy_advisor_service.py` and `policy_router.py` producing structured policy dossiers matching local currency and ward context, with explicit uncertainties and human-in-the-loop review actions (`POST /policy/recommendations/{id}/review`). | Translates complex hotspot data into actionable decision-support for policymakers with governance safeguards. |
| **D-016** | Hotspots-Centric Policymaker Workspace (Phase 8) | Created `DemandHotspotWorkspace.tsx` and mounted it as the primary view in `GovernmentQueuePage.tsx`, enabling dynamic switching across India, Brazil, and South Africa hotspots with instant policy brief review. | Elevates the hero object to Demand Hotspots while retaining operational case queues as a secondary tab. |
| **D-017** | End-to-End Cross-Border Quality Verification (Phases 9 & 10) | Verified multi-country execution and created full system integration test `test_e2e_demand_intelligence.py` covering citizen intake through policy approval. | Guarantees complete Track 1 compliance and submission readiness. |
