// components/ConsoleBridge.tsx
'use client';
import { useConsoleStore } from '@/lib/consoleStore';
import { useExplorer } from '@/lib/objectExplorer';
import { useEffect, useRef } from 'react';

export default function ConsoleBridge() {
  const { push, clear } = useConsoleStore();
  const { update } = useExplorer();
  const nextId = useRef(1);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === 'log') {
        const { level, args, ...payload } = e.data.payload;
        if (level === 'clear') {
          clear();
          return;
        }
        push({
          id: nextId.current++,
          ts: Date.now(),
          kind: 'log',
          level,
          args, // Now raw unknown[]
          ...payload,
        });
      } else if (e.data?.type === 'result') {
        push({
          id: nextId.current++,
          ts: Date.now(),
          kind: 'result',
          value: e.data.payload,
        });
      } else if (e.data?.type === 'error') {
        push({
          id: nextId.current++,
          ts: Date.now(),
          kind: 'error',
          message: e.data.payload,
        });
      } else if (e.data?.type === 'objExpandRes') {
        const { objectId, path, snapshot } = e.data.payload;
        update(objectId, path, snapshot);
      }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [push, clear, update]);

  return null;
}