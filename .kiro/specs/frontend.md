# Frontend

## Stack

React 18, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/Radix UI, Recharts, Zod, Framer Motion.

## Routes

| Path | Page |
|------|------|
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth |
| `/` | Dashboard (role-specific) |
| `/daily-log` | Daily Task Log |
| `/tasks` | Task Management |
| `/timesheets` | My Timesheets |
| `/timesheets/review` | Timesheet Review |
| `/team` | Team Management |
| `/audit-trail` | Audit Trail |
| `/profile` | Profile |
| `/calendar` | Calendar |
| `/tags` | Tag Management |
| `/admin-reports` | Reports |
| `/dept-summary` | Hours vs Estimates |
| `/reminders` | Reminder Scheduler |
| `/weekly-progress` | Weekly Progress |

## Structure

- `src/pages/` — route pages
- `src/components/` — shared UI, layout, dashboards
- `src/api/` — API client facade
- `src/hooks/`, `src/lib/`, `src/utils/`

## Rules

- Follow `project/design-system.md` and `project/coding-patterns.md`
- Do not hardcode business rules; read domain specs
- Role-gated nav and pages must align with `roles-permissions.md`
- Accessibility is mandatory (constitution)
