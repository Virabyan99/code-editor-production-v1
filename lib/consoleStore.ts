// lib/consoleStore.ts
import { create } from 'zustand';

interface Entry {
  id: number;
  ts: number;
  level: string;
  depth: number;        // Required for indentation
  args?: string[];      // For log, debug, etc.
  stack?: string;       // For trace, assert
  tableMeta?: {
    columns: string[];
    rows: unknown[][];
    truncated: boolean;
  };
  label?: string;       // For count, timers, groups
  value?: number;       // For count
  elapsed?: number;     // For timeLog, timeEnd
  extra?: string[];     // For timeLog, timeEnd
}

interface ConsoleState {
  entries: Entry[];
  push: (entry: Entry) => void;
  clear: () => void;
}

export const useConsoleStore = create<ConsoleState>((set) => ({
  entries: [],
  push: (entry) => set((state) => ({
    entries: [...state.entries, entry],
  })),
  clear: () => set({ entries: [] }),
}));