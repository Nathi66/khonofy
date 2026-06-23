import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, TrendingUp, Users } from 'lucide-react';

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export default function WeeklyProgressSummary({
  role = 'staff',
  summary,
  compact = false,
}) {
  const isAdmin = role === 'admin' || role === 'superuser';
  const completion = clampPercent(summary?.completionRate || 0);
  const progressLabel = isAdmin ? 'Team Progress' : 'My Progress';

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            {progressLabel}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Weekly view of time logged, tasks worked on, and timesheet readiness.
          </p>
        </div>
        <Link to="/weekly-progress" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
          View details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat icon={Clock3} label={isAdmin ? 'Team Hours' : 'Hours'} value={`${summary?.hoursLogged || 0.0}h`} />
        <MiniStat icon={CheckCircle2} label={isAdmin ? 'Completed Sheets' : 'Sheet Status'} value={summary?.timesheetStatus || 'draft'} />
        <MiniStat icon={TrendingUp} label="Completion" value={`${completion}%`} />
        <MiniStat icon={Users} label={isAdmin ? 'Staff Visible' : 'Active Tasks'} value={summary?.activeItems ?? 0} />
      </div>

      {!compact && (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Weekly completion</span>
              <span className="font-medium text-foreground">{completion}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <InfoPill label={isAdmin ? 'Pending submissions' : 'Missing days'} value={summary?.missingItems || 0} />
            <InfoPill label={isAdmin ? 'Overloaded users' : 'Open tasks'} value={summary?.openTasks || 0} />
            <InfoPill label={isAdmin ? 'At risk' : 'Tasks completed'} value={summary?.completedTasks || 0} />
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-muted/40 border border-border p-3">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground truncate">{value}</div>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-lg bg-muted/30 border border-border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  );
}
