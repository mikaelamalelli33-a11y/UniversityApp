import { useEffect, useRef } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { storage } from '@/utils/storage';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://university-api-production.up.railway.app';
const SSE_ENABLED = import.meta.env.VITE_SSE_ENABLED !== 'false';

/**
 * useNotificationStream — opens an SSE connection to the backend and calls
 * onNotification(notification) each time the server pushes a new one.
 *
 * The connection:
 *   - Opens when the component mounts
 *   - Reconnects automatically if the server closes it (e.g. after MAX_LIFETIME)
 *   - Closes cleanly when the component unmounts
 *
 * Usage:
 *   useNotificationStream((notification) => {
 *     console.log('New notification:', notification);
 *   });
 */
export function useNotificationStream(onNotification) {
  // useRef so the abort controller survives re-renders without triggering effects
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!SSE_ENABLED) return;

    // AbortController lets us close the SSE connection on unmount
    const controller = new AbortController();
    controllerRef.current = controller;

    fetchEventSource(`${BASE_URL}/api/v1/notifications/stream`, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
        Accept: 'text/event-stream',
      },

      signal: controller.signal,

      // Called when the server sends a named event (e.g. event: notification)
      async onmessage(event) {
        if (event.event === 'notification') {
          const notification = JSON.parse(event.data);
          onNotification(notification);
        }

        // 'close' event means the server is asking us to reconnect.
        // fetchEventSource reconnects automatically — nothing to do here.
      },

      // Called when the connection opens — useful for debugging
      async onopen(response) {
        if (response.ok) return;
        // Non-2xx response (e.g. 401) — stop retrying immediately
        throw new Error(`SSE connection failed: ${response.status}`);
      },

      // Called on any error — fetchEventSource retries automatically unless we throw
      onerror(error) {
        // If the token is gone (user logged out), stop reconnecting
        if (!storage.getToken()) {
          controller.abort();
          return;
        }
        // Otherwise let fetchEventSource retry with its default backoff
        console.warn('SSE error, retrying...', error);
      },
    });

    // Cleanup: abort the SSE connection when the component unmounts
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once on mount — the stream handles its own reconnection
}
