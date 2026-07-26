# Agents — Khonofy AEOS

This repository uses an **AI Engineering Operating System** under `.kiro/`.

## Principles

1. **Knowledge** belongs in `.kiro/specs/`
2. **Behavior** belongs in `.kiro/skills/`
3. **Orchestration** belongs in `.kiro/workflows/`
4. **Standards** belong in `.kiro/constitution/`
5. **Implementation decisions** belong in `.kiro/project/`
6. **Durable learnings** belong in `.kiro/memory/`

## Before any implementation

1. Read `.kiro/constitution/engineering-constitution.md` and `definition-of-done.md`.
2. Read the relevant files under `.kiro/specs/` (never invent business rules).
3. Read `.kiro/project/` for stack and patterns.
4. Load the matching role via `.cursor/skills/<role>/` (thin loader → `.kiro/skills/<role>/SKILL.md`).
5. For multi-step work, follow a workflow under `.kiro/workflows/`.
6. For non-trivial features/changes, run **Engineering Council** (`.kiro/workflows/engineering-council.md`) **before code**—gather seat input, then Loop summarizes and recommends a plan.
7. Use **Loop Engineer** for council facilitation, build/test/preview fix loops. Loop never edits business rules.

## Verbose mode (`AEOS_VERBOSE=true`)

When enabled (env or user message), every request must expose the engineering organization at work—not only final code.

Protocol: [`.kiro/project/verbose-mode.md`](.kiro/project/verbose-mode.md)  
Template: [`.kiro/templates/verbose-trace.md`](.kiro/templates/verbose-trace.md)

Emit: Task → Selected Workflow → Loaded Specifications → Loaded Skills → Loaded Constitution → Agent Pipeline → Current Agent → Outputs → Next Agent → Loop Verification → Completed.

Loop Engineer owns the top-level trace on multi-agent runs; each specialist adds a Current Agent block on handoff.

## Engineering Council

Before coding non-trivial work, run [`.kiro/workflows/engineering-council.md`](.kiro/workflows/engineering-council.md) and fill [`.kiro/templates/council-review.md`](.kiro/templates/council-review.md).

Seats (as relevant): Product Manager, BA, Solution Architect, Frontend, Backend, Database, QA, Security, Performance → **Loop Engineer** summarizes, resolves conflicts, recommends go / go-with-conditions / no-go and the implementation plan. **No code** until approved.

## Daily development cycle

Prefer [`.kiro/workflows/daily-cycle.md`](.kiro/workflows/daily-cycle.md):

1. **Morning review** — engineering review + prioritized backlog (`morning-review.md`)
2. **Sprint planning** — Product Manager locks the next slice (`sprint-planning.md`)
3. **Engineering Council** — collaborative review before code (`engineering-council.md`)
4. **Implementation** — one feature through the full AEOS pipeline
5. **Verification** — Loop Engineer builds, tests, previews; closes or reassigns

## Changing product rules

Update the owning specification (e.g. week bounds → `.kiro/specs/timesheets.md`). Skills must only reference specs.

## Human index

[Khonofy.md](Khonofy.md) points at specs; it is not a second source of truth.

## Dual skills

| Layer | Path | Role |
|-------|------|------|
| Cursor discovery | `.cursor/skills/<role>/SKILL.md` | Thin loader + triggers |
| AEOS contract | `.kiro/skills/<role>/SKILL.md` | Full identity/process |

Do not duplicate domain knowledge into Cursor skill bodies.
