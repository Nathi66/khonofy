# Security Principles

## Authentication and authorization

- Never trust the client for identity or role.
- Enforce authentication on protected routes and APIs.
- Authorize by role and resource scope as defined in `specs/roles-permissions.md`—do not hardcode ad-hoc checks that diverge from the spec.

## Secrets and data

- Never commit secrets, tokens, or production credentials.
- Use environment variables for configuration.
- Do not log passwords, reset tokens, or full session secrets.
- Minimize PII in logs and activity details.

## Input and output

- Validate and normalize inputs on the server.
- Guard against injection (SQL via ORM parameterization, XSS via safe React rendering).
- Prefer least privilege for every new capability.
