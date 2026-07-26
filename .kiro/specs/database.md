# Database

## Stack

PostgreSQL via Prisma (`backend/prisma/schema.prisma`).

## Enums

- `UserRole`: superuser, admin, staff
- `TaskPriority`: low, medium, high, urgent
- `TaskStatus`: todo, in_progress, completed, blocked
- `TimesheetStatus`: draft, pending, approved, rejected

## Models (summary)

### User

id, email (unique), passwordHash, fullName, role (default staff), departmentId, phone, resetToken, resetTokenExpiresAt, timestamps

### Department

id, name, description, adminId, timestamps

### Task

id, title, description, dueDate, priority, status, assignedTo, assignedToName, departmentId, estimatedHours, createdById, timestamps

### TimeEntry

id, taskId, taskTitle, userId, userName, date, startHour, hours, description, tagId, tagName, tagColor, timesheetId, departmentId, timestamps

### Timesheet

id, userId, userName, departmentId, weekStart, weekEnd, status, totalHours, adminNotes, submittedAt, reviewedBy, reviewedByName, timestamps

### Tag

id, name, color, description, timestamps

### TaskTemplate

id, userId, title, description, tagId, tagName, tagColor, estimatedHours, timestamps

### ActivityLog

id, userId, userName, action, entityType, entityId, details, departmentId, createdAt

## Conventions

- IDs are `cuid()` strings
- Date-only semantics for task `dueDate`, time entry `date`, timesheet `weekStart`/`weekEnd`
- Schema changes require Prisma migrations (constitution rule 4)

## Demo seed

See backend README / seed: Operations department; Luis (superuser), John (admin), Nathii (staff); password `Demo123!`
