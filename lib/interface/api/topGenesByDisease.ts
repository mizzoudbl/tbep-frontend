export interface TopGeneData {
  topGenesByDisease: {
    gene_name: string;
  }[];
}

/**
 * Interface for topGenes variables
 * @interface OpenTargetsTableVariables
 */
export interface TopGeneVariables {
  /**
   * Disease ID
   */
  diseaseId: string;
  /**
   * Pagination
   */
  page: {
    /**
     * Page number
     */
    page: number;
    /**
     * Limit of items per page
     */
    limit: number;
  };
}
