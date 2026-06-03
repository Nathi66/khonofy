import { Badge } from '@/components/ui/badge';

function formatDateTime(value) {
  if (!value) return null;
  return new Date(value).toLocaleString();
}

export default function TimesheetEntriesPanel({ entries = [] }) {
  if (!entries.length) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
        No linked time entries found for this timesheet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{entry.task_title || 'Task'}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                {entry.start_at ? <span>{formatDateTime(entry.start_at)}</span> : null}
                {entry.end_at ? <span>to {formatDateTime(entry.end_at)}</span> : null}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">{entry.hours}h</p>
              {entry.billable ? (
                <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Billable
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {entry.project_name ? (
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                Project: {entry.project_name}
              </Badge>
            ) : null}
            {entry.client_name ? (
              <Badge variant="outline" className="border-border bg-muted/40">
                Client: {entry.client_name}
              </Badge>
            ) : null}
            {entry.tag_name ? (
              <span
                className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: entry.tag_color || '#6366f1' }}
              >
                Tag: {entry.tag_name}
              </span>
            ) : null}
          </div>

          {entry.description ? (
            <p className="mt-3 text-sm text-muted-foreground">{entry.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
