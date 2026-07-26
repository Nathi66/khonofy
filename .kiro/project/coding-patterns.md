# Coding Patterns

## Frontend

- Feature pages under `src/pages/`
- Shared UI under `src/components/`
- Server state via TanStack Query (`src/lib/query-client.js`)
- Reuse hooks like `useCurrentUser`
- Prefer composition with shadcn primitives over custom one-off widgets
- No duplicated client-side permission matrices—align with `specs/roles-permissions.md`

## Backend

- Keep resource rules next to the generic handlers unless extracting a module is clearly justified
- Auth helpers live in `lib/auth.js`; serialization in `lib/serialize.js`
- Validate required fields before create

## General

- Match existing naming (camelCase JS, kebab-case routes)
- Avoid inline styles when Tailwind/utilities suffice
- Do not invent parallel state stores
