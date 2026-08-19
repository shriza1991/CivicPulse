# Phase 21 Walkthrough

This pass hardens the existing report path around the API that actually exists today.

1. Open `/report` and capture a photo. No location is prefilled.
2. Confirm a real location and review the evidence-language trust step.
3. Select a community choice; the UI does not invent nearby reports before submission.
4. Explicitly approve the generated report before the existing `POST /api/issues` call.
5. Online submission shows the server case ID. Offline work is saved locally without claiming dispatch or inventing a tracking ID.
6. `/internal/evaluate` is protected by role and feature flag and is absent from the citizen shell.

Verification commands are listed in `docs/release-checklist.md`; the remaining blockers are recorded in `docs/production-readiness-report.md`.
