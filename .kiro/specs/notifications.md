# Notifications and Reminders

## Purpose

Remind staff to submit timesheets via Microsoft Teams, Outlook, or email.

## UI

- Route: `/reminders` (Reminder Scheduler)
- Available to admin and superuser
- View scheduled automations; send reminders through configured channels

## Implementation note

Delivery is implemented as Base44 cloud functions with Microsoft Graph / email connectors under `base44/functions/`. Documented schedule example: Fridays 15:00 UTC.

Local Express API does not own reminder delivery; treat Base44 functions as the automation surface until replaced.
