# DEVELOPMENT GUIDE — Engineering Standards & Workflow

**Project**: Nivaran — Community Demand Intelligence  
**Document Authority**: Level 4 (Engineering Operational Guide)  

---

## 1. Core Engineering Principles

1. **Think First**: Understand the system architecture before modifying code.
2. **Simplicity Over Speculation**: Build the smallest correct solution. Do not create unneeded abstractions or speculative features.
3. **Reuse Before Rewrite**: Leverage existing SQLModel models, FastAPI routers, and React component primitives.
4. **Surgical Changes**: Modify only the code required for the task.
5. **No Feature for Feature's Sake**: Every change must trace: `Hackathon Requirement → Product Requirement → Roadmap Phase → Acceptance Criterion`.
6. **Zero Fabrication**: Never ask an LLM to invent metrics, statistics, coordinates, or scores that can be deterministically calculated.

---

## 2. Canonical System Architecture

```
                               ┌─────────────────────────────┐
                               │     Citizen Intake Flow     │
                               │ Voice (Sarvam) / Photo/Text │
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │  FastAPI Backend (Render)   │
                               │  • Stage 0 Verification Gate│
                               │  • Gemini Multimodal Class. │
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │  Neon PostgreSQL (Spatial)  │
                               │  • DBSCAN / Spatial Cluster │
                               │  • Issues & Clusters Schema │
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │  Deterministic Data Fusion  │
                               │  • Census Demographics     │
                               │  • Infrastructure Assets    │
                               │  • Priority Engine (0-100)  │
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │ Gemini 2.5 Policy Reasoning │
                               │ • Structured Briefs         │
                               │ • Funding & Risk Synthesis  │
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │ Policymaker Console (Vercel)│
                               │ • Interactive Map Hotspots  │
                               │ • Human Review & Action     │
                               └─────────────────────────────┘
```

---

## 3. Testing & Verification Requirements

Before declaring any task complete:
1. **Backend Tests**: Run `python -m pytest` (Must maintain 100% pass rate across all test modules).
2. **Frontend Smoke Suite**: Run `node --test scripts/frontend-smoke.test.mjs`.
3. **Static Typing**: Run `npx tsc -b` (0 TypeScript compiler errors).
4. **Linter**: Run `npx oxlint` (0 linter errors).
5. **Production Build**: Run `npm run build` (Vite production bundle must succeed).

---

## 4. Definition of Done

A task is done only when:
- Acceptance criteria are satisfied.
- Relevant tests pass.
- No fabricated fallback or fake data behavior remains.
- Error, empty, and loading states are honest and resilient.
- Changes are documented in canonical guides.
