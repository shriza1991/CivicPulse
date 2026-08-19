# 00 — Master Context

## Hackathon
**Build with AI: Code for Communities — Second Edition**
Target: **Track 1 — AI for Digital Public Infrastructure & Governance**

Published requirements include:
- functioning end-to-end core flow
- mandatory Google AI integration
- real or realistic data
- cross-border applicability
- multilingual or voice support where the track calls for it
- deployed link and complete submission package

Published judging:
- Problem-Solution Fit: 20%
- AI/Technical Execution: 25%
- Cross-Border Applicability: 20%
- Impact Potential: 10%
- Deployability & Scalability: 20%
- Presentation & Clarity: 5%

## Product
**Name:** Nivaran
**Positioning:** Community Demand Intelligence
**One-liner:** Nivaran turns multilingual citizen voices into evidence-backed infrastructure priorities for policymakers.

## Problem
Government demand signals and public investment context are fragmented. Citizen requests are noisy, multilingual, geographically scattered, and disconnected from demographic, infrastructure, and investment information.

## Product Thesis
Nivaran is the missing intelligence layer between **community demand** and **infrastructure planning**.

It should answer:
- Where is unmet demand highest?
- What infrastructure need is emerging?
- Who is affected?
- What is already being funded?
- Where is investment missing or potentially overlapping?
- Why is this demand a priority?
- What evidence supports the recommendation?

## Primary User
Government planner / policymaker / planning administrator.

## Secondary Users
District/municipal officials, infrastructure agencies, auditors/evaluators.

## Citizen Role
Citizen is the demand-source and beneficiary, not the primary policy-dashboard user.

## Hero Object
**Demand Cluster / Demand Hotspot**

Not:
- complaint ticket
- grievance
- generic dashboard metric.

## Target MVP
1. Citizen submits text/voice (+ optional evidence/location).
2. System produces structured demand.
3. Evidence is validated.
4. Related demands are deduplicated and clustered.
5. Cluster is enriched with population + infrastructure + investment context.
6. Deterministic priority score is computed.
7. Gemini generates an evidence-grounded policy recommendation.
8. Policymaker inspects the evidence and recommendation.
9. Human approval/edit step is available.
10. Same architecture works across multiple country configurations.

## Initial Demo Countries
India, Brazil, South Africa.

These are representative demonstration contexts, not a claim of complete localization.

## Existing Nivaran Strengths To Reuse
- evidence trust gate
- multimodal evidence analysis
- issue classification
- semantic/spatial clustering
- impact analysis
- government-action/document generation
- human approval
- auditability
- role-aware application
- maps
- messaging-channel architecture
- Google AI integration

## Main New Capabilities
- demand-oriented ontology
- multilingual/voice intake
- demographic/infrastructure/investment data fusion
- deterministic priority model
- Policy Advisor reasoning layer
- demand-hotspot UI
- policymaker priority workflow
- cross-border configuration

## Architecture Principle
AI explains and reasons over structured evidence.
Deterministic services calculate.
Data adapters ingest.
Humans decide.

## Important
The old Nivaran repository contains historical deployment/UI/role artifacts. Do not assume old documentation is current. The implementation specification in `docs/hackathon/` is authoritative for the new product.
