import type { GeneInteractionType } from '@/lib/data';

/**
 * @interface GraphConfigForm defines the structure of the form used to generate the graph.
 */
export interface GraphConfigForm {
  /**
   * @description Seed genes are the initial set of genes used to generate the graph.
   * @example "BRCA1, TP53, EGFR"
   */
  seedGenes: string;

  /**
   * @description Disease data which is used to get property dropdown options.
   * @example "MONDO_0004976"
   */
  diseaseMap: string;

  /**
   * @description The way the graph is generated.
   * @example "0" graph contains only the seed genes and their interactions.
   * "1" graph contains the seed genes and their interactions, and the first layer of neighbors.
   * "2" graph contains the 0 order graph of the seed genes and their first layer of interactions.
   */
  order: '0' | '1' | '2';

  /**
   * @description Gene interaction type is used to filter the datasource used to generate the graph.
   */
  interactionType: GeneInteractionType;

  /**
   * @description The cut-off value for the minimum score of the edges in the graph.
   * @example "0.5"
   */
  minScore: string;
}
