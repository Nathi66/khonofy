# Technical Debt

| Item | Impact | Notes |
|------|--------|-------|
| Root `README.md` still Base44 boilerplate | Onboarding confusion | Prefer `specs/deployment.md` + `backend/README.md` |
| Base44 SDK / vite plugin still in package | Extra surface | Reminder cloud functions still under `base44/` |
| Backend largely single-file CRUD (`backend/src/index.js`) | Harder to scale modules | Extract when features demand |
| Prisma `migrations/` may be thin/missing in repo history | Env drift risk | Always commit migrations going forward |
| Limited automated test suite | Regressions caught late | Add tests with features per constitution |
