# 11 — Acceptance Criteria

## A. End-to-End P0
Given seeded citizen requests:
1. requests enter the system
2. demand is structured
3. evidence is validated
4. requests are correlated
5. a demand cluster appears
6. cluster is enriched
7. deterministic priority is calculated
8. Gemini generates grounded rationale
9. planner can inspect and approve/edit
10. policy brief can be produced.

## B. No Fabrication
Automated test coverage must catch:
- invented counts
- invented population
- invented investment
- invented status
- fabricated confidence
- fabricated community matches.

## C. Grounded AI
For each recommendation:
- numerical claims match stored inputs
- unsupported claims are rejected or flagged
- uncertainty is surfaced
- model output conforms to schema.

## D. Priority Reproducibility
Same dataset + same configuration = same score.

## E. Cross-Border
At minimum:
- India scenario passes
- Brazil scenario passes
- South Africa scenario passes
- no country-specific business logic is duplicated.

## F. UX
Planner can:
- find hotspot
- inspect evidence
- understand score
- inspect investment context
- generate recommendation.

Citizen can:
- submit text/voice
- receive honest acknowledgment
- see processing state.

## G. Reliability
Critical path must:
- work with seeded data without external outages
- have graceful loading/error states
- expose health/readiness
- avoid endless retries/polling
- avoid hardcoded demo IDs.

## H. Build Quality
Required before release:
- backend tests pass
- frontend tests pass
- typecheck passes
- lint passes or documented non-blocking warnings
- production build passes
- deploy smoke tests pass
