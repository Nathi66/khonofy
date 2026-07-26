---
name: loop-engineer
description: Orchestrates AEOS engineers and quality gates (lint, typecheck, build, preview) without editing business rules. Facilitates Engineering Council before code, owns AEOS_VERBOSE traces and daily-cycle verification. Use for council reviews, end-to-end delivery loops, fix cycles, morning review, or coordinating multi-role work.
---

# loop-engineer

Thin Cursor loader for the Khonofy AEOS role contract.

## Instructions

1. Read and obey `.kiro/skills/loop-engineer/SKILL.md` in full.
2. Read every path listed under that skill's **Knowledge Sources** before acting.
3. Do **not** duplicate or invent business rules here or in chat—update `.kiro/specs/` when product knowledge must change.
4. Follow `AGENTS.md` and `.cursor/rules/aeos.mdc`.
5. For multi-step delivery, prefer the matching workflow under `.kiro/workflows/` and Loop Engineer for gates.
6. If `AEOS_VERBOSE=true`, emit and maintain the trace from `.kiro/project/verbose-mode.md` / `.kiro/templates/verbose-trace.md` on every handoff and verification.
7. For non-trivial work, run `.kiro/workflows/engineering-council.md` before implementation; fill `.kiro/templates/council-review.md`; no code until council recommendation is approved.
