# Hook: After Preview

## Steps

1. `GET http://localhost:3001/health` → `{ ok: true }`.
2. Open `http://localhost:5173` — login page loads.
3. Optional smoke: login with demo staff account from `specs/deployment.md`.
4. Verify preview URL / local URLs reported to requester.

## Failure

Collect backend and Vite logs; hand to Loop Engineer with suspected layer (env, DB, API, UI).
