import { create } from 'zustand';

interface ObjSnapshot {
  type: string;
  preview: string;
  keys?: string[];
  length?: number;
  value?: string | number | boolean | null;
  id?: number | null;
}

interface Node {
  snapshot: ObjSnapshot;
  children?: Record<string | number, Node>;
}

interface ExplorerState {
  cache: Record<string, Node>;
  update: (id: number, path: (string | number)[], snap: ObjSnapshot) => void;
}

export const useExplorer = create<ExplorerState>((set) => ({
  cache: {},
  update: (id, path, snap) => set((state) => {
    const key = String(id);
    let current = state.cache[key];
    if (!current) {
      current = { snapshot: { type: 'object', preview: '{…}', keys: [] } };
      state.cache[key] = current;
    }
    let node = current;
    for (let i = 0; i < path.length - 1; i++) {
      const seg = path[i];
      node.children = node.children || {};
      if (!node.children[seg]) {
        node.children[seg] = { snapshot: { type: 'object', preview: '{…}', keys: [] } };
      }
      node = node.children[seg];
    }
    if (path.length > 0) {
      const lastSeg = path[path.length - 1];
      node.children = node.children || {};
      node.children[lastSeg] = { snapshot: snap };
    } else {
      current.snapshot = snap;
    }
    return { cache: { ...state.cache } };
  }),
}));