# Roles and Permissions

Roles: `staff` | `admin` | `superuser` (Prisma `UserRole`).

## Capability matrix

| Capability | Staff | Admin | Superuser |
|------------|:-----:|:-----:|:---------:|
| Log time / use calendar | Yes | — | — |
| Submit timesheets | Yes | — | — |
| Approve / reject timesheets | — | Yes (dept) | API-level |
| Create & manage tasks | — | Yes (dept) | API-level |
| Manage tags | — | Yes | Yes |
| Team overview | — | Yes | — |
| Hours vs estimates | — | Yes | If dept set |
| Org reports | — | Yes | Yes |
| Audit trail | — | — | Yes |
| Manage departments / users | — | — | Yes |
| Reminders UI | — | Yes | Yes |

Sidebar navigation is role-specific. Some broader API capabilities for superuser are not mirrored as primary nav items (task management, timesheet review, team management).

## API scoping (authoritative for backend)

- **Superuser:** no department filter on list queries.
- **Admin:** resources scoped to `departmentId` when set (users, tasks, time entries, timesheets, activity logs).
- **Staff:** own records only for time entries, timesheets, task templates; tasks where `assignedTo` or `createdById` is self.
- **Task create:** admin or superuser only.
- **Time entry / timesheet create:** staff may only create for themselves (unless superuser).
- **Departments / users create:** superuser only.
- **Tags create:** admin or superuser.
- **Profile patch (`/api/auth/me`):** self; phone and fullName only.

Never hardcode divergent permission checks outside this specification.
