# Logging

## Backend

- Use `console` for operational messages in development (e.g. password reset URL)
- Never log passwords or plaintext secrets
- Prefer structured messages with entity ids when debugging resource failures

## Frontend

- Prefer user-facing toasts/errors over noisy console spam in production paths
- Activity trail for domain events goes through ActivityLog (`src/utils/activityLogger.js`), not only browser console
