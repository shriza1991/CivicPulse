# Nivaran — Agent Operating Instructions

## 1. Mission
Nivaran is being substantially transformed for **Build with AI: Code for Communities — Second Edition, Track 1: AI for Digital Public Infrastructure & Governance**.

Product identity:
**Nivaran — Community Demand Intelligence**

Core thesis:
**Citizen voice → trusted demand → community intelligence → infrastructure/data fusion → explainable priority → policy action**

The target system is a decision-support platform for planners/policymakers. Citizens provide demand signals; policymakers use the resulting intelligence.

---

## 2. Agent Governance & Mandatory Read Order
Before changing product behavior or code, every agent MUST read:
1. `AGENTS.md` (this file)
2. `docs/hackathon/HACKATHON_CONTRACT.md`
3. `docs/hackathon/JUDGING_CONTRACT.md`
4. `docs/hackathon/PRODUCT_CONTRACT.md`
5. `docs/hackathon/PHASE_CONTRACT.md`
6. `docs/hackathon/CONTEXT_GOVERNANCE.md`

Do NOT load historical research into context unless required for specific domain questions (`docs/research/DEEP_RESEARCH.md`).

---

## 3. Mandatory Pre-Implementation Drift Verification
Before changing product behavior or writing code, every AI agent MUST verify:

1. **What problem statement requirement does this satisfy?**
2. **Which judging criterion does it strengthen?**
3. **Which product requirement does it implement?**
4. **Which current phase authorizes the work?**
5. **What existing capability is being reused?**
6. **What acceptance criterion proves completion?**

> [!CAUTION]
> If an agent CANNOT answer all six questions, it MUST NOT implement the feature. **NO FEATURE FOR FEATURE'S SAKE.** Every feature must trace: `Hackathon Requirement → Product Requirement → Roadmap Phase → Acceptance Criterion`.

---

## 4. Pre-Task Drift Checklist
Run this check before starting any major task:

```
DRIFT CHECK:
[ ] Does this still solve Track 1?
[ ] Does this directly support the official challenge?
[ ] Does this help a planner/policymaker make a better decision?
[ ] Does this strengthen at least one judging criterion?
[ ] Is Google AI meaningfully involved where appropriate?
[ ] Is the result evidence-grounded?
[ ] Is the architecture cross-border?
[ ] Is this inside the current roadmap phase?
[ ] Is it necessary for the MVP/demo?
[ ] Does it avoid inventing data or authority?
```
> [!WARNING]
> If 3 or more answers are “No”: **STOP and reassess before coding.**

---

## 5. Non-Negotiable Product Rules
- Do not regress into a generic complaint/ticketing product.
- The primary decision user is a planner/policymaker.
- The hero object is a **Demand Cluster / Demand Hotspot**, not an individual complaint.
- Every important numerical insight must be traceable to deterministic computation and/or a documented data source.
- Never fabricate population, infrastructure, investment, confidence, impact, project status, government action, or policy facts.
- Synthetic/demo data must be visibly and consistently marked as demo/sample data internally and in documentation (`is_demo: True`).
- AI should understand, classify, correlate, reason, summarize, or explain; deterministic code should calculate counts, distances, aggregates, scores, rankings, and data transformations.
- Human approval remains required for policy recommendations or external action.
- Cross-border architecture must not hardcode India-only domain assumptions.
- Prefer reuse of working Nivaran capabilities over rewrites.

---

## 6. AI Rules
- Use Google AI (Gemini 2.5) meaningfully; do not add decorative Gemini calls.
- Prefer structured model outputs with schemas.
- Put deterministic validation around model outputs.
- Never ask an LLM to invent or calculate authoritative metrics that the system can compute directly.
- Every recommendation must expose supporting evidence and uncertainty.
- Preserve privacy: policy reasoning should use aggregated/minimized data whenever possible.
- Optimize API cost by gating expensive calls with deterministic checks and batching where safe.

---

## 7. Engineering Rules
- Inspect existing code first.
- Prefer the smallest coherent change.
- Do not refactor unrelated code during a feature task.
- Preserve existing tests unless their assumptions are deliberately obsolete and the specification says why.
- Add or update tests for every behavior change.
- After every implementation task run the smallest relevant tests, then the phase verification suite.
- Do not mark a phase complete unless its acceptance criteria pass.
- When blocked, document the blocker and evidence instead of guessing.
- Keep documentation and implementation synchronized.

---

## 8. Definition of Done
A task is done only when:
1. Acceptance criteria are met.
2. Relevant tests pass.
3. Typecheck/lint/build pass where applicable.
4. No fabricated fallback behavior remains.
5. Error/empty/loading states are honest.
6. The change is documented if it changes architecture or product behavior.
7. The next task can start without unresolved breakage.

---

## 9. Scope Control
Do not add:
- native mobile applications
- full government integrations
- broad BRICS localization
- speculative forecasting
- complex ML training
- unrelated social/community features
unless explicitly activated in the roadmap.

The P0 target is a complete, trustworthy, cross-border demand-to-policy demonstration.

# AUTO-ADVANCEMENT RULE

The agent may advance automatically only after:
- the current phase acceptance gate passes,
- all tests pass,
- the phase has been committed,
- the commit has been pushed successfully,
- and the phase status has been recorded.

If push fails, stop at the commit.
If acceptance fails, stop at the phase.
If a destructive or irreversible decision is required, stop and request user input.
