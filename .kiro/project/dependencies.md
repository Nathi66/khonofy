# Dependencies

## Frontend (root package)

Primary runtime deps include React, React Router, TanStack Query, Radix/shadcn primitives, Tailwind-related tooling, Recharts, Zod, Framer Motion, `@base44/sdk` and `@base44/vite-plugin` (legacy/cloud bridge).

## Backend (`backend/package.json`)

Express, Prisma client, JWT, bcrypt, CORS, dotenv-style config via local env module.

## Policy

- Prefer existing libraries already in the tree.
- Adding a dependency requires justification in the PR and an update here if it becomes a stack-level choice.
- Do not introduce a second UI kit or state library without an architecture decision in `memory/architecture-decisions.md`.
