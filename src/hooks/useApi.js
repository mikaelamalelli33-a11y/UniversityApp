import { useState, useEffect } from 'react';

/**
 * useApi — generic hook for fetching data from the API.
 *
 * USAGE:
 *   const { data, loading, error } = useApi(
 *     () => studentService.getNotat(user.id),
 *     [user.id]  // re-fetches when user.id changes
 *   );
 *
 * PARAMS:
 *   apiFn  — a function that returns a Promise (your service call)
 *   deps   — dependency array, same as useEffect (re-fetches when these change)
 *
 * RETURNS:
 *   data     — the resolved API response, null until resolved
 *   loading  — true while the request is in flight
 *   error    — the error object if the request failed, null otherwise
 */
export const useApi = (apiFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevents setting state on an unmounted component
    // (e.g. user navigates away before the request finishes)
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
};
