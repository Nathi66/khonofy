# Deployment and Local Development

## Local

From app package root:

```bash
npm install
# configure backend/.env (see backend/README.md)
cd backend && npm run db:migrate && npm run db:seed
cd .. && npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- `/api` proxied from Vite to backend

Scripts:

- `npm run dev` — concurrently backend + frontend
- `npm run build` — Vite production build
- `npm run preview` — Vite preview
- `npm run lint` / `lint:fix`
- `npm run typecheck`

## Base44

Project originated from Base44. Cloud publish/reminders may still use Base44 Builder and Deno functions. Root `README.md` may still describe Base44 clone/env vars (`VITE_BASE44_*`). Prefer local Express + Vite for day-to-day engineering unless cloud publish is in scope.

## Demo accounts

| Role | Name | Email | Password |
|------|------|-------|----------|
| Superuser | Luis | luis@khonofy.local | Demo123! |
| Admin | John | john@khonofy.local | Demo123! |
| Staff | Nathii | nathii@khonofy.local | Demo123! |
