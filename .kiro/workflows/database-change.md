# Workflow: Database Change

## Pipeline

```
Business Analyst (rules if domain impact)
↓
Solution Architect (contract)
↓
Database Engineer (schema + migration)
↓
Backend Engineer (API/serializers)
↓
Frontend Engineer (if UI depends on fields)
↓
QA Engineer
↓
Loop Engineer
```

## Rules

1. Update `specs/database.md` with the contract.
2. Schema change **requires** Prisma migration.
3. No breaking change without migration plan (constitution rule 8).
4. Use `templates/migration.md` and `templates/database.md`.
