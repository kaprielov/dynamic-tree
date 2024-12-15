import { useState, useEffect } from 'react';

type FetchState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export const useFetch = <T>(fetchFunction: () => Promise<T>) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const result = await fetchFunction();
        if (!isCancelled) {
          setState({ data: result, error: null, loading: false });
        }
      } catch (err) {
        if (!isCancelled) {
          setState({ data: null, error: (err as Error).message, loading: false });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [fetchFunction]);

  return state;
};
