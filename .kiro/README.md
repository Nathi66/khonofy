# Khonofy AI Engineering Operating System (AEOS)

Knowledge belongs in **Specifications**. Behavior belongs in **Skills**. Orchestration belongs in **Workflows**. Standards belong in the **Constitution**.

```
.kiro/
├── constitution/   # Portable engineering law (project-agnostic)
├── specs/          # Source of truth for product knowledge
├── project/        # Implementation decisions for this repo
├── skills/         # Role contracts (HOW, not WHAT)
├── workflows/      # Multi-step engineering pipelines
├── hooks/          # Automated engineering procedures
├── templates/      # Standard document shapes
└── memory/         # Durable learnings over time
```

## Layer responsibilities

| Layer | Owns | Does not own |
|-------|------|----------------|
| Constitution | Coding, security, testing, DoD standards | Khonofy business rules |
| Specs | Product knowledge, roles, APIs, domain rules | How an agent codes |
| Project | Stack, folders, patterns used here | Product requirements |
| Skills | Role behavior and process | Business rules (reference specs) |
| Workflows | Order of work across skills | Domain facts |
| Hooks | Build/preview/commit automation steps | Feature design |
| Templates | Empty document shapes | Filled product content |
| Memory | Bugs, ADRs, debt, lessons | Canonical rules (those stay in specs) |

## Agent entry

Cursor agents start at repo-root `AGENTS.md` and `.cursor/rules/aeos.mdc`. Thin skills under `.cursor/skills/<role>/` load the full contracts in `.kiro/skills/<role>/SKILL.md`.

## Verbose mode

Set `AEOS_VERBOSE=true` to expose reasoning and handoffs (Task → Workflow → Specs → Skills → Constitution → Pipeline → Current Agent → Outputs → Next Agent → Loop Verification → Completed). See `project/verbose-mode.md` and `templates/verbose-trace.md`.

## Engineering Council

`workflows/engineering-council.md`: before coding, gather structured input from relevant engineers (PM, Architect, FE/BE/DB, QA, Security, Performance, …). Loop Engineer summarizes, resolves conflicts, and recommends the implementation plan. Template: `templates/council-review.md`.

## Daily cycle

`workflows/daily-cycle.md`: morning review → sprint planning → Engineering Council → implement one feature through the full pipeline → Loop Engineer verification (close or reassign).

## Changing business rules

Update the relevant file under `specs/` once. Skills and code must reference that specification—never hardcode the rule in a skill or prompt file.
