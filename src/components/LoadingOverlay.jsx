import DiscLoader from '@/components/DiscLoader';
import { cn } from '@/lib/utils';

export default function LoadingOverlay({ label = 'Loading', className = '' }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-[2px]',
        className
      )}
      role="presentation"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card/90 px-10 py-8 shadow-lg">
        <DiscLoader size="lg" label={label} />
        {label ? (
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        ) : null}
      </div>
    </div>
  );
}
