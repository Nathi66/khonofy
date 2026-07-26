# Hook: After Build

## Steps

1. Confirm `npm run build` exited 0.
2. Verify `dist/` (or configured Vite outDir) exists.
3. Note build warnings that should become debt in `memory/technical-debt.md` if systemic.

## Failure

Treat non-zero exit as release blocker.
