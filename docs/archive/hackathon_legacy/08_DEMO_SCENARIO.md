# 08 — Canonical Demo Scenario

## Demo Goal
Prove the complete loop in under 5 minutes:
**citizen voice → trusted demand → demand hotspot → data fusion → priority → explainable recommendation → cross-border portability**

## Scenario A — India
Citizen voice/text:
A resident reports recurring street flooding and requests drainage improvement.

Expected flow:
1. Input in Hindi or English.
2. Structured demand: drainage/flooding.
3. Evidence/location accepted.
4. Related reports are clustered.
5. Cluster enriched with population, infrastructure coverage, investment context.
6. Deterministic score is calculated.
7. Gemini explains why the cluster is high priority.
8. Policy brief generated.

## Scenario B — Brazil
Citizen text in Portuguese:
A request about sanitation in a neighborhood.

Show:
- same schema
- country-specific data
- localized text
- independent demand cluster
- priority recommendation.

## Scenario C — South Africa
Citizen request around water reliability/access.

Show:
- same intelligence engine
- different data source/config
- different category/context
- comparable output.

## Demonstration Numbers
Use deterministic seeded data, not live random values.
Every displayed number must exist in the seed dataset.

## Demo Narration
1. Problem: citizen demand is fragmented.
2. Intake: citizen voice becomes structured demand.
3. Correlation: many requests become one demand cluster.
4. Enrichment: population/infrastructure/investment context appears.
5. Decision: priority engine ranks the hotspot.
6. Explanation: Gemini explains the ranking from provided evidence.
7. Action: planner gets a recommendation/brief.
8. Scale: switch country and repeat.

## Demo Safety
No external government action should be triggered live.
Do not depend on an unstable third-party API for the critical demo path.
Use deterministic seeded datasets and a graceful fallback.
