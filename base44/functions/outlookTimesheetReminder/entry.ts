import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('outlook');

    // Fetch all users
    const users = await base44.asServiceRole.entities.User.list();
    const staffUsers = users.filter(u => u.role === 'staff' || u.role === 'user');

    // Get current week range
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const weekRange = `${fmt(monday)} – ${fmt(friday)}`;

    const results = [];

    for (const user of staffUsers) {
      if (!user.email) continue;

      const emailBody = {
        message: {
          subject: `⏰ Timesheet Reminder — Week of ${weekRange}`,
          body: {
            contentType: 'HTML',
            content: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #c10d00; padding: 24px; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 22px;">Khonofy — Timesheet Reminder</h1>
                </div>
                <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
                  <p style="font-size: 16px; color: #333;">Hi ${user.full_name || 'there'},</p>
                  <p style="color: #555;">This is a friendly reminder to <strong>submit your timesheet</strong> for the week of <strong>${weekRange}</strong> before end of day today (Friday).</p>
                  <p style="color: #555;">Please log in to Khonofy and navigate to <strong>My Timesheets</strong> to review and submit your hours.</p>
                  <p style="color: #888; font-size: 13px; margin-top: 32px;">— The Khonofy Team</p>
                </div>
              </div>
            `
          },
          toRecipients: [{ emailAddress: { address: user.email, name: user.full_name || user.email } }]
        },
        saveToSentItems: false
      };

      const res = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailBody)
      });

      if (!res.ok) {
        const err = await res.text();
        results.push({ email: user.email, status: 'error', error: err });
      } else {
        results.push({ email: user.email, status: 'sent' });
      }
    }

    return Response.json({ success: true, sent: results.filter(r => r.status === 'sent').length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});