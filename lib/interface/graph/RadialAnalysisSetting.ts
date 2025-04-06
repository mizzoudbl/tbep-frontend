export interface RadialAnalysisSetting {
  /**
   * Edge Weight Cut-off
   */
  edgeWeightCutOff: number;

  /**
   * Node Degree Cut-off
   */
  candidatePrioritizationCutOff: number;

  /**
   * Hub Node Degree Cut-off
   */
  hubGeneCutOff: number;

  /**
   * Node Degree Cut-off Property
   */
  nodeDegreeProperty: string;
}
