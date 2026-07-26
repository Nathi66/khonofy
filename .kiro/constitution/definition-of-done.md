# Definition of Done

A change is done only when all applicable items are true:

1. Specs updated if product behavior or API/schema contracts changed.
2. Implementation matches the referenced specifications.
3. Authorization and scoping follow `specs/roles-permissions.md`.
4. Lint passes (`npm run lint`).
5. Typecheck passes (`npm run typecheck`).
6. Production build passes (`npm run build`) when frontend is affected.
7. Tests added/updated for the change (constitution testing rules).
8. Accessibility requirements met for UI changes.
9. Schema changes include a Prisma migration.
10. No secrets committed; env examples documented if new vars are required.
11. Memory updated only when there is a lasting lesson, ADR, or debt to record.
