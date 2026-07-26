# Workflow: Refactor

## Pipeline

```
Solution Architect (scope & constraints)
↓
Owning Engineer(s)
↓
QA Engineer (regression)
↓
Loop Engineer (gates)
↓
Documentation Engineer (project patterns / ADRs)
```

## Rules

1. No behavior change unless a spec update is explicitly in scope.
2. Prefer incremental refactors with green gates between steps.
3. Record structural decisions in `memory/architecture-decisions.md` when lasting.
4. Follow constitution: no drive-by unrelated changes.
