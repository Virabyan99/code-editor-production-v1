'use client';

import { useCodeRunner } from '@/lib/useCodeRunner';
import { useEditorStore } from '@/lib/store';

export default function Toolbar() {
  const { run } = useCodeRunner();
  const code = useEditorStore((s) => s.code);

  return (
    <header className="flex items-center gap-2 border-b px-4 py-2 shadow-sm">
      <span className="font-bold">_ jspen</span>
      <button
        onClick={() => console.log('Current code:', code)}
        className="ml-2 bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
      >
        Log Code
      </button>
      <button
        onClick={run}
        className="ml-auto bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Run
      </button>
    </header>
  );
}