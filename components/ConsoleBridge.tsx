'use client';
import { useConsoleStore } from '@/lib/consoleStore';
import { useEffect, useRef } from 'react';

export default function ConsoleBridge() {
  const { push, clear } = useConsoleStore();
  const nextId = useRef(1);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type !== 'log') return;
      const { level, ...payload } = e.data.payload;
      if (level === 'clear') {
        clear();
        return;
      }
      push({
        id: nextId.current++,
        ts: Date.now(),
        level,
        ...payload,
      });
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [push, clear]);

  return null;
}