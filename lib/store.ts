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
  defaultLabelDensity: 1,
  defaultLabelSize: 10,
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
    nodeDegreeProperty: 'geneDegree',
  },
  exportFormat: null,
  geneIDs: [],
  diseaseName: '',
  universalData: {
    database: {},
    user: {},
  },
  radioOptions: {
    user: {
      None: [],
      DEG: [],
      GDA: [],
      Genetics: [],
      Pathway: [],
      Druggability: [],
      TE: [],
      Database: [],
      Custom: [],
      OpenTargets: [],
      OT_Prioritization: [],
    },
    database: {
      None: [],
      DEG: [],
      GDA: [],
      Genetics: [],
      Pathway: [],
      Druggability: [],
      TE: [],
      Database: [],
      Custom: [],
      OpenTargets: [],
      OT_Prioritization: [],
    },
  },
  selectedNodeSizeProperty: '',
  selectedNodeColorProperty: '',
  geneNameToID: new Map(),
  graphConfig: null,
}));
