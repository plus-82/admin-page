import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions<T, P> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  deps?: any[];
  initialData?: T;
  skip?: boolean;
}

export function useFetch<T, P = any>(
  fetchFn: (params?: P) => Promise<T>,
  options: UseFetchOptions<T, P> = {}
) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const { onSuccess, onError, deps = [], skip = false } = options;

  const fetch = useCallback(
    async (params?: P) => {
      if (skip) return;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchFn(params);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, skip, onSuccess, onError]
  );

  useEffect(() => {
    if (!skip) {
      fetch();
    }
  }, [...deps, skip, fetch]);

  return { data, loading, error, fetch, setData };
}

export default useFetch;