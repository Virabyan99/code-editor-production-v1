'use client';

import { useConsoleStore } from '@/lib/store';

export default function ConsolePane() {
  const logs = useConsoleStore((s) => s.logs);

  return (
  <div className="h-[91vh] w-full overflow-y-auto  dark:bg-stone-800 border-l-1 shadow-sm">
  <div
  className="h-full overflow-y-auto font-mono text-foreground console-scroller"
  style={{
    fontFamily: 'var(--font-fira-code), monospace',
    fontSize: '13px',
    lineHeight: '1.4em',
    padding: '0',
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