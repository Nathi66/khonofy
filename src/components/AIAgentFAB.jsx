import { Bot, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function AIAgentFAB({ className }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === '/ai-assistant';

  return (
    <button
      type="button"
      onClick={() => navigate('/ai-assistant')}
      title="Open AI Assistant"
      className={cn(
        'relative flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-foreground text-background hover:bg-foreground/90 dark:bg-card dark:text-foreground dark:ring-1 dark:ring-border',
        className
      )}
    >
      <Bot className="h-5 w-5" />
      <span className="absolute -right-0.5 -top-0.5 rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
        <Sparkles className="h-2.5 w-2.5" />
      </span>
    </button>
  );
}
