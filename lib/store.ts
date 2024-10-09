import { create } from 'zustand';
import type { GraphStore } from './interface';

export const useStore = create<GraphStore>(set => ({
  nodeSearchQuery: '',
  setNodeSearchQuery: val => set({ nodeSearchQuery: val }),
  fa2Worker: {
    start() {
      throw new Error('GraphologyWorkerLayout not initialized');
    },
    stop() {
      throw new Error('GraphologyWorkerLayout not initialized');
    },
    kill() {
      throw new Error('GraphologyWorkerLayout not initialized');
    },
  },
  setFa2Worker: val => set({ fa2Worker: val }),
  defaultNodeColor: 'blue',
  setFa2Settings: settings => set({ fa2Settings: settings }),
  fa2Settings: {
    edgeWeightInfluence: 1,
    gravity: 0.1,
    scalingRatio: 1,
  },
  graph: {},
  setGraph: graph => set({ graph }),
  defaultNodeSize: 10,
  defaultLabelRenderedSizeThreshold: 0.75,
  defaultEdgeColor: 'red',
  selectedNodes: [],
  selectedRadioNodeColor: 'None',
  selectedRadioNodeSize: 'None',
}));
