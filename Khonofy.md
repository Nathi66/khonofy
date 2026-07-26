# Khonofy

**Khonofy** is a department-scoped time and task tracking platform for teams. It helps staff log daily work against assigned tasks, submit weekly timesheets, and gives managers the tools to assign work, approve hours, and compare actual effort to estimates.

Tagline in the product: *Smart time tracking, task management & reporting for teams.*

---

## Purpose

Khonofy is built for teams that need a clear weekly rhythm around work:

1. **Managers assign** tasks with priorities, due dates, and hour estimates.
2. **Staff log** time day by day (or in bulk / on a calendar).
3. **Staff submit** a Monday–Sunday timesheet for review.
4. **Admins approve or reject** submissions, optionally with notes.
5. **Leadership reports** on hours, completion, and estimate vs actual.

The main organizational boundary is the **department**. Admins typically see and manage only their department; superusers have organization-wide visibility.

---

## Who it’s for

| Role | Intended user | Focus |
|------|---------------|--------|
| **Staff** | Individual contributors | Log time, update own tasks, submit timesheets |
| **Admin** | Department heads / team leads | Assign tasks, review timesheets, monitor the team |
| **Superuser** | Org operators | Global dashboards, audit trail, departments & users |

New self-registrations are created as **staff**. Roles and department membership are assigned by seed data or superuser administration.

---

## Core concepts

### Tasks
Work items assigned to people in a department. Each task can include title, description, due date, priority (`low` / `medium` / `high` / `urgent`), status (`todo` / `in_progress` / `completed` / `blocked`), assignee, and **estimated hours**.

### Time entries
Individual logs of hours against a task on a given date. Entries can include a description, optional tag, and (from the calendar) a start hour. Cumulative logged hours are shown against each task’s estimate.

### Timesheets
Weekly rollups (Monday–Sunday). Staff submit when the week has hours logged; status moves through `draft` → `pending` → `approved` or `rejected`. Rejected sheets can be corrected and resubmitted.

### Tags
Labels applied when logging time (e.g. project type or work category), with name and color for filtering and reporting.

### Departments
Teams that group users, tasks, and timesheets. Admin scope is primarily department-based.

### Activity log
An audit trail of important actions (task changes, time logging, timesheet submit/approve/reject, profile updates).

---

## End-to-end workflow

```
Admin creates a task (assignee + estimate)
        ↓
Staff logs time (daily log, bulk, or calendar)
        ↓
Staff opens My Timesheets for the Mon–Sun week
        ↓
Submit → status becomes pending
        ↓
Admin reviews → approve, or reject with notes
        ↓
If rejected → staff adjusts logs and resubmits
```

**Business rules worth knowing:**

- A timesheet week is always **Monday–Sunday**.
- Submit requires **more than 0 hours** for that week.
- Sheets already `pending` or `approved` cannot be submitted again.
- Staff can only create time entries and timesheets for themselves.
- After rejection, staff see admin notes and can resubmit once the sheet is `draft` or `rejected` again.

---

## Features by area

### Dashboards (role-specific)
- **Staff — My Dashboard:** Hours today, open/completed tasks, timesheet status, active tasks, recent sheets, weekly progress snapshot.
- **Admin — Team Dashboard:** Team size, open tasks, pending approval alerts, task-status charts, recent submissions awaiting review.
- **Superuser — Global Dashboard:** Staff and department counts, approved hours, pending approvals, org-level charts, recent activity linking into the audit trail.

### Daily Task Log
Staff view of assigned active tasks with logged vs estimated hours. Supports single-entry logging (date, hours, tag, description), optional save-as-template, bulk logging across multiple tasks, and quick status updates with a short history of recent entries.

### Calendar
Week grid (Mon–Sun × hours). Staff click a slot to log time with a start hour, or add entries manually. Supports templates, tags, and week navigation.

