import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2, Clock3, Users } from 'lucide-react';
import WeeklyProgressSummary from '@/components/WeeklyProgressSummary';

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

export default function WeeklyProgress() {
  const { data: user } = useCurrentUser();
  const week = getWeekBounds();
  const role = user?.role || 'staff';
  const isAdmin = role === 'admin' || role === 'superuser';

  const { data: tasks = [] } = useQuery({
    queryKey: ['weeklyProgressTasks', user?.id, user?.department_id, role],
    queryFn: () => {
      if (!user) return [];
      if (role === 'superuser') return base44.entities.Task.list();
      if (isAdmin && user.department_id) return base44.entities.Task.filter({ department_id: user.department_id });
      return base44.entities.Task.filter({ assigned_to: user.id });
    },
    enabled: !!user,
  });

  const { data: timeEntries = [] } = useQuery({
    queryKey: ['weeklyProgressEntries', user?.id, user?.department_id, role],
    queryFn: async () => {
      if (!user) return [];
      if (role === 'superuser') return base44.entities.TimeEntry.list();
      if (isAdmin && user.department_id) return base44.entities.TimeEntry.filter({ department_id: user.department_id });
      return base44.entities.TimeEntry.filter({ user_id: user.id });
    },
    enabled: !!user,
  });

  const { data: timesheets = [] } = useQuery({
    queryKey: ['weeklyProgressTimesheets', user?.id, user?.department_id, role],
    queryFn: () => {
      if (!user) return [];
      if (role === 'superuser') return base44.entities.Timesheet.list();
      if (isAdmin && user.department_id) return base44.entities.Timesheet.filter({ department_id: user.department_id });
      return base44.entities.Timesheet.filter({ user_id: user.id });
    },
    enabled: !!user,
  });

  const summary = useMemo(() => {
    if (!user) return {};
    const weekEntries = timeEntries.filter((entry) => entry.date >= week.start && entry.date <= week.end);
    const weekTasks = tasks;
    const sheet = timesheets.find((ts) => ts.week_start === week.start);
    const hoursLogged = weekEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
    const activeItems = isAdmin
      ? weekTasks.filter((task) => task.status !== 'completed').length
      : weekTasks.filter((task) => task.status !== 'completed').length;
    const openTasks = weekTasks.filter((task) => task.status !== 'completed').length;
    const completedTasks = weekTasks.filter((task) => task.status === 'completed').length;
    const missingItems = isAdmin
      ? timesheets.filter((ts) => ts.status === 'draft' || ts.status === 'rejected').length
      : Math.max(0, 5 - new Set(weekEntries.map((entry) => entry.date)).size);
    const completionRate = isAdmin
      ? (timesheets.length ? (timesheets.filter((ts) => ts.status === 'approved').length / timesheets.length) * 100 : 0)
      : (openTasks + completedTasks ? (completedTasks / (openTasks + completedTasks)) * 100 : 0);

    return {
      hoursLogged,
      timesheetStatus: sheet?.status || 'draft',
      activeItems,
      openTasks,
      completedTasks,
      missingItems,
      completionRate,
    };
  }, [user, timeEntries, tasks, timesheets, week.start, isAdmin]);

  const weekEntries = timeEntries.filter((entry) => entry.date >= week.start && entry.date <= week.end);
  const weekHoursByDay = weekEntries.reduce((acc, entry) => {
    acc[entry.date] = (acc[entry.date] || 0) + (entry.hours || 0);
    return acc;
  }, {});

  const dayLabels = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(week.start);
    date.setDate(date.getDate() + index);
    const dateStr = date.toISOString().split('T')[0];
    return {
      date: dateStr,
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      hours: weekHoursByDay[dateStr] || 0,
    };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-3">Weekly Work Progress</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin ? 'Monitor your team's weekly progress and submission readiness.' : 'Track your weekly work progress and timesheet readiness.'}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <p className="text-muted-foreground text-xs">Current week</p>
          <p className="font-semibold text-foreground">
            {new Date(week.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(week.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <WeeklyProgressSummary role={role} summary={summary} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-primary" />
              Weekly Hours by Day
            </h2>
          </div>
          <div className="space-y-3">
            {dayLabels.map((day) => (
              <div key={day.date} className="flex items-center gap-3">
                <div className="w-28 text-xs text-muted-foreground">{day.label}</div>
                <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, (day.hours / 10) * 100)}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium text-foreground">{day.hours.toFixed(1)}h</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-primary" />
            Weekly Status
          </h2>
          <div className="space-y-3 text-sm">
            <StatusLine label={isAdmin ? 'Pending submissions' : 'Missing entry days'} value={summary.missingItems || 0} />
            <StatusLine label={isAdmin ? 'Open tasks in team' : 'Open tasks'} value={summary.openTasks || 0} />
            <StatusLine label={isAdmin ? 'Completed team tasks' : 'Completed tasks'} value={summary.completedTasks || 0} />
            <StatusLine label="Timesheet status" value={summary.timesheetStatus || 'draft'} />
          </div>
          <div className="mt-5 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
            {isAdmin ? (
              <>
                <Users className="w-4 h-4 inline-block mr-2" />
                Use this view to spot who needs reminders, where work is blocked, and whether team output is balanced.
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
                Use this view to make sure your week is complete before submitting your timesheet.
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusLine({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
