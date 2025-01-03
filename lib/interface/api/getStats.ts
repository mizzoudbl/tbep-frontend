/**
 * Interface for getStats API
 * @param headers: { common?: string[]; disease?: string[]; }
 * @interface GetStatsData
 */
export interface GetStatsData {
  /**
   * Headers for the dropdowns
   */
  headers: {
    /**
     * Diseases independent properties
     */
    common?: string[];
    /**
     * Diseases dependent properties
     */
    disease?: string[];
  };
}

/**
 * Interface for getStats variables
 * @param disease: string
 * @interface GetStatsVariables
 */
export interface GetStatsVariables {
  /**
   * Disease to search for
   */
  disease: string;
}
