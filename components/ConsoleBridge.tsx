// components/ConsoleBridge.tsx
'use client';
import { useConsoleStore } from '@/lib/consoleStore';
import { useEffect, useRef } from 'react';

export default function ConsoleBridge() {
  const { push, clear } = useConsoleStore();
  const nextId = useRef(1);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type !== 'log') return;
      const { level } = e.data.payload;
      if (level === 'clear') {
        clear();
        return;
      }
      push({
        id: nextId.current++,
        ts: Date.now(),
        level,
        data: e.data.payload.args,
        stack: e.data.payload.stack,
        tableMeta: e.data.payload.tableMeta,
      });
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [push, clear]);

  return null;
}