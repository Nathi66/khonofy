# Khonofy

**Khonofy** is a department-scoped time and task tracking platform for teams.

Tagline: *Smart time tracking, task management & reporting for teams.*

> **Source of truth:** Product knowledge lives in [`.kiro/specs/`](.kiro/specs/). This file is a human index only—do not treat it as a parallel specification.

Engineering agents: start at [`AGENTS.md`](AGENTS.md) and [`.kiro/README.md`](.kiro/README.md).

---

## Spec index

| Topic | Spec |
|-------|------|
| Overview | [project-overview.md](.kiro/specs/project-overview.md) |
| Personas | [personas.md](.kiro/specs/personas.md) |
| Roles & permissions | [roles-permissions.md](.kiro/specs/roles-permissions.md) |
| Business rules | [business-rules.md](.kiro/specs/business-rules.md) |
| User flows | [user-flows.md](.kiro/specs/user-flows.md) |
| Tasks | [task-management.md](.kiro/specs/task-management.md) |
| Timesheets | [timesheets.md](.kiro/specs/timesheets.md) |
| Calendar / logging | [calendar.md](.kiro/specs/calendar.md) |
| Reporting | [reporting.md](.kiro/specs/reporting.md) |
| Dashboards | [dashboards.md](.kiro/specs/dashboards.md) |
| Authentication | [authentication.md](.kiro/specs/authentication.md) |
| Notifications | [notifications.md](.kiro/specs/notifications.md) |
| Database | [database.md](.kiro/specs/database.md) |
| API | [api.md](.kiro/specs/api.md) |
| Frontend | [frontend.md](.kiro/specs/frontend.md) |
| Backend | [backend.md](.kiro/specs/backend.md) |
| Deployment | [deployment.md](.kiro/specs/deployment.md) |
| Architecture | [architecture.md](.kiro/specs/architecture.md) |

## AEOS layers

| Layer | Path |
|-------|------|
| Constitution | [.kiro/constitution/](.kiro/constitution/) |
| Specs | [.kiro/specs/](.kiro/specs/) |
| Project knowledge | [.kiro/project/](.kiro/project/) |
| Skills | [.kiro/skills/](.kiro/skills/) |
| Workflows | [.kiro/workflows/](.kiro/workflows/) |
| Hooks | [.kiro/hooks/](.kiro/hooks/) |
| Templates | [.kiro/templates/](.kiro/templates/) |
| Memory | [.kiro/memory/](.kiro/memory/) |

## Verbose mode & daily cycle

- Set `AEOS_VERBOSE=true` to see Task → Workflow → Specs → Skills → Constitution → Pipeline → handoffs → Loop Verification → Completed ([verbose-mode.md](.kiro/project/verbose-mode.md)).
- Daily rhythm: [daily-cycle.md](.kiro/workflows/daily-cycle.md) — morning review → sprint planning → [Engineering Council](.kiro/workflows/engineering-council.md) → one feature → Loop verification.

## Local development (short)

See [deployment.md](.kiro/specs/deployment.md) and [backend/README.md](backend/README.md).

- `npm run dev` — Vite **5173** + API **3001**
- Demo users after migrate + seed: `luis@khonofy.local`, `john@khonofy.local`, `nathii@khonofy.local` / `Demo123!`
