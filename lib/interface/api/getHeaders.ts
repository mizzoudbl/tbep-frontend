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
  description?: string;
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
    /**
     * Diseases independent properties
     */
    common?: GenePropertyMetadata[];
    /**
     * Diseases dependent properties
     */
    disease?: GenePropertyMetadata[];
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
  disease: string;
}
