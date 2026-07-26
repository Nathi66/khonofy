# Business Rules (Index)

Canonical domain rules live in the domain specs below. This file indexes cross-cutting rules and pointers.

## Cross-cutting

1. Department is the primary organizational boundary for admin scope.
2. Activity log records important actions (task changes, time logging, timesheet lifecycle, profile updates).
3. Self-registration always creates `staff` role.
4. Staff can only create time entries and timesheets for themselves.

## Domain pointers

| Domain | Spec |
|--------|------|
| Timesheets | `timesheets.md` |
| Tasks | `task-management.md` |
| Calendar / logging | `calendar.md` |
| Reporting | `reporting.md` |
| Dashboards | `dashboards.md` |
| Auth | `authentication.md` |
| Notifications | `notifications.md` |
| Roles | `roles-permissions.md` |

## Change policy

When a business rule changes (e.g. week start day), update the **owning domain spec** only. Do not duplicate the rule into skills.
