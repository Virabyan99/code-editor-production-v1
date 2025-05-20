// lib/consoleStore.ts
import { create } from 'zustand';

interface Entry {
  id: number;
  ts: number;
  level: string;
  data: string[];
  stack?: string;
  tableMeta?: {
    columns: string[];
    rows: unknown[][];
    truncated: boolean;
  };
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