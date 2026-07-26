# Engineering Constitution

This is the law. Every engineer and agent starts here. These rules are project-agnostic.

## Core rules

1. **Never duplicate business logic.** Define behavior once; share through modules or specs—not copy-paste.
2. **Never hardcode permissions.** Enforce roles and scope through the authorization model defined in specifications.
3. **Always reference specifications.** Product knowledge lives in `specs/`. Skills and code must not invent or fork it.
4. **Never modify database schema without a migration.** Schema changes require a Prisma migration and a documented plan.
5. **Every feature must include tests.** New behavior ships with automated coverage appropriate to the change.
6. **Every feature must build successfully.** Lint, typecheck, and production build must pass before done.
7. **Accessibility is mandatory.** Interactive UI must meet accessibility requirements (keyboard, labels, contrast, focus).
8. **No breaking changes without a migration plan.** API, schema, or UX breaks need an explicit migration path.

## Hierarchy of truth

1. Constitution (how we engineer)
2. Specifications (what the product is)
3. Project knowledge (how this repo implements it)
4. Skills and workflows (who does what, in what order)
5. Memory (lessons and debt—never overrides specs)

When sources conflict, higher layers win unless a specification intentionally supersedes outdated project notes (then update project/memory).
