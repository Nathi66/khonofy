import DiscLoader from '@/components/DiscLoader';
import { cn } from '@/lib/utils';

export default function PageLoader({ label = 'Loading', className, size = 'lg' }) {
  return (
    <div className={cn('flex h-full min-h-[240px] w-full items-center justify-center p-12', className)}>
      <div className="flex flex-col items-center gap-4">
        <DiscLoader size={size} label={label} />
        {label ? (
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        ) : null}
      </div>
    </div>
  );
}
