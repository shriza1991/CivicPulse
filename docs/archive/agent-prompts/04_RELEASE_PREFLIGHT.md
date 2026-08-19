# Antigravity Prompt — Release Preflight

Run a full release-readiness check for Nivaran.

Do not implement new features.

Check:
1. Product terminology is consistent with Community Demand Intelligence.
2. No old demo/fake states remain on critical paths.
3. No hardcoded issue IDs or country-specific business logic.
4. All P0 workflows work end-to-end.
5. All acceptance criteria pass.
6. Backend tests pass.
7. Frontend tests/typecheck/build pass.
8. API contracts are coherent.
9. Roles/permissions are coherent.
10. External data has provenance.
11. Gemini outputs are schema-validated and grounded.
12. Priority scores are deterministic.
13. Deployment health/readiness works.
14. Seeded demo data is deterministic.
15. Critical demo path does not depend on an external API that can casually fail.
16. README and architecture docs match implementation.

Produce:
- PASS/FAIL checklist
- blockers
- highest-risk remaining issue
- exact verification evidence
- release recommendation.

Do not mark readiness based only on local compilation.
