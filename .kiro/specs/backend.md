# Backend

## Stack

Express 5, JWT auth, Zod where used, Prisma client, CORS tied to `FRONTEND_URL`.

## Layout

- `backend/src/index.js` — HTTP routes, resource CRUD, auth, scoping
- `backend/src/lib/auth.js` — password hash, JWT, reset tokens
- `backend/src/lib/prisma.js` — Prisma client
- `backend/src/lib/serialize.js` — normalize/serialize camelCase
- `backend/src/config/env.js` — environment
- `backend/prisma/schema.prisma` — schema
- `backend/prisma/seed.js` — demo data

## Environment

See `backend/README.md`: `DATABASE_URL`, `PORT` (3001), `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, optional SMTP.

## Patterns

- Generic resource map drives CRUD for domain entities
- `requireAuth` on resource routes
- `scopeWhere` enforces department/self visibility
- Create/update/delete apply role-specific Forbidden checks

## Related

- API contract: `api.md`
- Schema: `database.md`
- Auth: `authentication.md`
