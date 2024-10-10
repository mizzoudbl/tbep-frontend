import { create } from 'zustand';
import type { GraphStore } from './interface';

export const useStore = create<GraphStore>(set => ({
  nodeSearchQuery: '',
  setNodeSearchQuery: val => set({ nodeSearchQuery: val }),
  forceWorker: {
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
  defaultNodeColor: 'blue',
  // Select defaultValue best for viewing the graph
  forceSettings: {
    repulsion: 10,
    attraction: 10,
    gravity: 10,
    damping: 10,
    speed: 10,
  },
  defaultNodeSize: 5,
  defaultLabelRenderedSizeThreshold: 3,
  defaultEdgeColor: 'red',
  selectedNodes: [],
  selectedRadioNodeColor: 'None',
  selectedRadioNodeSize: 'None',
  showEdgeLabel: true,
  totalNodes: 0,
  totalEdges: 0,
}));
