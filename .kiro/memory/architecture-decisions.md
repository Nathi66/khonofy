# Architecture Decisions

## ADR-001: Local Express API behind Base44-shaped client

- **Status:** Accepted (current state)
- **Context:** App originated on Base44; local development uses Express + Prisma with a compatible client facade.
- **Decision:** Keep `src/api/base44Client.js` as the frontend integration surface over local REST until a deliberate client redesign.
- **Consequences:** Entity helpers may look Base44-like; true source of API behavior is Express + `specs/api.md`.
