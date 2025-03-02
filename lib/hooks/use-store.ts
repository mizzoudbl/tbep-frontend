import { create } from 'zustand';
import type { GraphStore } from '../interface';
import { initRadioOptions } from '../utils';

export const useStore = create<GraphStore>(set => ({
  projectTitle: 'Untitled',
  nodeSearchQuery: '',
  nodeSuggestions: [],
  forceWorker: {
    start() {},
    stop() {},
  },
  defaultNodeColor: 'skyblue',
  // Select defaultValue best for viewing the graph
  forceSettings: {
    linkDistance: 30,
  },
  defaultNodeSize: 5,
  defaultLabelDensity: 3,
  defaultLabelSize: 8,
  selectedNodes: [],
  selectedRadioNodeColor: undefined,
  selectedRadioNodeSize: undefined,
  showEdgeLabel: false,
  showEdgeColor: false,

  networkStatistics: {
    totalNodes: 0,
    totalEdges: 0,
    avgDegree: 0,
    density: 0,
    diameter: 0,
    averageClusteringCoefficient: 0,
    degreeDistribution: null,
    edgeScoreDistribution: null,
    top10ByDegree: null,
    top10ByBetweenness: null,
    top10ByCloseness: null,
    top10ByEigenvector: null,
    top10ByPageRank: null,
  },
  setNetworkStatistics: (stats: Partial<GraphStore['networkStatistics']>) => {
    set(state => ({
      networkStatistics: {
        ...state.networkStatistics,
        ...stats,
      },
    }));
  },
  radialAnalysis: {
    edgeWeightCutOff: 0.4,
    nodeDegreeCutOff: 0,
    hubGeneEdgeCount: 0,
    nodeDegreeProperty: 'Gene Degree',
  },
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
