import type {
  DiseaseDependentProperties,
  DiseaseIndependentProperties,
  GeneProperties,
  GraphConfig,
  NodeColorType,
  NodeSizeType,
} from '@/lib/data';
import type { ForceSettings, RadialAnalysisSetting } from '.';
import type { GenePropertyMetadata, SelectedNodeProperty } from '..';

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
  selectedRadioNodeColor: NodeColorType | undefined;

  /**
   * Selected radio button option for Node Size of graph
   */
  selectedRadioNodeSize: NodeSizeType | undefined;

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
  selectedNodeSizeProperty: string | Set<string>;

  /**
   * Selected Node Color Property
   */
  selectedNodeColorProperty: string | Set<string>;

  /**
   * Map of Gene Name to Gene ID
   */
  geneNameToID: Map<string, string>;

  /**
   *
   */
  graphConfig: GraphConfig | null;

  /**
   * Edge Opacity
   */
  edgeOpacity: number;

  /**
   * Highlight Neighbor Nodes
   */
  highlightNeighborNodes: boolean;
}

export type RadioOptions = {
  user: Record<GeneProperties, Array<string>>;
  database: Record<GeneProperties, Array<GenePropertyMetadata>>;
};

/**
 * Universal Data of all the diseases to be mapped on left sidebar
 * It contains:
 * - ENSG ID of the gene
 *    - DiseaseType/`common(Pathway, Druggability)
 *    - DiseaseType/`ALS`
 */
export type UniversalData = Record<
  string,
  {
    common: CommonSection;
    user: CommonSection & OtherSection;
    [disease: string]: CommonSection | OtherSection;
  }
>;

export type CommonSection = Record<DiseaseIndependentProperties, Record<string, string>>;
export type OtherSection = Record<DiseaseDependentProperties, Record<string, string>>;
