// lib/consoleStore.ts
import { create } from 'zustand';
import type { ObjSnapshot } from '@/lib/types';

interface BaseEntry {
  id: number;
  ts: number;
  kind: string;
}

interface LogEntry extends BaseEntry {
  kind: 'log';
  level: string;
  depth: number;
  args: unknown[];
  stack?: string;
  tableMeta?: {
    columns: string[];
    rows: unknown[][];
    truncated: boolean;
  };
  label?: string;
  value?: number;
  elapsed?: number;
  extra?: string[];
  objectId?: number;
  snapshot?: ObjSnapshot;
}

interface ResultEntry extends BaseEntry {
  kind: 'result';
  value: unknown;
}

interface ErrorEntry extends BaseEntry {
  kind: 'error';
  message: string;
}

type Entry = LogEntry | ResultEntry | ErrorEntry;

interface ConsoleState {
  entries: Entry[];
  push: (entry: Entry) => void;
  clear: () => void;
  isOverwrite: boolean;
  toggleOverwrite: () => void;
}

export const useConsoleStore = create<ConsoleState>((set) => ({
  entries: [],
  push: (entry) => set((state) => ({
    entries: [...state.entries, entry],
  })),
  clear: () => set({ entries: [] }),
  isOverwrite: false, // Default to append mode
  toggleOverwrite: () => set((state) => ({ isOverwrite: !state.isOverwrite })),
}));