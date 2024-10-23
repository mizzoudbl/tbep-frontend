import { create } from 'zustand';
import type { GraphStore } from './interface';

export const useStore = create<GraphStore>(set => ({
  projectTitle: 'Untitled',
  nodeSearchQuery: '',
  setNodeSearchQuery: val => set({ nodeSearchQuery: val }),
  nodeSuggestions: [],
  forceWorker: {
    start() {
      throw new Error('Graph Layout not initialized');
    },
    stop() {
      throw new Error('Graph Layout not initialized');
    },
  },
  defaultNodeColor: 'blue',
  // Select defaultValue best for viewing the graph
  forceSettings: {
    chargeStrength: -200,
    linkDistance: 20,
  },
  defaultNodeSize: 5,
  defaultlabelDensity: 1,
  defaultEdgeColor: 'red',
  selectedNodes: [],
  selectedRadioNodeColor: 'None',
  selectedRadioNodeSize: 'None',
  showEdgeLabel: false,
  showEdgeColor: false,
  totalNodes: 0,
  totalEdges: 0,
  radialAnalysis: {
    edgeWeightCutOff: 0.4,
    nodeDegreeCutOff: 0,
    hubGeneEdgeCount: 0,
  },
  exportFormat: null,
  geneIDs: [],
  diseaseName: 'ALS',
  universalData: null,
  initialUniversalData: null,
  radioOptions: {
    None: [],
    logFC: [],
    GDA: [],
    Genetics: [],
    Pathways: [],
    Druggability: [],
    TE: [],
    Database: [],
    Custom: [],
  },
  initialRadioOptions: {
    None: [],
    logFC: [],
    GDA: [],
    Genetics: [],
    Pathways: [],
    Druggability: [],
    TE: [],
    Database: [],
    Custom: [],
  },
  selectedNodeSizeProperty: '',
  selectedNodeColorProperty: '',
}));
