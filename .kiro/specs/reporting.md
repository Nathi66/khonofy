# Reporting

## Admin / Superuser Reports (`/admin-reports`)

Date-range reporting on:

- Approved vs pending hours
- Task completion
- Active staff
- Hours by department
- Weekly trends
- Department breakdowns

## Hours vs Estimates (`/dept-summary`)

Per-member comparison of logged hours vs sum of assigned task estimates, with over / under / on-target variance and “over budget” counts.

Intended for department heads with a `department_id` / `departmentId`. Superuser may use when department is set.

## Weekly Progress (`/weekly-progress`)

Shared progress view for the current week:

- Hours-by-day
- Sheet status
- Role-appropriate team metrics (e.g. missing entry days for staff; draft/rejected counts and approval rate for managers)

## Tags

Admin/superuser CRUD at `/tags` for filtering and reporting categories.
