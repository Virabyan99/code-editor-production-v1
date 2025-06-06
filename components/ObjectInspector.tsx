import { useState } from 'react';

interface ObjectInspectorProps {
  value: unknown;
  depth?: number;
  maxDepth?: number;
}

export function ObjectInspector({ value, depth = 0, maxDepth = 5 }: ObjectInspectorProps) {
  const [open, setOpen] = useState(depth < 1);
  const MAX_SIZE = 10000;

  const type = Object.prototype.toString.call(value);

  if (type === '[object Function]' || (typeof value === 'object' && value !== null && '_type' in value && value._type === 'function')) {
    const funcName = type === '[object Function]' ? (value as Function).name || 'anonymous' : (value as any).name;
    return <span className="text-purple-400">[Function: {funcName}]</span>;
  } else if (type === '[object Date]') {
    return <span className="text-orange-400">{(value as Date).toString()}</span>;
  } else if (type === '[object Map]') {
    const map = value as Map<unknown, unknown>;
    const entries = Array.from(map.entries());
    const label = `Map(${entries.length})`;
    if (entries.length > MAX_SIZE) {
      return <span>{label} {'<omitted>'}</span>;
    }
    return (
      <div>
        {entries.length > 0 && (
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? '▼' : '▶'}
          </button>
        )}
        <span>{label}</span>
        {open && (
          <ul className="ml-4 list-none">
            {entries.map(([k, v], i) => (
              <li key={i}>
                <ObjectInspector value={k} depth={depth + 1} maxDepth={maxDepth} /> 
                <ObjectInspector value={v} depth={depth + 1} maxDepth={maxDepth} />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  } else if (type === '[object Set]') {
    const set = value as Set<unknown>;
    const entries = Array.from(set);
    const label = `Set(${entries.length})`;
    if (entries.length > MAX_SIZE) {
      return <span>{label} {'<omitted>'}</span>;
    }
    return (
      <div>
        {entries.length > 0 && (
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? '▼' : '▶'}
          </button>
        )}
        <span>{label}</span>
        {open && (
          <ol className="ml-4 list-decimal">
            {entries.map((v, i) => (
              <li key={i}>
                <ObjectInspector value={v} depth={depth + 1} maxDepth={maxDepth} />
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  } else if (type === '[object Array]') {
    const arr = value as unknown[];
    if (arr.length > MAX_SIZE) {
      return <span>Array({arr.length}) {'<omitted>'}</span>;
    }
    return (
      <div>
        {arr.length > 0 && (
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? '▼' : '▶'}
          </button>
        )}
        <span>Array({arr.length})</span>
        {open && depth < maxDepth && (
          <ol className="ml-4 list-decimal">
            {arr.map((v, i) => (
              <li key={i}>
                <ObjectInspector value={v} depth={depth + 1} maxDepth={maxDepth} />
              </li>
            ))}
          </ol>
        )}
        {open && depth >= maxDepth && <em>…</em>}
      </div>
    );
  } else if (type === '[object Object]') {
    const obj = value as Record<string, unknown>;
    const entries = Object.entries(obj);
    if (entries.length > MAX_SIZE) {
      return <span>Object {'<omitted>'}</span>;
    }
    return (
      <div>
        {entries.length > 0 && (
          <button onClick={() => setOpen(!open)} className="text-foreground">
            {open ? '▼' : '▶'}
          </button>
        )}
        <span>{'{…}'}</span>
        {open && depth < maxDepth && (
          <ul className="ml-4 list-none">
            {entries.map(([k, v]) => (
              <li key={k}>
                <span className="text-yellow-400">{k}</span>: 
                <ObjectInspector value={v} depth={depth + 1} maxDepth={maxDepth} />
              </li>
            ))}
          </ul>
        )}
        {open && depth >= maxDepth && <em>…</em>}
      </div>
    );
  } else if (typeof value === 'string') {
    return <span className="text-green-400">"{value}"</span>;
  } else if (typeof value === 'number' || typeof value === 'boolean') {
    return <span className="text-blue-400">{String(value)}</span>;
  } else if (value === null) {
    return <span className="text-gray-400">null</span>;
  } else if (value === undefined) {
    return <span className="text-gray-400">undefined</span>;
  } else {
    return <span>{String(value)}</span>;
  }
}