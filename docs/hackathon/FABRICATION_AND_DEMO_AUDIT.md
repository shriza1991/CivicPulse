# FABRICATION AND DEMO AUDIT — Nivaran Baseline

## Principles
1. Every numerical insight must be traceable to deterministic computation and/or a documented data source.
2. Synthetic/demo data must be visibly and consistently marked as sample/demo data internally and in documentation.
3. AI should understand, classify, correlate, reason, summarize, or explain; deterministic code should calculate counts, distances, aggregates, scores, rankings, and data transformations.

---

## Findings in Current Codebase

| File / Component | Behavior / Finding | Unsafe Aspect | Demo Fixture Acceptable? | Required Future Fix |
|---|---|---|---|---|
| `backend/app/routers/issues.py:88` | Default `confidence = 0.85` returned when AI auto-fill runs or falls back | Hardcoded confidence score presented as AI output | NO | Compute confidence dynamically from Gemini logprobs or OCR/vision match confidence |
| `backend/app/utils/seeder.py` | Hardcoded seeded issue records with static coordinates, wait days, and status | Seed data used for demo presentation | YES (if explicitly marked `is_demo=True`) | Add explicit `is_demo: True` flag on seeded models and UI badges |
| `frontend/src/pages/IntakePage.tsx` | Mock duplicate alert with hardcoded wait times during offline intake | Could present fake wait time | NO | Retrieve actual cluster statistics or display "Offline Draft" notice |
| `backend/app/templates/rti.py` | Pre-written text boilerplate for RTI dispatch | Rigid text template | YES | Replace with Gemini-generated Policy Action Briefs with clear evidence disclaimers |
