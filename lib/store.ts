import { create } from 'zustand';
import type { GraphStore } from './interface';

export const useStore = create<GraphStore>(set => ({
  nodeSearchQuery: '',
  setNodeSearchQuery: (val: string) => set({ nodeSearchQuery: val }),
}));
