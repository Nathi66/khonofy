# Lessons Learned

1. **Specs own knowledge.** Business rules (e.g. Monday–Sunday weeks) must live in `.kiro/specs/timesheets.md`, not in skills or prompt files.
2. **Skills stay portable.** Role contracts reference specs so the same Frontend/Backend skills can be reused on other projects.
3. **Loop Engineer does not edit rules.** Orchestration fixes code/process; BA updates specifications when the product changes.
4. **Verbose mode shows the org at work.** With `AEOS_VERBOSE=true`, handoffs and loaded knowledge are visible; otherwise you only see final code.
5. **Engineering Council before code.** Non-trivial work should gather multi-discipline input first; Loop summarizes and recommends a plan so AEOS decides collaboratively, not as isolated roles.
