// components/ConsolePane.tsx
'use client';
import { useConsoleStore } from '@/lib/consoleStore';
import { TreeNode } from './TreeNode';
import { ObjectInspector } from './ObjectInspector';
import { useLayoutEffect, useRef } from 'react';

export default function ConsolePane() {
  const logs = useConsoleStore((s) => s.entries);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: scrollerRef.current.scrollHeight });
    }
  }, [logs]);

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
    <div className="h-[91vh] w-full overflow-y-auto bg-background border-l border-border shadow-sm">
      <div ref={scrollerRef} className="h-full overflow-y-auto text-foreground console-scroller p-2 text-[13px] leading-[1.4em]">
        {logs.map((entry) => {
          switch (entry.kind) {
            case 'log':
              return (
                <div
                  key={entry.id}
                  className={`m-0 whitespace-pre-wrap ${getLogColor(entry.level)}`}
                  style={{ marginLeft: `${entry.depth}rem` }}
                >
                  {entry.level === 'dir' && entry.snapshot ? (
                    <TreeNode
                      nodeId={entry.objectId!}
                      path={[]}
                      snapshot={entry.snapshot}
                      ancestorIds={new Set([entry.objectId!])}
                    />
                  ) : entry.level === 'count' ? (
                    `${entry.label || 'default'}: ${entry.value}`
                  ) : entry.level === 'timeLog' || entry.level === 'timeEnd' ? (
                    `${entry.label || 'default'}: ${entry.elapsed?.toFixed(2)} ms${
                      entry.extra?.length ? ` - ${entry.extra.join(' ')}` : ''
                    }`
                  ) : entry.level === 'group' || entry.level === 'groupCollapsed' ? (
                    `${entry.label || 'Group'}`
                  ) : entry.level === 'groupEnd' ? null : entry.level === 'table' && entry.tableMeta ? (
                    <div className="table-container">
                      <table className="min-w-full border-collapse border border-border">
                        <thead>
                          <tr>
                            {entry.tableMeta.columns.map((col, idx) => (
                              <th key={idx} className="border border-border px-2 py-1 text-left">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {entry.tableMeta.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="border border-border px-2 py-1">{String(cell)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {entry.tableMeta.truncated && <p className="text-muted-foreground">... (truncated)</p>}
                    </div>
                  ) : (
                    <>
                      {entry.args.map((arg, idx) => (
                        <ObjectInspector key={idx} value={arg} />
                      ))}
                      {entry.stack && (
                        <details>
                          <summary>Stack Trace</summary>
                          <pre>{entry.stack}</pre>
                        </details>
                      )}
                    </>
                  )}
                </div>
              );
            case 'result':
              return (
                <div key={entry.id} className="m-0 whitespace-pre-wrap text-gray-300">
                  <ObjectInspector value={entry.value} />
                </div>
              );
            case 'error':
              return (
                <div key={entry.id} className="m-0 whitespace-pre-wrap text-red-400">
                  {entry.message}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}