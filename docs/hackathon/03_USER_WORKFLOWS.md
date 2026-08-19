# 03 — User Workflows

## A. Citizen Demand Workflow

Goal: submit a useful development request with minimal friction.

1. Citizen opens web or supported messaging channel.
2. Citizen types or records a request.
3. Optional: citizen adds photo/evidence.
4. Optional: location is captured or inferred.
5. Gemini/normalization pipeline extracts structured demand.
6. Evidence trust gate validates optional evidence.
7. System shows a concise submission summary.
8. Request receives an internal/public reference ID.
9. Request enters community correlation pipeline.

Citizen must NOT be shown fabricated:
- match counts
- priority results before analysis
- government approval
- repair status.

## B. Planner Workflow

Goal: decide which needs deserve attention first.

1. Planner opens Demand Intelligence.
2. Selects country/region/sector/time filter.
3. Views Demand Hotspots.
4. Opens a hotspot.
5. Sees:
   - verified/request count
   - location
   - population context
   - infrastructure gap
   - investment context
   - evidence quality/provenance
   - priority score
6. Opens “Why this priority?”
7. Reviews deterministic score breakdown.
8. Reviews Gemini explanation.
9. Opens recommendation/policy brief.
10. Edits or approves.
11. Decision/action state is recorded if implemented in MVP.

## C. Auditor / Evaluator Workflow
1. Open recommendation.
2. Trace score factors.
3. Inspect source metadata.
4. Inspect AI-generated rationale and grounded input.
5. Identify assumptions/unknowns.
6. Review human decision status.

## UX Principle
Every major screen should answer a decision question:
- Where?
- What?
- Who is affected?
- What is already funded?
- Why now?
- Why this ranking?
- What remains unknown?
