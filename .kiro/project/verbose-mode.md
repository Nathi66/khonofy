# AEOS Verbose Mode

Expose the engineering organization at work: reasoning, loaded knowledge, handoffs, and verification—not only final code.

## Enable

Set any of:

- Environment: `AEOS_VERBOSE=true`
- User message includes `AEOS_VERBOSE=true` or “verbose AEOS”
- Default for multi-step workflows when the user asks to “show handoffs” / “show the pipeline”

When unset/false, agents may stay concise. When enabled, emit a **verbose trace** at the start of work, on every handoff, and at completion.

## Trace shape (required when enabled)

Use the structure in `.kiro/templates/verbose-trace.md`. Minimum pipeline:

```
Task
↓
Selected Workflow
↓
Loaded Specifications
↓
Loaded Skills
↓
Loaded Constitution
↓
Agent Pipeline
↓
Current Agent
↓
Outputs
↓
Next Agent
↓
Loop Verification
↓
Completed
```

## What to show at each step

| Step | Content |
|------|---------|
| Task | User ask, restated goal, constraints |
| Selected Workflow | Path under `.kiro/workflows/` + why chosen |
| Loaded Specifications | Exact `.kiro/specs/*` paths read (and why) |
| Loaded Skills | Exact `.kiro/skills/<role>/` loaded |
| Loaded Constitution | Constitution files that apply (DoD, security, etc.) |
| Agent Pipeline | Ordered role list for this run |
| Current Agent | Active role + one-line mission for this step |
| Reasoning | Why this agent acts now; decisions; spec citations |
| Outputs | Artifacts produced (files, spec edits, test results) |
| Next Agent | Who consumes the outputs; handoff checklist |
| Loop Verification | lint / typecheck / build / tests / preview / health |
| Completed | DoD status, open follow-ups, memory updates |

## Engineering Council (pre-code)

When running `.kiro/workflows/engineering-council.md`, extend the trace with a **Council Seats** phase: each seat is a Current Agent block (stance, findings, risks). Loop then emits **Council Recommendation** before any implementation pipeline. Use `.kiro/templates/council-review.md`.

## Rules

1. Verbose mode **never** invents business rules—it only narrates references to specs.
2. Traces cite paths; they do not paste entire specs into the chat.
3. Loop Engineer owns the top-level trace for multi-agent runs; each specialist adds a **Current Agent** block when they act.
4. On reassignment after failure, append a new cycle: failure → logs → next agent → retry.
5. Keep traces scannable: short bullets, paths, statuses (`pending` / `in_progress` / `done` / `failed`).
6. Council phase is read/assess only—verbose traces must not imply code was written.

## Example (abbreviated)

```markdown
## AEOS Trace
- **Task:** Fix timesheet submit disabled with 0 hours
- **Workflow:** `.kiro/workflows/bug-fix.md`
- **Specs:** `timesheets.md`, `roles-permissions.md`, `user-flows.md`
- **Skills:** `loop-engineer` → `frontend-engineer` → `qa-engineer`
- **Constitution:** `definition-of-done.md`, `testing-principles.md`
- **Current Agent:** Frontend Engineer — enforce submit rule from timesheets spec
- **Outputs:** `src/pages/TimesheetManagement.jsx` (guard >0 hours)
- **Next Agent:** QA Engineer
- **Loop Verification:** pending
```
