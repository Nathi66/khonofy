# Tech Stack

| Layer | Choices |
|-------|---------|
| Frontend | React 18, Vite 6, React Router 6, TanStack Query, Tailwind CSS, shadcn/Radix UI, Recharts, Zod, Framer Motion |
| Backend | Express 5, JWT (`jsonwebtoken`), bcryptjs, Zod |
| Database | PostgreSQL via Prisma 6 |
| Client API | Local REST behind Base44-shaped facade (`src/api/base44Client.js`) |
| Cloud automation | Base44 Deno functions for Teams / Outlook / email reminders |
| Tooling | ESLint, `tsc` via jsconfig, concurrently for `npm run dev` |

Ports: Vite **5173**, API **3001**.
