import type { GraphologyWorkerLayout } from '@/components/graph';
import type { RadialAnalysisSetting } from '.';
import type { SelectedNodeProperty } from '../SelectedNodeProperty';
import type { ForceSettings } from './ForceSettings';

/**
 * Store for Zustand
 * @interface GraphStore
 */
export interface GraphStore {
  /**
   * Project Title for file saving
   */
  projectTitle: string;

  /**
   * Node textarea tearch query value
   */
  nodeSearchQuery: string;
  setNodeSearchQuery: (nodeSearchQuery: string) => void;

  /**
   * Force Layout worker
   */
  forceWorker: GraphologyWorkerLayout;

  /**
   * Force Layout settings
   */
  forceSettings: ForceSettings;

  /**
   * Default node color of the graph
   */
  defaultNodeColor: string;

  /**
   * Default node size of the graph
   */
  defaultNodeSize: number;

  /**
   * Default label rendered size threshold
   */
  defaultLabelRenderedSizeThreshold: number;

  /**
   * Default edge color of the graph
   */
  defaultEdgeColor: string;

  /**
   * Selected nodes in the graph through Drag and Drop
   * @inheritdoc SelectedNodeProperty
   */
  selectedNodes: SelectedNodeProperty[];

  /**
   * Selected radio button option for Node Color of graph
   */
  selectedRadioNodeColor: string;

  /**
   * Selected radio button option for Node Size of graph
   */
  selectedRadioNodeSize: string;
  /**
   * Whether to show the edge label or not
   */
  showEdgeLabel: boolean;

  /**
   * Total number of nodes in the graph
   */
  totalNodes: number;

  /**
   * Total number of edges in the graph
   */
  totalEdges: number;

  /**
   * Radial Analysis settings
   */
  radialAnalysis: RadialAnalysisSetting;

  /**
   * Graph Export format
   */
  exportFormat: 'jpeg' | 'png' | 'json' | null;

  /**
   * ENSG IDs of all the nodes in Graph
   */
  geneIDs: string[];
}
