// components/ConsolePane.tsx
'use client';

import { useConsoleStore } from "@/lib/consoleStore";


export default function ConsolePane() {
  const logs = useConsoleStore((s) => s.entries);

  const getLogColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'warn': return 'text-amber-400';
      case 'error': return 'text-rose-400';
      case 'trace': return 'text-purple-400';
      case 'assert': return 'text-red-500';
      case 'dir': return 'text-green-400';
      case 'table': return 'text-indigo-400';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="h-[91vh] w-full overflow-y-auto bg-background dark:bg-stone-800 border-l border-border shadow-sm">
      <div className="h-full overflow-y-auto text-foreground console-scroller p-2 text-[13px] leading-[1.4em]">
        {logs.map((log) => (
          <div key={log.id} className={`m-0 whitespace-pre-wrap ${getLogColor(log.level)}`}>
            {log.level}: {log.data.join(' ')}
            {log.stack && (
              <details>
                <summary>Stack Trace</summary>
                <pre>{log.stack}</pre>
              </details>
            )}
            {log.tableMeta && <p>[Table: {log.tableMeta.columns.join(', ')}]</p>}
          </div>
        ))}
      </div>
    </div>
  );
}