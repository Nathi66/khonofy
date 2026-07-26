# Hook: Before PR

## Steps

1. Run before-commit checks.
2. Run `npm run build` if frontend affected.
3. Fill `templates/pr.md`.
4. Cite changed specs under `.kiro/specs/`.
5. Ensure migrations included for schema changes.
6. Push branch with tracking when creating the PR.
