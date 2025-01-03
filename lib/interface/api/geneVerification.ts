import type { Gene } from '.';

/**
 * API data for gene verification in index page
 * @interface GeneVerificationData
 */
export interface GeneVerificationData {
  /**
   * Genes to be displayed in the table
   */
  genes: Gene[];

  /**
   * User ID
   */
  userID?: string;
}

/**
 * Variables for gene verification GraphQL query
 * @interface GeneVerificationVariables
 */
export interface GeneVerificationVariables {
  /**
   * Gene IDs to be verified
   */
  geneIDs: string[];
}
