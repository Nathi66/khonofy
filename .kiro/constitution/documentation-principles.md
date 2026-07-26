# Documentation Principles

## Where knowledge lives

- Product and domain knowledge → `specs/`
- Implementation decisions → `project/`
- Durable lessons and debt → `memory/`
- Role behavior → `skills/`
- Process order → `workflows/`

## Rules

- Do not invent a parallel “prompt file” that duplicates specs.
- When behavior changes, update the owning specification in the same change.
- Prefer links and references over copying the same rule into multiple docs.
- Keep docs concise; agents and humans share the same context budget.
- Verbose traces cite paths; they do not dump full specifications into chat (see `project/verbose-mode.md`).
