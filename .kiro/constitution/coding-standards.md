# Coding Standards

## Principles

- Prefer clear, boring code over clever abstractions.
- Match existing naming, file layout, and patterns in the repository.
- Keep diffs focused: no drive-by refactors unrelated to the task.
- Avoid duplicating logic; extract shared helpers only when reuse is real.
- Do not leave dead code, commented-out blocks, or unused imports.
- Prefer small, reviewable commits and PRs.

## Style

- Follow the project's formatter/linter configuration; do not fight it.
- Use TypeScript/JSDoc types where the project already does; do not invent a parallel type system.
- Names should describe domain meaning (task, timesheet, department), not technical noise.
- Comments explain non-obvious intent, not what the code already says.

## Dependencies

- Prefer existing stack libraries over adding new ones.
- New dependencies require a clear reason and fit with `project/dependencies.md`.
