# Hook: Before Preview

## Steps

1. Install dependencies (root + backend if needed).
2. Generate Prisma client: `cd backend && npx prisma generate`.
3. Check migrations: `cd backend && npx prisma migrate status` (or `npm run db:migrate`).
4. Ensure PostgreSQL is reachable via `DATABASE_URL`.
5. Start database if local compose/service is used.
6. Start backend (`npm run dev --prefix backend` or via `npm run dev`).
7. Start frontend (Vite via `npm run dev`).
8. Run health checks (see after-preview).

## Ports

- API: `http://localhost:3001/health`
- UI: `http://localhost:5173`
