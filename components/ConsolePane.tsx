'use client';

import { useConsoleStore } from '@/lib/store';

export default function ConsolePane() {
  const logs = useConsoleStore((s) => s.logs);

  return (
    <div className="h-full w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md shadow-sm">
      <div className="flex flex-col h-full overflow-y-auto p-4 font-mono text-sm leading-relaxed">
        {logs.map((log) => (
          <p key={log.id} className="whitespace-pre-wrap">
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
}