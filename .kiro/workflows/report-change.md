# Workflow: Report Change

## Pipeline

```
Product Manager / Business Analyst → specs/reporting.md
↓
Solution Architect (aggregations/API needs)
↓
Backend Engineer (if new queries/endpoints)
↓
Frontend Engineer (charts/tables)
↓
Performance Engineer (recommended for heavy aggregates)
↓
QA Engineer
↓
Loop Engineer
```

## Rules

- Metrics definitions live in `specs/reporting.md`.
- Respect role visibility (admin vs superuser) from `roles-permissions.md`.
