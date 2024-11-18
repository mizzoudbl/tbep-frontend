import type { GraphConfig, NodeColorType, NodeSizeType } from '@/lib/data';
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
   * Node suggestions
   */
  nodeSuggestions: string[];

  /**
   * Force Layout worker
   */
  forceWorker: {
    start: () => void;
    stop: () => void;
  };

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
  defaultLabelDensity: number;

  /**
   * Default edge color of the graph
   */
  defaultEdgeColor: string;

  /**
   * Default label size of the graph
   */
  defaultLabelSize: number;

  /**
   * Selected nodes in the graph through Drag and Drop
   * @inheritdoc SelectedNodeProperty
   */
  selectedNodes: SelectedNodeProperty[];

  /**
   * Selected radio button option for Node Color of graph
   */
  selectedRadioNodeColor: NodeColorType;

  /**
   * Selected radio button option for Node Size of graph
   */
  selectedRadioNodeSize: NodeSizeType;

  /**
   * Whether to show the edge label or not
   */
  showEdgeLabel: boolean;

  /**
   * Whether to show the edge label or not
   */
  showEdgeColor: boolean;

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

  /**
   * Disease Name
   */
  diseaseName: string;

  /**
   * Universal Data of all the diseases to be mapped on left sidebar
   */
  universalData: UniversalData;

  /**
   * Options for radio buttons
   */
  radioOptions: RadioOptions;

  /**
   * Selected Node Size Property
   */
  selectedNodeSizeProperty: string;

  /**
   * Selected Node Color Property
   */
  selectedNodeColorProperty: string;

  /**
   * Map of Gene Name to Gene ID
   */
  geneNameToID: Map<string, string>;

  /**
   *
   */
  graphConfig: GraphConfig | null;
}

export type RadioOptions = Record<'user' | 'database', Record<NodeColorType | NodeSizeType, Array<string>>>;

/**
 * Universal Data of all the diseases to be mapped on left sidebar
 * It contains:
 * - ENSG ID of the gene
 *    - DiseaseType/`common(Pathway, Druggability)
 *    - DiseaseType/`ALS`
 */
export type UniversalData = Record<
  'database' | 'user',
  Record<
    string,
    {
      common: CommonSection;
      [disease: string]: CommonSection | OtherSection;
    }
  >
>;

export interface CommonSection {
  Pathway: Record<string, string>;
  Druggability: Record<string, string>;
  TE: Record<string, string>;
  Database: Record<string, string>;
  Custom: Record<string, string>;
}

export interface OtherSection {
  DEG: Record<string, string>;
  GDA: Record<string, string>;
  Genetics: Record<string, string>;
}
