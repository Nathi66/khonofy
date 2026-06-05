import DiscLoader from '@/components/DiscLoader';
import { cn } from '@/lib/utils';

export default function SectionLoader({ label, className, size = 'md' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-8', className)}>
      <DiscLoader size={size} label={label || 'Loading'} />
      {label ? (
        <p className="text-sm text-muted-foreground">{label}</p>
      ) : null}
    </div>
  );
}
