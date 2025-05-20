'use client';

import { useEffect, useRef } from 'react';

interface ActiveTimer {
  browserId: number;
  kind: 'timeout' | 'interval';
}

export default function TimerBridge() {
  const timers = useRef<Record<number, ActiveTimer>>({}); // workerId → hostTimer

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const { type, payload } = e.data || {};
      if (type === 'timerSet') {
        const { id, kind, delay } = payload;
        // Prevent denial-of-service: cap at 500 active timers
        if (Object.keys(timers.current).length > 500) return;
        const handler = () => {
          const iframe = document.getElementById('sandbox-iframe') as HTMLIFrameElement;
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'timerFire', payload: { id } }, '*');
          }
        };
        const browserId =
          kind === 'timeout'
            ? window.setTimeout(handler, Math.min(delay, 60_000)) // Max 1 minute
            : window.setInterval(handler, Math.max(delay, 10));   // Min 10ms
        timers.current[id] = { browserId, kind };
      }
      if (type === 'timerClear') {
        const active = timers.current[payload.id];
        if (!active) return;
        active.kind === 'timeout'
          ? window.clearTimeout(active.browserId)
          : window.clearInterval(active.browserId);
        delete timers.current[payload.id];
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return null;
}