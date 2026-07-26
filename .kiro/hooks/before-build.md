# Hook: Before Build

## Steps

1. Ensure dependencies installed: `npm install` (and `npm install` in `backend/` if needed).
2. Generate Prisma client: `cd backend && npx prisma generate`.
3. Confirm `backend/.env` has `DATABASE_URL` (build may not need DB runtime, but generate needs schema).
4. Run lint: `npm run lint`.
5. Run typecheck: `npm run typecheck`.

## Failure

Stop the build; report the first failing step to Loop Engineer.
