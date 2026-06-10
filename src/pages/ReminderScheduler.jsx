import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import {
  Bell, Send, Clock, Loader2,
  CalendarDays, MessageSquare, Mail, BadgeCheck
} from 'lucide-react';
import { toast } from 'sonner';

function AutomationCard({ automation, onTrigger, triggering }) {
  const isTeams = automation.icon === 'teams';
  const isOutlook = automation.icon === 'outlook';
  const isBusy = triggering === automation.id;

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 p-2 rounded-lg ${isTeams ? 'bg-purple-100 text-purple-600' : isOutlook ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {isTeams ? <MessageSquare className="w-5 h-5" /> : isOutlook ? <Mail className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{automation.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{automation.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {automation.schedule}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <BadgeCheck className="w-3 h-3" />
              {automation.channel}
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2"
        disabled={!!isBusy}
        onClick={() => onTrigger(automation)}
      >
        {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Send Now
      </Button>
    </div>
  );
}

export default function ReminderScheduler() {
  const { data: user } = useCurrentUser();
  const [triggering, setTriggering] = useState(null);

  const { data: automations = [], isLoading } = useQuery({
    queryKey: ['reminder-automations'],
    queryFn: async () => {
      const resp = await base44.functions.invoke('listReminderAutomations', {});
      return resp.data?.automations || [];
    },
    refetchOnWindowFocus: false,
  });

  const handleTrigger = async (automation) => {
    setTriggering(automation.id);
    try {
      await toast.promise(
        base44.functions.invoke(automation.function_name, {}),
        {
          loading: `Sending via ${automation.channel}...`,
          success: `${automation.name} sent successfully!`,
          error: `Failed to send ${automation.name}`,
        }
      );
    } catch (e) {
      toast.error(e.message);
    } finally {
      setTriggering(null);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'superuser')) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground mt-2">Only admins and superusers can manage reminders.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Timesheet Reminders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Schedule automatic reminders to staff via Teams, Outlook, and Email
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Quick Actions — Send Now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
            onClick={() => handleTrigger({ id: 'teams-quick', name: 'Teams Reminder', channel: 'Microsoft Teams', function_name: 'teamsTimesheetReminder' })}
            disabled={triggering === 'teams-quick'}
          >
            {triggering === 'teams-quick' ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            Teams
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleTrigger({ id: 'outlook-quick', name: 'Outlook Reminder', channel: 'Outlook Email', function_name: 'outlookTimesheetReminder' })}
            disabled={triggering === 'outlook-quick'}
          >
            {triggering === 'outlook-quick' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Outlook
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleTrigger({ id: 'email-quick', name: 'Email Reminder', channel: 'Email', function_name: 'timesheetReminder' })}
            disabled={triggering === 'email-quick'}
          >
            {triggering === 'email-quick' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
            Email
          </Button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Scheduled Automations
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {automations.map((a) => (
              <AutomationCard
                key={a.id}
                automation={a}
                onTrigger={handleTrigger}
                triggering={triggering}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-2">How It Works</h2>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Reminders are automatically sent every <strong>Friday at 3:00 PM UTC</strong></li>
          <li><strong>Teams</strong> — posted to all Microsoft Teams channels</li>
          <li><strong>Outlook</strong> — emailed to every staff member</li>
          <li><strong>Email</strong> — sent only to staff who haven't submitted their timesheet yet</li>
          <li>Use the <strong>Send Now</strong> buttons to trigger reminders manually at any time</li>
        </ol>
      </div>
    </div>
  );
}