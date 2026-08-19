# Antigravity Prompt — Debug a Failing Test/Workflow

Investigate the following failure:

**FAILURE: <paste exact error/log>**

Context:
- Current phase: <phase>
- Relevant feature: <feature>

Rules:
1. Reproduce the failure if possible.
2. Trace the failure to the smallest root cause.
3. Do not patch symptoms blindly.
4. Check whether the failure is caused by:
   - stale assumptions
   - wrong route/API contract
   - data schema mismatch
   - state lifecycle
   - dependency/tooling issue
   - deployment mismatch
   - environment variable/configuration
5. Fix the root cause with the smallest safe change.
6. Add a regression test when appropriate.
7. Run the narrowest failing test first, then the relevant phase suite.

Do not modify unrelated modules.

Final response:
- root cause
- fix
- regression test
- verification performed
- remaining uncertainty, if any.
