# User Flows

## Primary weekly rhythm

```
Admin creates a task (assignee + estimate)
        ↓
Staff logs time (daily log, bulk, or calendar)
        ↓
Staff opens My Timesheets for the week
        ↓
Submit → status becomes pending
        ↓
Admin reviews → approve, or reject with notes
        ↓
If rejected → staff adjusts logs and resubmits
```

## Authentication flow

1. Register (staff) or login with email/password.
2. Receive JWT access token; store client-side per project auth storage.
3. Access protected routes; unauthenticated users redirect to login.
4. Forgot password → reset token (1 hour) → reset password form.

## Admin review flow

1. Open Timesheet Review.
2. Filter by pending / approved / rejected / all.
3. Expand sheet; inspect linked time entries.
4. Approve, or reject with optional reason (`adminNotes`).

## Related

- Timesheet rules: `timesheets.md`
- Permissions: `roles-permissions.md`
