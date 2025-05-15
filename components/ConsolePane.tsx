'use client';

import { useConsoleStore } from '@/lib/store';
import { useEffect, useRef } from 'react';

export default function ConsolePane() {
  const logs = useConsoleStore((s) => s.logs);
  const scrollAnchor = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest log entry
  useEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md shadow-sm">
      <div
        className="h-full overflow-y-auto p-4 font-mono text-sm leading-relaxed"
      >
        {logs.map((log) => (
          <p key={log.id} className="whitespace-pre-wrap">
            {log.message}
          </p>
        ))}
        {/* Invisible div for autoscrolling */}
        <div ref={scrollAnchor} />
      </div>
    </div>
  );
}