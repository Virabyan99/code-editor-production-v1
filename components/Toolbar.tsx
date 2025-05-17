'use client';

import { useCodeRunner } from '@/lib/useCodeRunner';
import { useEditorStore, useConsoleStore } from '@/lib/store';
import { Sun, Moon, Download, Upload, ClipboardCopy, Code2Icon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { z } from 'zod';
import { ChangeEvent, useRef, useState, useEffect } from 'react';

const fileSchema = z.object({
  name: z.string().endsWith('.js').or(z.string().endsWith('.txt')).or(z.string().endsWith('.json')),
  content: z.string().min(1),
});

export default function Toolbar() {
  const { run } = useCodeRunner();
  const code = useEditorStore((s) => s.code);
  const setCode = useEditorStore((s) => s.setCode);
  const clearConsole = useConsoleStore((s) => s.clear);
  const { resolvedTheme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      console.info('Copied to clipboard');
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const download = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString();
    a.download = `jspen_${ts}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      fileSchema.parse({ name: file.name, content: text });
      setCode(text);
      clearConsole();
    } catch {
      alert('Invalid file type or empty content.');
    } finally {
      e.target.value = '';
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const clear = () => {
    setCode('');
    clearConsole();
  };

  return (
    <header className="flex items-center gap-2  border-b px-4 py-2 shadow-sm">
      <img src="/logo.png" alt="jspen logo" className="h-8 w-auto rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-black group hover:text-gray-100 hover:scale-105 transition-all duration-300" />

      {/* Icon buttons with hover effects */}
      <button
        onClick={() => console.log('Current code:', code)}
        className="ml-2 p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-black group hover:text-gray-100 hover:scale-105 transition-all duration-300"
        title="Log current code"
        aria-label="Log current code"
      >
        <Code2Icon className="size-4 group-hover:text-gray-100" />
      </button>
      <button
        onClick={copy}
        className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-black group hover:text-gray-100 hover:scale-105 transition-all duration-300"
        title="Copy to clipboard"
        aria-label="Copy to clipboard"
      >
        <ClipboardCopy className="size-4 group-hover:text-gray-100" />
      </button>
      <button
        onClick={download}
        className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-black group hover:text-gray-100 hover:scale-105 transition-all duration-300"
        title="Download file"
        aria-label="Download file"
      >
        <Download className="size-4 group-hover:text-gray-100" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".js,.txt,.json"
        className="hidden"
        onChange={onUpload}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-black group hover:text-gray-100 hover:scale-105 transition-all duration-300"
        title="Upload file"
        aria-label="Upload file"
      >
        <Upload className="size-4 group-hover:text-gray-100" />
      </button>
      <button
        onClick={toggleTheme}
        className="p-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-black group hover:text-gray-100 hover:scale-105 transition-all duration-300"
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {mounted ? (
          resolvedTheme === 'dark' ? (
            <Sun className="size-4 group-hover:text-gray-100" />
          ) : (
            <Moon className="size-4 group-hover:text-gray-100" />
          )
        ) : (
          <Moon className="size-4 group-hover:text-gray-100" />
        )}
      </button>

      {/* Run and Clear buttons retain their original styling */}
      <button
        onClick={run}
        className="ml-auto bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
      >
        Run
      </button>
      <button
        onClick={clear}
        className="ml-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Clear
      </button>
    </header>
  );
}