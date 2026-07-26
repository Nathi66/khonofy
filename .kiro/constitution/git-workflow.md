# Git Workflow

## Branching

- Create a focused branch per feature, fix, or refactor.
- Prefer small PRs that map to one workflow outcome.

## Commits

- Write clear messages that explain why.
- Do not commit secrets, `.env` files, or generated noise unless required and reviewed.
- Do not amend or force-push shared branches unless explicitly requested.

## Pull requests

- Use `templates/pr.md`.
- Summarize intent, link specs touched, and list test steps.
- Request review before merge when the change affects auth, schema, or shared APIs.

## Hooks (documented)

Follow `.kiro/hooks/before-commit.md` and `before-pr.md` before pushing or opening a PR.
