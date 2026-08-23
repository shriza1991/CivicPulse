# Nivaran — Agent Operating Instructions

## 1. Mission & Product Identity
Nivaran is built for **Build with AI: Code for Communities — Second Edition, Track 1: AI for Digital Public Infrastructure & Governance**.

**Product Identity**: Nivaran — Community Demand Intelligence  
**Core Positioning**: *"Built for India. Designed to adapt beyond India."*  

**Core Thesis**:  
Citizen voice / text / photo → trusted demand → spatial hotspot → Indian data fusion → deterministic priority → Google Gemini policy reasoning → human-reviewed infrastructure action.

Nivaran is a decision-support intelligence platform for planners and policymakers. Citizens provide demand signals; policymakers use the resulting intelligence.

---

## 2. Canonical Document Authority & Mandatory Read Order

Before modifying code or product behavior, every agent MUST consult documents in this strict hierarchy:

1. [`docs/hackathon/HACKATHON_CONTRACT.md`](file:///d:/Projects/CivicPulse/docs/hackathon/HACKATHON_CONTRACT.md) — Official challenge facts, build requirements, judging criteria.
2. [`docs/hackathon/PRODUCT_CONTRACT.md`](file:///d:/Projects/CivicPulse/docs/hackathon/PRODUCT_CONTRACT.md) — Product thesis, India-first positioning, AI responsibilities.
3. [`docs/hackathon/JUDGING_CONTRACT.md`](file:///d:/Projects/CivicPulse/docs/hackathon/JUDGING_CONTRACT.md) — Rubric weighting and scoring evidence.
4. [`docs/hackathon/DEVELOPMENT_GUIDE.md`](file:///d:/Projects/CivicPulse/docs/hackathon/DEVELOPMENT_GUIDE.md) — Engineering principles, architecture, test expectations.
5. [`docs/hackathon/DEPLOYMENT_GUIDE.md`](file:///d:/Projects/CivicPulse/docs/hackathon/DEPLOYMENT_GUIDE.md) — Cloud deployment (Render, Vercel, Neon), env vars, health probes.
6. [`docs/research/RESEARCH_SUMMARY.md`](file:///d:/Projects/CivicPulse/docs/research/RESEARCH_SUMMARY.md) — Research synthesis and DPI context.

*Note: Historical and archived documents in `docs/archive/` are preserved for audit context only and never override the canonical contracts above.*

---

## 3. Non-Negotiable Engineering Rules

1. **India-First**: The primary geography, data, language, and demo context is **India** (Ward → District → State → National). Cross-border portability (BRICS) is demonstrated via modular adapters (`country_adapters.py`).
2. **Hero Object**: The hero object is a **Demand Hotspot / Cluster**, not an individual complaint ticket.
3. **Deterministic Truth**: All mathematical metrics, counts, distances, aggregates, and priority scores must be computed deterministically. Never ask an LLM to invent scores or stats.
4. **Google AI Integration**: Google Gemini 3.6 is used for structured demand understanding, multimodal verification, and evidence-grounded policy brief reasoning.
5. **Multilingual Voice**: Spoken citizen demands in Indian languages (Hindi, Marathi, English) are transcribed via Sarvam AI STT.
6. **Human in the Loop**: Final policy decisions and infrastructure spending actions remain strictly under human authority.
7. **Surgical Changes**: No feature for feature's sake. Test every change before declaring complete.

---

## 4. Definition of Done

A task is complete only when:
- Requirements trace directly to canonical contracts.
- Backend pytest suite passes 100%.
- Frontend smoke tests pass 100%.
- TypeScript (`tsc -b`) and linter (`oxlint`) pass with 0 errors.
- Production build (`vite build`) succeeds.
- No fabricated fallback data or unverified claims remain.
