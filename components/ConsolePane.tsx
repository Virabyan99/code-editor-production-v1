'use client';

import { useConsoleStore } from '@/lib/store';

export default function ConsolePane() {
  const logs = useConsoleStore((s) => s.logs);

  return (
    <div className="h-[91vh] w-full overflow-y-auto bg-background dark:bg-stone-800 border-l border-border shadow-sm">
      <div className="h-full overflow-y-auto  text-foreground console-scroller p-2 text-[13px] leading-[1.4em]">
        {logs.map((log) => (
          <p key={log.id} className="m-0 whitespace-pre-wrap">
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
}