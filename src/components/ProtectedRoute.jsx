import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

const ForbiddenPage = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="max-w-md text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
      <p className="text-muted-foreground">You do not have permission to view this page.</p>
      <div className="flex gap-3 justify-center pt-4">
        <a href="/" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          Go to Dashboard
        </a>
      </div>
    </div>
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback /> }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();

  if (isLoadingAuth || isLoadingUser) {
    return fallback;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access: if user has no role (uninitialized) or role doesn't match route capability
  // Default to staff if role is not set, which will be checked by individual pages
  const role = user?.role || 'staff';

  return <Outlet context={{ role }} />;
}
