# Workflow: New Feature

## Pipeline

```
Product Manager / Loop — capture intent
↓
Engineering Council (required unless trivial / waived)
↓
Product Manager + Business Analyst — lock specs
↓
Solution Architect — finalize contracts
↓
Database Engineer (if schema)
↓
Backend Engineer (if API)
↓
Frontend Engineer (if UI)
↓
QA Engineer
↓
Security Engineer (if auth/PII)
↓
Loop Engineer (gates + preview)
↓
Documentation Engineer
```

## Steps

1. **Receive request** — Loop or PM captures intent.
2. **Engineering Council** — Run `.kiro/workflows/engineering-council.md` before code. Fill `.kiro/templates/council-review.md`. No implementation until Loop recommends go / go-with-conditions and approval is given.
3. **Product** — Update overview/personas/flows as needed (including council-required spec updates).
4. **BA** — Update domain specs (business rules).
5. **Architect** — Update architecture/api/database specs; plan sequence (aligned with council recommendation).
6. **Implement** — DB → Backend → Frontend as required.
7. **QA** — Test plan from specs; execute.
8. **Security** — Review if auth/permissions/PII touched.
9. **Loop** — lint, typecheck, build, preview health.
10. **Docs** — Ensure specs/project/index remain accurate.

## Definition of Done

Constitution DoD + feature acceptance criteria from specs.
