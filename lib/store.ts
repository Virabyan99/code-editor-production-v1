import { create } from 'zustand';

interface EditorState {
  code: string;
  setCode: (code: string) => void;
  wordWrap: boolean;
  toggleWordWrap: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: '',
  setCode: (code) => set({ code }),
  wordWrap: false, // Default to no word wrap
  toggleWordWrap: () => set((state) => ({ wordWrap: !state.wordWrap })),
}));

// Existing ConsoleState remains unchanged
export interface ConsoleEntry {
  id: string;       // UUID v4
  message: string;  // Plain text for MVP
  createdAt: number;
}

interface ConsoleState {
  logs: ConsoleEntry[];
  addLog: (msg: string) => void;
  clear: () => void;
}

export const useConsoleStore = create<ConsoleState>((set) => ({
  logs: [],
  addLog: (message) =>
    set((state) => ({
      logs: [
        ...state.logs,
        { id: crypto.randomUUID(), message, createdAt: Date.now() },
      ],
    })),
  clear: () => set({ logs: [] }),
}));