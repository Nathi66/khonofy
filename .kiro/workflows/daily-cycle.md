# Workflow: Daily Development Cycle

Stable-state daily loop for Khonofy AEOS.

```
Morning review
↓
Sprint planning
↓
Engineering Council (collaborative review — no code)
↓
Implementation (one feature through full pipeline)
↓
Verification (Loop Engineer)
↓
Close or reassign
```

## 1. Morning review

**Skills:** Loop Engineer (orchestrate), Product Manager, Business Analyst, QA (input), Documentation (debt notes)

**Actions:**

1. Read `.kiro/memory/known-bugs.md`, `technical-debt.md`, `future-features.md`, `lessons-learned.md`.
2. Scan open issues / unfinished work against `.kiro/specs/`.
3. Run a lightweight engineering review (spec drift, DoD gaps, failing gates if known).
4. Produce a **prioritized backlog** (P0/P1/P2) with owning domain specs cited.

**Outputs:** Backlog list in chat (and optionally `memory/future-features.md` promotions). Use verbose trace when `AEOS_VERBOSE=true`.

## 2. Sprint planning

**Skill:** Product Manager (primary), Business Analyst (rules clarity)

**Actions:**

1. Select next sprint slice from the prioritized backlog.
2. Confirm acceptance criteria against specs (update specs first if product intent changed).
3. Name the implementation workflow (`new-feature`, `bug-fix`, `database-change`, etc.).
4. Define the agent pipeline for the chosen item.

**Outputs:** Sprint goal, ordered backlog items for the day, selected workflow path(s).

## 3. Engineering Council

**Workflow:** `.kiro/workflows/engineering-council.md`  
**Template:** `.kiro/templates/council-review.md`

**Actions:**

1. Loop Engineer opens the council for the selected item (skip only if trivial or user waives).
2. Relevant seats assess value, architecture, UI, API, schema, QA, security, performance—**no code**.
3. Loop summarizes, resolves conflicts, recommends go / go-with-conditions / no-go and an implementation plan.
4. Proceed to implementation only after approval.

**Outputs:** Filled council review + recommended pipeline.

## 4. Implementation

**Skills:** Full pipeline per council recommendation / selected workflow (typically Architect → DB → Backend → Frontend → QA → Security as needed)

**Actions:**

1. Execute **one** feature or fix through the full AEOS pipeline.
2. Specs own knowledge; skills only reference them.
3. With verbose mode, emit handoffs at every agent transition.

**Outputs:** Code + spec updates + specialist outputs for Loop.

## 5. Verification

**Skill:** Loop Engineer

**Actions:**

1. Build, typecheck, lint, tests (per hooks / DoD).
2. Start preview (`before-preview` / `after-preview`).
3. Verify functionality against acceptance criteria and cited specs.
4. **Close** the task if DoD met; otherwise **reassign** to the responsible engineer with logs and a new verbose cycle.

**Outputs:** Gate table, pass/fail, reassignment or completion note; memory updates when durable.

## Verbose mode

For daily cycle runs, prefer `AEOS_VERBOSE=true` so morning backlog, sprint choices, and verification handoffs stay visible. See `.kiro/project/verbose-mode.md`.
