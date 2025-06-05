import { useState } from 'react';

interface ObjectInspectorProps {
  value: unknown;
  depth?: number;
}

export function ObjectInspector({ value, depth = 0 }: ObjectInspectorProps) {
  const [open, setOpen] = useState(depth < 1);
  const MAX_SIZE = 10000;

  if (value instanceof Set) {
    const entries = Array.from(value);
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
                <ObjectInspector value={v} depth={depth + 1} />
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  } else if (typeof value === 'string') {
    return <span className="text-green-400">&quot;{value}&quot;</span>;
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