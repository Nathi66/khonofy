# Workflow: Release

## Pipeline

```
Loop Engineer (release candidate gates)
↓
QA Engineer (release test plan)
↓
Security Engineer (if needed)
↓
DevOps Engineer (tag/deploy)
↓
Documentation Engineer (release notes)
↓
Loop Engineer → memory/release-history.md
```

## Steps

1. Ensure mainline gates pass (lint, typecheck, build, tests).
2. Run release test plan from `templates/test-plan.md` / `templates/release.md`.
3. Deploy per `specs/deployment.md` and DevOps runbooks.
4. Record version/notes in `memory/release-history.md`.
