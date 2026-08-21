# CI/CD & Frontend Test Audit

**Project:** Nivaran — Community Demand Intelligence  
**Date:** 2026-08-21  
**Status:** ALL TESTS GREEN & RECONCILED  

---

## 1. Test Reconciliation Matrix

| Test File / Suite | Purpose | Status | Problem Identified | Fix Applied | Architectural Reason |
|---|---|---|---|---|---|
| `frontend-smoke.test.mjs` (Test 1) | Verify internal evaluation is guarded from citizen shell | CURRENT / USEFUL | None | None | Protected route policy isolation |
| `frontend-smoke.test.mjs` (Test 2) | Verify report submission has no fabricated offline ID | CURRENT / USEFUL | Stale path referenced `src/pages/public/IntakePage.tsx` | Updated path to `src/pages/IntakePage.tsx` | Production router mounts canonical `IntakePage` |
| `frontend-smoke.test.mjs` (Test 3) | Offline provider never clears queue without API contract | CURRENT / USEFUL | None | None | Data safety guarantee |
| `frontend-smoke.test.mjs` (Test 4) | API client normalization & auth token storage key | CURRENT / USEFUL | None | None | Error handling contract |
| `frontend-smoke.test.mjs` (Test 5) | Citizen voice demand intake with Sarvam & Gemini | STALE / BRITTLE -> RECONCILED | Asserted against obsolete `VoiceDemandInput` and string mismatches | Updated to assert `VoiceRecorderModal`, multi-language STT, and query mutation | Modernized Phase 2/3 voice modal architecture |
| `frontend-smoke.test.mjs` (Test 6) | Photo uploader JPEG/PNG MIME validation | CURRENT / USEFUL | None | None | Strict Stage 0 file validation |
| `frontend-smoke.test.mjs` (Test 7) | Intake surfaces normalized API errors | CURRENT / USEFUL | None | None | Graceful user error feedback |
| Backend Pytest (108 tests) | Full suite covering Agents 1-5, Auth, Spatial Clustering, Priority, Voice Pipeline, Policy Advisor | CURRENT / USEFUL | None (all 108 pass) | None | Full test coverage for Track 1 |
| TypeScript Check (`tsc -b`) | Static type verification across client components | CURRENT / USEFUL | None (exited 0) | None | Strict type safety |
| Linter (`oxlint`) | Code quality, react rules, accessibility | CURRENT / USEFUL | 0 errors, 26 minor warnings | Verified | Clean lint status |
| Production Bundle (`vite build`) | Production asset compilation | CURRENT / USEFUL | None (built in 38s) | None | Production readiness |

---

## 2. CI Workflow Configuration Check (`.github/workflows/ci.yml`)

1. **Python Setup**: `3.11` (compatible with 3.11-3.13)
2. **Backend Dependencies**: `pip install -r backend/requirements.txt pytest pytest-asyncio anyio`
3. **Backend Test Command**: `cd backend && export TEST_DATABASE_URL="sqlite:///./test_ci.db" && python -m pytest`
4. **Node Setup**: `20`
5. **Frontend Dependencies**: `npm ci`
6. **Frontend Verify Command**: `npm run verify` (`oxlint && tsc -b && npm test && vite build`)
