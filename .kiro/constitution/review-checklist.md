# Review Checklist

## Product fidelity

- [ ] Behavior matches `specs/` (not inventing rules)
- [ ] Permissions match `specs/roles-permissions.md`
- [ ] Domain edge cases covered (submit, reject, scope)

## Code quality

- [ ] No duplicated business logic
- [ ] Follows `project/coding-patterns.md` and folder structure
- [ ] Errors handled consistently
- [ ] No unnecessary dependencies

## Safety

- [ ] Authz enforced server-side
- [ ] No secrets or unsafe logging
- [ ] Migrations present for schema changes
- [ ] Breaking changes have a migration plan

## Quality gates

- [ ] Lint / typecheck / build considered
- [ ] Tests present or justified
- [ ] A11y for interactive UI
- [ ] Docs/specs updated with the change
