# Performance Principles

## Defaults

- Avoid N+1 queries; load only needed fields and relations.
- Paginate or limit large list endpoints and UI tables.
- Prefer TanStack Query caching patterns already used in the app; do not refetch aggressively without reason.
- Keep bundle growth intentional; lazy-load heavy routes/charts when appropriate.

## Measurement

- Optimize from evidence (profiling, network, DB) when changing hot paths.
- Do not sacrifice clarity for micro-optimizations on cold paths.
