import type { ScoredKeyValue } from '.';

export enum GenePropertyCategoryEnum {
  DIFFERENTIAL_EXPRESSION = 'DIFFERENTIAL_EXPRESSION',
  OPEN_TARGETS = 'OPEN_TARGETS',
  OT_PRIORITIZATION = 'OT_PRIORITIZATION',
  PATHWAY = 'PATHWAY',
  DRUGGABILITY = 'DRUGGABILITY',
  TISSUE_EXPRESSION = 'TISSUE_EXPRESSION',
}

/**
 * Configuration for the query for getting fields
 */
export interface DataRequired {
  /**
   * Disease name of the properties (optional)
   */
  diseaseId?: string;

  /**
   * Category of the properties
   */
  category: GenePropertyCategoryEnum;

  /**
   * Properties to be queried
   */
  properties: string[];
}

/**
 * Variables for gene property data GraphQL query
 * @interface GenePropertiesDataVariables
 */
export interface GenePropertiesDataVariables {
  /**
   * Gene Ids to be queried
   */
  geneIds: string[];

  /**
   * Configuration for the query for getting fields
   */
  config?: DataRequired[];
}

/**
 * API data for gene universal data in index page
 * @interface GenePropertiesData
 */
export interface GenePropertiesData {
  /**
   * Genes to be displayed in the table
   */
  geneProperties: {
    /**
     * ENSG Id of the gene
     */
    ID: string;

    data: GenePropertyData[];
  }[];
}

export interface GenePropertyData extends ScoredKeyValue {
  /**
   * Disease Id
   * Example: "MONDO_0004976" // Amyotrophic lateral sclerosis
   */
  diseaseId?: string;

  /**
   * Category of the gene property
   */
  category: GenePropertyCategoryEnum;
}
