# Hook: Before Commit

## Steps

1. Review diff for secrets (`.env`, tokens, passwords).
2. Run `npm run lint`.
3. Run `npm run typecheck` if JS/TS touched.
4. Ensure spec updates accompany behavior changes.
5. Stage only intentional files.

## Failure

Do not commit until lint/typecheck and secret scan are clean.
