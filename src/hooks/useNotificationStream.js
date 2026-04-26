import { useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { storage } from '@/utils/storage';
import { useAuthStore } from '@/store/authStore';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://university-api-production.up.railway.app';
const SSE_ENABLED = import.meta.env.VITE_SSE_ENABLED !== 'false';

// Custom error class so onerror can detect auth failures from onopen and stop retrying
class AuthError extends Error {}

/**
 * useNotificationStream — opens an SSE connection to the backend and calls
 * onNotification(notification) each time the server pushes a new one.
 *
 * Lifecycle:
 *   - Opens when the user is authenticated
 *   - Reconnects automatically if the server closes it (e.g. after MAX_LIFETIME)
 *   - Closes when the user logs out OR the component unmounts
 *   - Stops retrying on auth failures (401/403)
 */
export function useNotificationStream(onNotification) {
  // Re-run the effect when auth state changes so logout closes the stream
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!SSE_ENABLED || !isAuthenticated) return;

    const controller = new AbortController();

    fetchEventSource(`${BASE_URL}/api/v1/notifications/stream`, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
        Accept: 'text/event-stream',
      },

      signal: controller.signal,

      async onmessage(event) {
        if (event.event === 'notification') {
          onNotification(JSON.parse(event.data));
        }
      },

      async onopen(response) {
        if (response.ok) return;
        // 401/403 — token invalid or revoked, don't retry
        if (response.status === 401 || response.status === 403) {
          throw new AuthError(`SSE auth failed: ${response.status}`);
        }
        // Other non-2xx — let fetchEventSource retry
        throw new Error(`SSE connection failed: ${response.status}`);
      },

      onerror(error) {
        // Throwing inside onerror tells fetch-event-source to STOP retrying.
        // Returning lets it retry with default backoff.
        if (error instanceof AuthError || !storage.getToken()) {
          throw error;
        }
        console.warn('SSE error, retrying...', error);
      },
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
}
