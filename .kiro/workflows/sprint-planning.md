# Workflow: Sprint Planning

## Pipeline

```
Morning review backlog (input)
↓
Product Manager
↓
Business Analyst (clarify rules into specs if needed)
↓
Solution Architect (optional sizing / pipeline design)
↓
Ready backlog + selected workflow(s)
```

## Steps

1. Take prioritized backlog from morning review (or create one).
2. Product Manager locks sprint goal and ordered items.
3. BA updates domain specs before build if rules change.
4. Architect may sketch a provisional sequence; **Engineering Council** confirms before code for non-trivial items.
5. Hand off first item to `engineering-council.md`, then the chosen implementation workflow (`new-feature`, `bug-fix`, etc.).

## Outputs

- Sprint goal
- Ordered items with acceptance criteria (spec-cited)
- First item’s workflow path (council → implementation) and provisional agent pipeline
- Verbose trace if `AEOS_VERBOSE=true`
