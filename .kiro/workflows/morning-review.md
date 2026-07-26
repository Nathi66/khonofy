# Workflow: Morning Review

Subset of `daily-cycle.md` — run alone when only triage is needed.

## Pipeline

```
Loop Engineer
↓
Product Manager + Business Analyst (+ QA input)
↓
Prioritized backlog
↓
Optional: hand off to sprint planning / implementation
```

## Steps

1. Load memory: known bugs, debt, future features, lessons.
2. Diff intent vs `.kiro/specs/` for obvious drift.
3. List candidate work with priority and owning specs.
4. Recommend the single best next pipeline item.

## Outputs

- Prioritized backlog (P0/P1/P2)
- Recommended workflow for #1
- Verbose trace if `AEOS_VERBOSE=true`
