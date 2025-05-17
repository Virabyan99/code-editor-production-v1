'use client';

import { useConsoleStore } from '@/lib/store';

export default function ConsolePane() {
  const logs = useConsoleStore((s) => s.logs);

  return (
    <div className="h-full w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md shadow-sm">
      <div
        className="h-full overflow-y-auto font-mono"
        style={{
          fontFamily: 'var(--font-fira-code), monospace',
          fontSize: '13px', // Matches CodeMirror default
          lineHeight: '1.4em', // Matches CodeMirror default
          padding: '0', // No padding to align with editor
        }}
      >
        {logs.map((log) => (
          <p key={log.id} className="m-0 p-0 whitespace-pre-wrap">
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
}