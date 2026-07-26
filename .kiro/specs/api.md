# API

## Base

- Local API: `http://localhost:3001`
- Frontend proxies `/api` to the backend in Vite
- Health: `GET /health` → `{ ok: true }`

## Auth

See `authentication.md`.

## Resource CRUD

Authenticated generic resources under `/api/:resource`:

| Resource key | Prisma model |
|--------------|--------------|
| `users` | user |
| `tasks` | task |
| `time-entries` | timeEntry |
| `timesheets` | timesheet |
| `departments` | department |
| `tags` | tag |
| `task-templates` | taskTemplate |
| `activity-logs` | activityLog |

### Methods

- `GET /api/:resource` — list (query filters, `sort`, `limit`); scoped by role
- `GET /api/:resource/:id` — get one
- `POST /api/:resource` — create
- `PUT` / `PATCH /api/:resource/:id` — update
- `DELETE /api/:resource/:id` — delete

### Query notes

- Filter keys are camelCased from query params
- Date-only and datetime fields coerced server-side
- Sort: field or `-field` for desc; aliases `createdDate`→`createdAt`, `updatedDate`→`updatedAt`

### Serialization

Responses use camelCase JSON via backend serializers. Password hashes are not exposed on user records.

## Authorization

Scoping and create/update/delete rules are defined in `roles-permissions.md` and implemented in `backend/src/index.js`. The API is authoritative for enforcement.

## Client facade

Frontend uses a Base44-shaped client (`src/api/base44Client.js`) over this local REST API.