### Task Management
Admin tooling to create, edit, search, and filter tasks; assign to department staff; set priority, status, due date, and estimated hours. Assignees can update their own task status; creating tasks is restricted to admin/superuser.

### My Timesheets
Staff week picker with day-by-day breakdown, submit action, rejection notes when applicable, and a history of past sheets.

### Timesheet Review
Admin inbox for team sheets with tabs for pending / approved / rejected / all. Expand a sheet to see linked time entries; approve or reject (with optional reason).

### Team Management
Department roster with per-member open/completed tasks, approved hours, latest timesheet status, and completion indicators.

### Weekly Progress
Shared progress view for the current week: hours-by-day, sheet status, and role-appropriate team metrics (e.g. missing entry days for staff; draft/rejected counts and approval rate for managers).

### Tag Management
Admin/superuser CRUD for tags used when logging time.

### Reports
Date-range reporting on approved vs pending hours, task completion, active staff, hours by department, weekly trends, and department breakdowns.

### Hours vs Estimates (Dept Head Summary)
Per-member comparison of logged hours vs sum of assigned task estimates, with over / under / on-target variance and “over budget” counts. Intended for department heads with a `department_id`.

### Reminders
UI for sending timesheet reminders via Microsoft Teams, Outlook, or email, and for viewing scheduled automations (documented schedule: Fridays 15:00 UTC). Implemented as Base44 cloud functions with Microsoft Graph / email connectors.

### Audit Trail
Superuser view of recent activity (searchable, filterable by entity type)—task create/update/delete, time logged, timesheet lifecycle, profile updates.

### Profile & theme
View name, email, role, and department; edit phone. Light/dark theme toggle is available app-wide.

### Authentication
Email/password login, registration (staff), forgot/reset password (reset tokens with optional SMTP; reset URL is also available via backend logs in development). Routes are protected; unauthenticated users are sent to login.

---

## Role access (summary)

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

Sidebar navigation is role-specific; some broader API capabilities for superuser are not mirrored as primary nav items (task management, timesheet review, team management).

---

## Data model (high level)

| Entity | Role in the product |
|--------|---------------------|
| **User** | Account, role, department, contact info |
| **Department** | Team boundary; optional admin link |
| **Task** | Assigned work with estimate and status |
| **TimeEntry** | Hours logged against a task on a date |
| **Timesheet** | Weekly submission with status and review metadata |
| **Tag** | Categorization for time entries |
| **TaskTemplate** | Personal shortcuts for logging |
| **ActivityLog** | Audit / activity history |

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, Vite, React Router, TanStack Query, Tailwind CSS, shadcn/Radix UI, Recharts |
| Backend | Express, JWT auth, Zod validation |
| Database | PostgreSQL via Prisma |
| Client API | Local REST API behind a Base44-shaped client facade (`base44` entity helpers) |
| Cloud automation | Base44 Deno functions for Teams / Outlook / email timesheet reminders |

Local development typically runs frontend and backend together (`npm run dev` from the app package): Vite on port **5173**, API on **3001**, with `/api` proxied to the backend.

---

## Demo accounts

After backend migrate + seed:

| Role | Name | Email | Password |
|------|------|-------|----------|
| Superuser | Luis | `luis@khonofy.local` | `Demo123!` |
| Admin | John | `john@khonofy.local` | `Demo123!` |
| Staff | Nathii | `nathii@khonofy.local` | `Demo123!` |

Seeded into the **Operations** department. Re-running the seed resets these demo passwords.

---

## Project layout

```
Khonofy/
└── khonofy/                 # Application package
    ├── src/                 # React frontend (pages, components, API client)
    ├── backend/             # Express + Prisma API
    └── base44/              # Entity defs & reminder cloud functions
```

---

## In short

Khonofy is a **weekly time-and-task system** for department teams: assign work with estimates, log hours against tasks, submit timesheets, approve them, and report on delivery versus plan—with role-appropriate dashboards for staff, admins, and org-level superusers.
