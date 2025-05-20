'use client';
import { useConsoleStore } from '@/lib/consoleStore';

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
      case 'debug': return 'text-slate-400';
      case 'count': return 'text-cyan-400';
      case 'timeLog': return 'text-yellow-400';
      case 'timeEnd': return 'text-yellow-600 font-bold';
      case 'group': return 'text-gray-400';
      case 'groupCollapsed': return 'text-gray-400';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="h-[91vh] w-full overflow-y-auto bg-background dark:bg-stone-800 border-l border-border shadow-sm">
      <div className="h-full overflow-y-auto text-foreground console-scroller p-2 text-[13px] leading-[1.4em]">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`m-0 whitespace-pre-wrap ${getLogColor(log.level)}`}
            style={{ marginLeft: `${log.depth}rem` }}
          >
            {log.level === 'count' ? (
              `${log.label || 'default'}: ${log.value}`
            ) : log.level === 'timeLog' || log.level === 'timeEnd' ? (
              `${log.label || 'default'}: ${log.elapsed?.toFixed(2)} ms${
                log.extra?.length ? ` - ${log.extra.join(' ')}` : ''
              }`
            ) : log.level === 'group' || log.level === 'groupCollapsed' ? (
              `${log.label || 'Group'}`
            ) : log.level === 'groupEnd' ? null : (
              <>
                {log.args?.join(' ')}
                {log.stack && (
                  <details>
                    <summary>Stack Trace</summary>
                    <pre>{log.stack}</pre>
                  </details>
                )}
                {log.tableMeta && <p>[Table: {log.tableMeta.columns.join(', ')}]</p>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}