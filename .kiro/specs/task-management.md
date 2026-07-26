# Task Management

## Purpose

Work items assigned to people in a department, with estimates used for hours-vs-estimate reporting.

## Fields

- title (required)
- description
- dueDate
- priority: `low` | `medium` | `high` | `urgent` (default `medium`)
- status: `todo` | `in_progress` | `completed` | `blocked` (default `todo`)
- assignedTo / assignedToName
- departmentId
- estimatedHours
- createdById

## Rules

- Creating tasks is restricted to admin / superuser.
- Admin task management is department-scoped.
- Assignees can update their own task status.
- Cumulative logged hours are shown against each task’s estimate.
- Task create/update/delete should produce activity log entries.

## UI

- Route: `/tasks` (Task Management) — admin tooling to create, edit, search, filter, assign.
- Staff interact primarily via Daily Task Log and dashboards for assigned active tasks.
