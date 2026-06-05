import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const LoadingContext = createContext({
  loadingCount: 0,
  showLoading: () => {},
  hideLoading: () => {},
});

export function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback(() => {
    setLoadingCount((count) => count + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount((count) => Math.max(0, count - 1));
  }, []);

  const value = useMemo(
    () => ({ loadingCount, showLoading, hideLoading }),
    [loadingCount, showLoading, hideLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
