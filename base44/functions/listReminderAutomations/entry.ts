import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || (user.role !== 'admin' && user.role !== 'superuser')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Return the known reminder automations with their schedules
    const automations = [
      {
        id: 'teams',
        name: 'Teams Timesheet Reminder',
        description: 'Posts a weekly timesheet reminder to all Microsoft Teams channels',
        channel: 'Microsoft Teams',
        function_name: 'teamsTimesheetReminder',
        schedule: 'Every Friday at 3:00 PM UTC',
        cron_expression: '0 15 * * 5',
        icon: 'teams',
      },
      {
        id: 'outlook',
        name: 'Outlook Timesheet Reminder',
        description: 'Emails every staff member a timesheet reminder via Outlook',
        channel: 'Outlook Email',
        function_name: 'outlookTimesheetReminder',
        schedule: 'Every Friday at 3:00 PM UTC',
        cron_expression: '0 15 * * 5',
        icon: 'outlook',
      },
      {
        id: 'email',
        name: 'Email Timesheet Reminder',
        description: 'Sends email reminders to staff who haven\'t submitted their weekly timesheet',
        channel: 'Email',
        function_name: 'timesheetReminder',
        schedule: 'Every Friday at 3:00 PM UTC',
        cron_expression: '0 15 * * 5',
        icon: 'email',
      },
    ];

    return Response.json({ automations });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});