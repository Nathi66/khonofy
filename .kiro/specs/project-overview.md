# Project Overview

## Product

**Khonofy** is a department-scoped time and task tracking platform for teams.

Tagline: *Smart time tracking, task management & reporting for teams.*

## Purpose

Khonofy supports a clear weekly rhythm:

1. Managers assign tasks with priorities, due dates, and hour estimates.
2. Staff log time day by day (or in bulk / on a calendar).
3. Staff submit a weekly timesheet for review.
4. Admins approve or reject submissions, optionally with notes.
5. Leadership reports on hours, completion, and estimate vs actual.

## Organizational boundary

The main boundary is the **department**. Admins typically see and manage only their department; superusers have organization-wide visibility.

## Core entities

| Entity | Role |
|--------|------|
| User | Account, role, department, contact |
| Department | Team boundary |
| Task | Assigned work with estimate and status |
| TimeEntry | Hours logged against a task on a date |
| Timesheet | Weekly submission with review status |
| Tag | Categorization for time entries |
| TaskTemplate | Personal shortcuts for logging |
| ActivityLog | Audit / activity history |

## Related specs

- Personas: `personas.md`
- Permissions: `roles-permissions.md`
- Business rules index: `business-rules.md`
- User flows: `user-flows.md`
