/**
 * Type for GenePropertyMetadata
 * @param name: string
 * @param description: string
 * Used in @interface GetHeadersData
 */
export type GenePropertyMetadata = {
  /**
   * Property name
   */
  name: string;
  /**
   * Property description
   */
  description?: React.ReactNode;
};

/**
 * Interface for getStats API
 * @param headers: { common?: string[]; disease?: string[]; }
 * @interface GetHeadersData
 */
export interface GetHeadersData {
  /**
   * Headers for the dropdowns
   */
  headers: {
    differentialExpression: GenePropertyMetadata[];
    openTargets: GenePropertyMetadata[];
    targetPrioritization: GenePropertyMetadata[];
    druggability: GenePropertyMetadata[];
    pathway: GenePropertyMetadata[];
    tissueSpecificity: GenePropertyMetadata[];
  };
}

/**
 * Interface for getStats variables
 * @param disease: string
 * @interface GetHeadersVariables
 */
export interface GetHeadersVariables {
  /**
   * Disease to search for
   */
  diseaseId: string;

  /**
   * Whether to skip common field
   */
  skipCommon: boolean;
}
