# 04 — AI Architecture

## Architecture

```text
Input
→ Normalization
→ Evidence Trust
→ Demand Understanding
→ Community Correlation
→ Data Fusion
→ Deterministic Priority
→ Policy Advisor
→ Human Decision
```

## AI-1 Demand Understanding Agent

Purpose:
Convert multilingual text/voice into structured demand.

Input:
- transcript or user text
- optional evidence metadata
- location

Google AI:
Gemini.

Output:
```json
{
  "need_summary": "...",
  "category": "transport|water|sanitation|health|education|energy|other",
  "subtype": "...",
  "language": "...",
  "location_reference": "...",
  "urgency_signal": "...",
  "evidence_relevance": "supported|unsupported|uncertain"
}
```

Guardrails:
- schema validation
- no invented location
- no invented numeric facts
- confidence/uncertainty retained
- fallback to human-readable unresolved state

## AI-2 Evidence Understanding

Existing Nivaran evidence trust gate is reused.

Use deterministic image-quality checks before Gemini vision.
Call Gemini only when ambiguity requires model interpretation.

## AI-3 Community Correlation

Use:
- deterministic geospatial distance
- spatial clustering
- semantic similarity/embeddings where useful

Do not ask Gemini to calculate cluster membership.

Output:
DemandCluster + membership/provenance.

## Data Fusion Layer

Not an AI layer.

It joins:
- population/demographics
- infrastructure metrics
- investment/project data
- demand clusters.

All external values must retain:
- source
- retrieval date
- geographic scope
- unit
- freshness status.

## Priority Engine

Purely deterministic for MVP.

Example conceptual dimensions:
- demand intensity
- population impact
- infrastructure gap
- investment gap/coverage
- severity/exposure

Output:
```json
{
  "score": 0,
  "factors": {
    "demand": 0,
    "population": 0,
    "infrastructure_gap": 0,
    "investment_gap": 0,
    "exposure": 0
  },
  "version": "..."
}
```

Do not allow model output to modify these values.

## AI-4 Policy Advisor

Purpose:
Explain an already-computed priority and draft an actionable policy recommendation.

Input:
- cluster facts
- score breakdown
- source metadata
- country/region context
- infrastructure context
- investment context.

Output:
- recommendation title
- recommended intervention
- rationale
- supporting evidence
- affected population statement
- uncertainties
- implementation considerations.

Guardrail:
Every numerical claim in generated text must be traceable to an input fact.

## Human Decision

Policy recommendation is advisory.
Human planner approves/edits/rejects.
No automatic government submission.

## Cost Strategy
- deterministic gate before expensive AI calls
- structured concise prompts
- cache repeatable analysis
- batch where safe
- store generated outputs when inputs are unchanged
