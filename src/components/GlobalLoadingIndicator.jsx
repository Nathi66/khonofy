import { useEffect, useState } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import LoadingOverlay from '@/components/LoadingOverlay';
import { subscribeLoading } from '@/lib/loading-bus';
import { useLoading } from '@/lib/LoadingContext';

export default function GlobalLoadingIndicator() {
  const mutatingCount = useIsMutating();
  const { loadingCount } = useLoading();
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => subscribeLoading(setPendingRequests), []);

  const isActive = pendingRequests > 0 || mutatingCount > 0 || loadingCount > 0;

  if (!isActive) {
    return null;
  }

  return <LoadingOverlay />;
}
