import type { GraphologyWorkerLayout } from '@/components/graph';
import type { SerializedGraph } from 'graphology-types';
import type { Fa2Settings } from './Fa2Settings';
import type { EdgeAttributes, NodeAttributes } from './index';

export interface GraphStore {
  nodeSearchQuery: string;
  setNodeSearchQuery: (nodeSearchQuery: string) => void;
  fa2Worker: GraphologyWorkerLayout;
  setFa2Worker: (fa2Worker: GraphologyWorkerLayout) => void;
  fa2Settings: Fa2Settings;
  setFa2Settings: (settings: Fa2Settings) => void;
  graph: Partial<SerializedGraph<NodeAttributes, EdgeAttributes>>;
  setGraph: (graph: Partial<SerializedGraph<NodeAttributes, EdgeAttributes>>) => void;
  defaultNodeColor: string;
  defaultNodeSize: number;
  defaultLabelRenderedSizeThreshold: number;
  defaultEdgeColor: string;
  selectedNodes: string[];
  selectedRadioNodeColor: string;
  selectedRadioNodeSize: string;
}
