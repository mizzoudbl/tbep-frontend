import type { Gene } from '.';

/**
 * API data for gene universal data in index page
 * @interface GeneUniversalData
 */
export interface DataRequired {
  /**
   * Disease name of the properties (optional)
   */
  disease?: string;

  /**
   * Properties to be queried
   */
  properties: string[];
}

/**
 * Variables for gene universal data GraphQL query
 * @interface GeneUniversalDataVariables
 */
export interface GeneUniversalDataVariables {
  /**
   * Gene IDs to be queried
   */
  geneIDs: string[];

  /**
   * Configuration for the query for getting fields
   */
  config?: DataRequired[];
}

/**
 * API data for gene universal data in index page
 * @interface GeneUniversalData
 */
export interface GeneUniversalData {
  /**
   * Genes to be displayed in the table
   */
  genes: Gene[];
}
