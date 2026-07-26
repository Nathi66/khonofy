# Error Handling

## Backend

- `sendError(res, status, message)` for API errors
- Auth failures → 401
- Conflict (duplicate email) → 409
- Validation / handler errors → 400 with message
- Unknown resource → 404

## Frontend

- Surface API `message` to the user via toast or inline alert patterns already used on pages
- Protect routes with `ProtectedRoute`; do not render privileged pages without auth
- Handle empty/error query states with existing loading/empty UI patterns
