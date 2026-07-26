# Workflow: Engineering Council

Collaborative decision-making **before any code changes**. Gather structured input from all relevant engineers, then let Loop Engineer summarize, resolve conflicts, and recommend an implementation plan.

This is not a coding pipeline. It is a design review that makes AEOS behave like an experienced engineering organization rather than isolated roles.

## When to run

- New features (default before `new-feature.md`)
- Cross-cutting changes (auth, schema, reporting, permissions)
- High-risk refactors or unclear product/tech trade-offs
- After sprint planning selects an item, **before** implementation
- On user request: “Engineering Council”, “council review”, “design review”

Skip for trivial typo/copy-only fixes unless the user asks.

## Hard rules

1. **No code changes** during council (except reading the codebase for assessment).
2. Members **cite specs**; they do not invent business rules. Gaps → BA/PM update specs first.
3. Each member speaks only for their discipline (see seat table).
4. Conflicts are recorded explicitly; Loop Engineer resolves or escalates to PM when product intent is unclear.
5. Prefer `AEOS_VERBOSE=true` so every seat’s input is visible.
6. Output uses `.kiro/templates/council-review.md`.

## Pipeline

```
Receive proposal (feature / change)
↓
Loop Engineer opens council + loads specs
↓
Product Manager — business value
↓
Business Analyst — rules clarity (if domain impact)
↓
Solution Architect — architectural fit
↓
Frontend Engineer — UI impact
↓
Backend Engineer — API / business logic
↓
Database Engineer — schema implications
↓
QA Engineer — testing needs
↓
Security Engineer — security concerns
↓
Performance Engineer — scalability
↓
(Optional) DevOps / Docker / Preview — ops impact
↓
Loop Engineer — summarize, resolve conflicts, recommend plan
↓
Gate: approve → implementation workflow | defer | reject
```

## Council seats

| Seat | Skill | Assesses |
|------|-------|----------|
| Product Manager | `product-manager` | Business value, priority, acceptance intent |
| Business Analyst | `business-analyst` | Spec completeness; which domain specs must change |
| Solution Architect | `solution-architect` | Fit with `architecture.md`, boundaries, sequencing |
| Frontend Engineer | `frontend-engineer` | UI surfaces, a11y, role-gated UX impact |
| Backend Engineer | `backend-engineer` | API, validation, server-side enforcement |
| Database Engineer | `database-engineer` | Schema, migrations, data risk |
| QA Engineer | `qa-engineer` | Test cases, edge cases from specs, regression scope |
| Security Engineer | `security-engineer` | Authn/authz, secrets, PII |
| Performance Engineer | `performance-engineer` | Load, query/list hotspots, caching concerns |
| Loop Engineer | `loop-engineer` | Facilitation, conflict resolution, implementation plan |

Optional seats when relevant: Documentation, DevOps, Docker, Preview.

## Per-seat output (required)

Each seated engineer produces a short block:

- **Stance:** support | support-with-conditions | oppose | abstain (not relevant)
- **Findings:** bullets with spec path citations
- **Risks / unknowns**
- **Conditions** (must be true before coding)
- **Estimated impact:** low | medium | high (discipline-local)

No implementation diffs.

## Loop Engineer summary (required)

After all seats:

1. Consolidate findings into themes.
2. List **conflicts** and **resolution** (or “needs PM decision”).
3. List **spec updates required before code**.
4. Recommend **go / go-with-conditions / no-go**.
5. Propose **implementation plan**: workflow path, ordered agent pipeline, DoD extras, test focus.
6. Hand off to the chosen implementation workflow only after approval (user or PM).

## Relationship to other workflows

```
morning-review / sprint-planning
        ↓
engineering-council   ← you are here (no code)
        ↓
new-feature | bug-fix | database-change | …
        ↓
Loop verification
```

`new-feature.md` should invoke this council unless the change is trivial or the user waives it.

## Verbose mode

When enabled, the council trace extends the standard AEOS trace with a **Council Seats** section (each Current Agent = one seat) before any implementation pipeline starts. See `.kiro/project/verbose-mode.md` and `.kiro/templates/council-review.md`.
