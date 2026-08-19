# Antigravity Prompt — Initial Onboarding

You are taking over an existing Nivaran repository for the Build with AI: Code for Communities — Second Edition, Track 1.

Read, in order:
1. `AGENTS.md`
2. `docs/hackathon/00_MASTER_CONTEXT.md`
3. `docs/hackathon/01_PRODUCT_VISION.md`
4. `docs/hackathon/02_REQUIREMENTS.md`
5. `docs/hackathon/10_BUILD_ROADMAP.md`
6. existing repository structure and relevant source/config files.

Do NOT modify application code yet.

Your job in this phase is repository onboarding and audit only.

Objectives:
1. Map the current architecture.
2. Identify what Nivaran already does correctly and should be reused.
3. Identify obsolete complaint-centric product surfaces.
4. Identify broken or contradictory architecture/configuration.
5. Identify exact files/components/endpoints/tables that map to each new requirement.
6. Identify blockers to implementing the P0 roadmap.
7. Determine current test/build/deployment baseline.
8. Identify hardcoded/fabricated/demo-only behavior that must not survive.
9. Create/update `docs/hackathon/13_CODEBASE_AUDIT.md`.
10. Produce a sequenced implementation plan that references actual files.

Rules:
- Do not implement features.
- Do not refactor unrelated code.
- Do not guess when the repository can be inspected.
- Prefer reuse over rewrite.
- If documentation conflicts with code, record the conflict and use runtime/source evidence to determine the current truth.
- Do not delete anything during this audit.

At the end provide:
- baseline verification
- architecture map
- reuse map
- risk list
- P0 blockers
- exact recommended next task.

Stop after the audit.
