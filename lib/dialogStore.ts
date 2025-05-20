// lib/dialogStore.ts
import { create } from 'zustand';
import type { DialogRequest } from '@/lib/types';

interface DialogState {
  queue: DialogRequest[];
  push: (r: DialogRequest) => void;
  shift: () => DialogRequest | undefined;
}

export const useDialogStore = create<DialogState>((set) => ({
  queue: [],
  push: (r) => set((s) => {
    const newQueue = [...s.queue, r];
    console.log('Store queue after push:', newQueue);
    return { queue: newQueue };
  }),
  shift: () => {
    let first: DialogRequest | undefined;
    set((s) => {
      [first, ...s.queue] = s.queue;
      console.log('Store queue after shift:', s.queue);
      return { queue: s.queue };
    });
    return first;
  },
}));