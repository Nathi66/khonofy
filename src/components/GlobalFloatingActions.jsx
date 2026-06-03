import { useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import AIAgentFAB from '@/components/AIAgentFAB';
import ThemeToggleFAB from '@/components/ThemeToggleFAB';

const AUTH_PAGES = new Set(['/login', '/register', '/forgot-password', '/reset-password']);

export default function GlobalFloatingActions() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const showAiButton = isAuthenticated && !AUTH_PAGES.has(location.pathname);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showAiButton ? <AIAgentFAB /> : null}
      <ThemeToggleFAB fixed={false} />
    </div>
  );
}
