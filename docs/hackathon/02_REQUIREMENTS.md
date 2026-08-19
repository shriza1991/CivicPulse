# 02 — Product Requirements

## P0 Functional Requirements

### Demand Intake
- REQ-001: Accept text demand.
- REQ-002: Accept voice input through a supported ingestion path.
- REQ-003: Detect/record input language.
- REQ-004: Normalize input into a structured DemandRequest.
- REQ-005: Capture location or resolve location from available input.
- REQ-006: Support optional image/evidence upload.

### Evidence Trust
- REQ-010: Reject or quarantine obviously invalid evidence.
- REQ-011: Preserve evidence provenance.
- REQ-012: Do not invent evidence when evidence is missing.
- REQ-013: Provide honest pending/uncertain states.

### Community Intelligence
- REQ-020: Deduplicate clearly identical/near-identical submissions.
- REQ-021: Perform semantic similarity/correlation.
- REQ-022: Perform spatial clustering.
- REQ-023: Produce a DemandCluster with explainable membership metrics.
- REQ-024: Support multiple geographic scales where useful.

### Data Fusion
- REQ-030: Attach demographic/population context.
- REQ-031: Attach infrastructure/service-level context.
- REQ-032: Attach investment/project context.
- REQ-033: Record source/provenance and timestamp for external metrics.
- REQ-034: Explicitly represent missing or stale data.

### Priority Engine
- REQ-040: Compute a deterministic 0–100 priority score.
- REQ-041: Expose score-factor breakdown.
- REQ-042: Make weights/configuration explicit.
- REQ-043: Ensure ranking is reproducible for the same data.
- REQ-044: Never allow Gemini to silently overwrite deterministic score values.

### Policy Advisor
- REQ-050: Gemini receives structured evidence, not raw uncontrolled context only.
- REQ-051: Generate a recommendation grounded only in provided evidence.
- REQ-052: Cite source facts/metrics used.
- REQ-053: Identify uncertainty/assumptions.
- REQ-054: Generate a concise policy brief.
- REQ-055: Support human edit/approval.

### Policymaker UX
- REQ-060: Show demand hotspots on a map.
- REQ-061: Filter by country/region/sector/time where supported.
- REQ-062: Show ranked priorities.
- REQ-063: Show “Why this priority?” evidence.
- REQ-064: Show investment context.
- REQ-065: Allow opening/generating a policy brief.
- REQ-066: Show honest empty/loading/error states.

### Cross-Border
- REQ-070: Country is configuration, not hardcoded business logic.
- REQ-071: Administrative hierarchy is adaptable.
- REQ-072: Language is configurable.
- REQ-073: Data adapters are country-aware but share common contracts.
- REQ-074: Demonstrate India + Brazil + South Africa.

### Platform
- REQ-080: Public demo deployment.
- REQ-081: Seeded deterministic demo data.
- REQ-082: No secrets in repository.
- REQ-083: Health/diagnostic endpoint for deployment verification.

## P1 Requirements
- WhatsApp demand intake.
- Better multilingual UX.
- Additional infrastructure categories.
- Investment contradiction detection.
- Near-real-time hotspot refresh.
- More granular provenance UI.

## P2 Candidates
- demand forecasting
- climate scenario analysis
- advanced optimization
- broader BRICS coverage
- government API integrations

P1/P2 must not delay a complete P0 loop.
