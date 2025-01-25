import { create } from 'zustand';
import type { GraphStore } from '../interface';

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
    user: {
      DEG: [],
      Pathway: [],
      Druggability: [],
      TE: [],
      Custom_Color: [],
      OpenTargets: [],
      OT_Prioritization: [],
    },
    database: {
      DEG: [],
      Pathway: [],
      Druggability: [],
      TE: [],
      Custom_Color: [],
      OpenTargets: [],
      OT_Prioritization: [],
    },
  },
  selectedNodeSizeProperty: '',
  selectedNodeColorProperty: '',
  geneNameToID: new Map(),
  graphConfig: null,
  edgeOpacity: 1,
  highlightNeighborNodes: false,
}));
