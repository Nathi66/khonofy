# Workflow: Authentication Change

## Pipeline

```
Business Analyst / PM (if UX or policy changes)
↓
Solution Architect
↓
Backend Engineer
↓
Frontend Engineer
↓
Security Engineer (required)
↓
QA Engineer
↓
Loop Engineer
```

## Rules

1. Update `specs/authentication.md` and `roles-permissions.md` before or with the code.
2. Security Engineer review is mandatory.
3. Never log secrets or plaintext reset tokens in committed docs.
