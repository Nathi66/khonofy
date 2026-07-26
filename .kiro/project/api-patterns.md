# API Patterns

## Client

- `src/api/base44Client.js` exposes Base44-shaped entity helpers that call local REST
- Prefer existing entity helpers over ad-hoc `fetch` unless a new endpoint requires it
- Auth token attached from client auth storage

## Server

- Resource map in `backend/src/index.js` (`RESOURCE_MAP`)
- Normalize inbound keys; serialize outbound records
- Scope lists with `scopeWhere`; fail closed with Forbidden on create/update/delete
- Errors: `{ message }` JSON with appropriate HTTP status

## Conventions

- REST resource names are kebab-case in URLs (`time-entries`, `task-templates`, `activity-logs`)
- Query filters mirror model fields in camelCase after normalization
