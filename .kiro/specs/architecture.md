# Architecture

## High-level

```
Browser (React/Vite)
        │  /api proxy
        ▼
Express API (JWT + Prisma)
        │
        ▼
PostgreSQL

Optional: Base44 cloud functions (reminders)
```

## Layers

1. **Presentation** — React pages/components, TanStack Query for server state
2. **API client** — Base44-shaped facade over local REST
3. **Application API** — Express auth + resource handlers
4. **Persistence** — Prisma models on PostgreSQL
5. **Automation** — Base44 Deno functions for reminder channels

## Design intent

- Department-scoped multi-tenant-ish boundaries (soft tenancy via `departmentId`)
- Role-based capabilities with server-side enforcement
- Weekly timesheet cycle as the product heartbeat
- Audit trail for accountability

## AEOS dependency

Agents and engineers treat `.kiro/specs/` as the product source of truth and `.kiro/project/` as implementation decisions. Skills do not redefine architecture facts listed here.
