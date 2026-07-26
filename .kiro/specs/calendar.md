# Calendar and Time Logging

## Purpose

Staff log hours against tasks on a given date, including from a week grid.

## Time entry fields

- taskId / taskTitle
- userId / userName (must be self for staff)
- date
- startHour (optional; used from calendar)
- hours (required)
- description
- tagId / tagName / tagColor
- timesheetId (optional link)
- departmentId

## Surfaces

### Daily Task Log (`/daily-log`)

- Active assigned tasks with logged vs estimated hours.
- Single-entry logging (date, hours, tag, description).
- Optional save-as-template.
- Bulk logging across multiple tasks.
- Quick status updates and recent entry history.

### Calendar (`/calendar`)

- Week grid (Mon–Sun × hours).
- Click a slot to log time with a start hour, or add entries manually.
- Supports templates, tags, and week navigation.

### Task templates

Personal shortcuts (`TaskTemplate`) for logging: title, description, tag, estimatedHours.

## Rules

- Staff create time entries only for themselves.
- Tags come from admin/superuser-managed Tag catalog.
