import type { GeneBase } from '.';

/**
 * Variables for gene graph GraphQL query
 * @interface GeneGraphVariables
 */
export interface GeneGraphVariables {
  /**
   * Gene IDs to be verified
   */
  geneIDs: string[];

  /**
   * Minimum score of the interactions
   */
  minScore: number;

  /**
   * One of 0th, 1st, 2nd Order of graph
   */
  order: number;

  /**
   * Various Interaction Type like BIKG, PPI, FUN_PPI etc
   */
  interactionType: string;
}

/**
 * GraphQL API Response of baseline network
 */
export interface GeneGraphData {
  /**
   * Reducer of GraphQL which gives the network
   */
  getGeneInteractions: {
    /**
     * List of genes
     * @inheritdoc Gene
     */
    genes: GeneBase[];

    /**
     * List of interactions between genes
     */
    links: {
      /**
       * ID of gene1 in genes array
       */
      gene1: string;

      /**
       * ID of gene2 in genes array
       */
      gene2: string;

      /**
       * Combined score of the interaction
       */
      score: number;
    }[];

    /**
     * Name of the graph
     */
    graphName: string;
  };
}
