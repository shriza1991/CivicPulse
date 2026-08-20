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
