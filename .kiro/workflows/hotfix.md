# Workflow: Hotfix

## Pipeline

```
Receive Sev issue
↓
Loop Engineer triages
↓
Read specs (confirm intended behavior)
↓
Owning Engineer implements minimal fix
↓
QA verifies fix + critical path
↓
DevOps ships
↓
Docs/Memory update
↓
Follow-up ticket if larger refactor needed
```

## Rules

- Prefer smallest safe change.
- Do not expand scope into features.
- If hotfixes violate architecture temporarily, log debt in `memory/technical-debt.md`.
