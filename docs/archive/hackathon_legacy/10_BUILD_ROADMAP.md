# 10 — Build Roadmap

## Phase 0 — Repository Baseline [P0]
Goal:
Understand and stabilize the existing Nivaran system.

Tasks:
- audit repository structure
- run existing tests/build/typecheck
- identify production/deployment truth
- identify old branding
- identify obsolete complaint-centric components
- identify demo/fake fallback behavior
- identify map/role/API regressions
- create CODEBASE_AUDIT.md

Exit:
Baseline test/build status recorded. No code behavior changed without evidence.

## Phase 1 — Product Contract [P0]
Tasks:
- establish product terminology
- new navigation/role concept
- document authoritative routes/screens
- define domain vocabulary.

Exit:
Product contract complete.

## Phase 2 — Domain/Data Foundation [P0]
Tasks:
- introduce country/region/locality abstractions
- introduce DemandRequest
- introduce DemandCluster
- introduce Population/Infrastructure/Investment metrics
- introduce PriorityAssessment/Recommendation
- add provenance fields.

Exit:
Database/API contract tests pass.

## Phase 3 — Demand Intake [P0]
Tasks:
- text
- voice path
- language handling
- optional evidence
- location
- structured output.

Exit:
One canonical input becomes a valid DemandRequest.

## Phase 4 — Community Correlation [P0]
Tasks:
- reuse evidence trust
- deduplication
- semantic similarity
- spatial clustering
- DemandCluster API
- hotspot derivation.

Exit:
Seeded multi-request dataset produces expected clusters.

## Phase 5 — Data Fusion [P0]
Tasks:
- demographic adapter
- infrastructure adapter
- investment adapter
- geographic normalization
- provenance
- missing-data handling.

Exit:
DemandCluster can be enriched reproducibly.

## Phase 6 — Priority Engine [P0]
Tasks:
- define factor schema
- deterministic weights
- score calculation
- explanation/breakdown
- ranking
- tests/fixtures.

Exit:
same data → same score.

## Phase 7 — Policy Advisor [P0]
Tasks:
- structured Gemini request
- recommendation schema
- grounded rationale
- uncertainty
- policy brief
- deterministic fact validation.

Exit:
Every displayed recommendation is grounded in stored facts.

## Phase 8 — Policymaker UX [P0]
Tasks:
- demand map
- priority list
- cluster detail
- why-this-score
- investment context
- policy brief
- role-specific navigation.

Exit:
A planner can complete the full decision flow without developer tools.

## Phase 9 — Cross-Border Demo [P1]
Tasks:
- India
- Brazil
- South Africa
- country configs
- localized demo data
- same pipeline verification.

Exit:
country switching works end-to-end.

## Phase 10 — Quality / Security / Reliability [P0]
Tasks:
- functional tests
- API tests
- AI contract tests
- regression tests
- auth/roles
- upload safety
- performance smoke tests
- deployment health.

Exit:
release checklist passes.

## Phase 11 — Demo / Submission [P0]
Tasks:
- canonical seeded scenario
- 3–5 minute demo
- README
- architecture diagram
- pitch deck inputs
- screenshots
- deployed URL
- final verification.

## Scope Gate
Do not start P1/P2 work if any P0 acceptance gate is failing.
