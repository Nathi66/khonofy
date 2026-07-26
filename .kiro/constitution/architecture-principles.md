# Architecture Principles

## Separation of concerns

- UI components render and coordinate; business rules are enforced consistently with backend authority.
- API contracts are defined in specifications; clients do not invent endpoints or payloads.
- Persistence is accessed through the data layer (Prisma); do not scatter raw SQL without cause.

## Boundaries

- Frontend talks to the API; it does not own authorization as the sole gate.
- Backend enforces auth, validation, and department scoping per specs.
- Domain knowledge is documented in `specs/`; implementation details live in `project/`.

## Change management

- Prefer additive, backward-compatible changes.
- Breaking API or schema changes require a migration plan (constitution rule 8).
- Keep feature folders cohesive; avoid cross-cutting god modules.
