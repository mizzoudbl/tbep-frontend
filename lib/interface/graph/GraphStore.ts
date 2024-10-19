import type { DiseaseType, NodeColorType, NodeSizeType } from '@/lib/data';
import type { WorkerLayoutForceHook } from '@/lib/graphology-force-v2';
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
  diseaseName: DiseaseType;

  /**
   * Universal Data of all the diseases to be mapped on left sidebar
   */
  universalData: UniversalData | null;

  /**
   * Initial Copy of Universal data
   */
  initialUniversalData: UniversalData | null;

  /**
   * Options for radio buttons
   */
  radioOptions: RadioOptions;

  /**
   * Initial Copy of Radio Options
   */
  initialRadioOptions: RadioOptions;

  /**
   * Selected Node Size Property
   */
  selectedNodeSizeProperty: string;

  /**
   * Selected Node Color Property
   */
  selectedNodeColorProperty: string;
}

export type RadioOptions = Record<NodeColorType | NodeSizeType, Array<string>>;

/**
 * Universal Data of all the diseases to be mapped on left sidebar
 * It contains:
 * - ENSG ID of the gene
 *    - DiseaseType/`common(Pathways, Druggability)
 *    - DiseaseType/`ALS`
 */
export type UniversalData = {
  [key: string]: {
    common: {
      Pathways: Record<string, string>;
      Druggability: Record<string, string>;
      TE: Record<string, string>;
      Database: Record<string, string>;
      Custom: Record<string, string>;
    };
    ALS?: {
      logFC: Record<string, string>;
      GDA: Record<string, string>;
      Genetics: Record<string, string>;
      TE: Record<string, string>;
      Database: Record<string, string>;
    };
    PSP?: {
      logFC: Record<string, string>;
      GDA: Record<string, string>;
      Genetics: Record<string, string>;
      TE: Record<string, string>;
      Database: Record<string, string>;
    };
    FTD?: {
      logFC: Record<string, string>;
      GDA: Record<string, string>;
      Genetics: Record<string, string>;
      TE: Record<string, string>;
      Database: Record<string, string>;
    };
    OI?: {
      logFC: Record<string, string>;
      GDA: Record<string, string>;
      Genetics: Record<string, string>;
      TE: Record<string, string>;
      Database: Record<string, string>;
    };
  };
};
