# Nivaran Gemini/Agent Context

Use `AGENTS.md` as the authoritative repository-wide engineering instruction.

Before coding:
- Read `AGENTS.md`.
- Read `docs/hackathon/00_MASTER_CONTEXT.md`.
- Read only the specification files relevant to the current task.
- Inspect the existing code before editing.

Never infer product requirements from old UI alone. The current product is **Nivaran — Community Demand Intelligence**.

Primary flow:
Citizen voice/text/photo
→ structured demand
→ evidence trust
→ semantic/spatial correlation
→ demand cluster
→ demographic/infrastructure/investment enrichment
→ deterministic priority score
→ Gemini policy reasoning
→ human-reviewed recommendation.

Do not fabricate data or use an LLM for deterministic calculations.
