# Testing Principles

## Expectations

- Every feature or bug fix includes tests or an explicit, justified exception approved in the PR.
- Prefer tests that lock business rules from specifications over brittle UI snapshot noise.
- Cover happy path and critical failure/permission paths.

## Layers

- Unit: pure helpers, date/week logic, serializers, validators.
- Integration: API auth, scoping, and resource lifecycle.
- End-to-end (when available): core user flows from `specs/user-flows.md`.

## Quality bar

- Tests must be deterministic and runnable in CI/local without manual setup beyond documented env.
- Do not assert implementation trivia that makes refactors painful without protecting behavior.
