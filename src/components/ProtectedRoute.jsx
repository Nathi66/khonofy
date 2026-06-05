import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import PageLoader from '@/components/PageLoader';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <PageLoader label="Signing you in..." className="min-h-0" />
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback /> }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return fallback;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
