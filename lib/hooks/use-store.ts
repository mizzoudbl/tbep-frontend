import { create } from 'zustand';
import type { GraphStore } from '../interface';
import { initRadioOptions } from '../utils';

export const useStore = create<GraphStore>(set => ({
  projectTitle: 'Untitled',
  nodeSearchQuery: '',
  setNodeSearchQuery: val => set({ nodeSearchQuery: val }),
  nodeSuggestions: [],
  forceWorker: {
    start() {},
    stop() {},
  },
  defaultNodeColor: 'blue',
  // Select defaultValue best for viewing the graph
  forceSettings: {
    linkDistance: 20,
  },
  defaultNodeSize: 5,
  defaultLabelDensity: 1,
  defaultLabelSize: 10,
  selectedNodes: [],
  selectedRadioNodeColor: undefined,
  selectedRadioNodeSize: undefined,
  showEdgeLabel: false,
  showEdgeColor: false,
  totalNodes: 0,
  totalEdges: 0,
  radialAnalysis: {
    edgeWeightCutOff: 0.4,
    nodeDegreeCutOff: 0,
    hubGeneEdgeCount: 0,
    nodeDegreeProperty: 'Gene Degree',
  },
  exportFormat: null,
  geneIDs: [],
  diseaseName: 'ALS',
  universalData: {},
  radioOptions: {
    user: initRadioOptions(),
    database: initRadioOptions(),
  },
  selectedNodeSizeProperty: '',
  selectedNodeColorProperty: '',
  geneNameToID: new Map(),
  graphConfig: null,
  edgeOpacity: 1,
  highlightNeighborNodes: false,
}));
