# Database Conventions

- Prisma schema is the schema source of truth in-repo (`backend/prisma/schema.prisma`)
- Use enums for roles, priorities, statuses
- Prefer `cuid()` string IDs
- Denormalized display fields (`userName`, `taskTitle`, `tagName`) exist for list UX—keep them consistent on write when the UI already does
- Date-only fields vs datetime fields are coerced in the API layer
- Always add a Prisma migration for schema changes
- Seed resets demo passwords; do not rely on seed for production data
