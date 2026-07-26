# Timesheets

## Purpose

Weekly work submission and review.

## Week definition

- Week starts **Monday**
- Week ends **Sunday**

`weekStart` and `weekEnd` on the Timesheet model represent this window.

## Status lifecycle

`draft` → `pending` → `approved` | `rejected`

Rejected sheets may return to an editable state for correction and resubmission (`draft` or `rejected` may be edited/resubmitted per product behavior).

## Business rules

1. Submit requires **more than 0 hours** for that week.
2. Sheets already `pending` or `approved` cannot be submitted again.
3. Pending sheets cannot be freely changed by staff as a new submission while pending.
4. Rejected sheets may be edited; staff see admin notes and can resubmit.
5. Admin (department) approves or rejects; rejection may include notes (`adminNotes`).
6. Audit every submit / approve / reject action via ActivityLog.
7. Staff can only create timesheets for themselves.

## UI

- Staff: `/timesheets` (My Timesheets) — week picker, day-by-day breakdown, submit, rejection notes, history.
- Admin: `/timesheets/review` — tabs pending / approved / rejected / all; expand for entries; approve/reject.

## Related

- Time entries: logged hours roll into the weekly total.
- Calendar and Daily Task Log feed the same TimeEntry records.
