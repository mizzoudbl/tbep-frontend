export interface RadialAnalysisSetting {
  /**
   * Edge Weight Cut-off
   */
  edgeWeightCutOff: number;

  /**
   * Node Degree Cut-off
   */
  nodeDegreeCutOff: number;

  /**
   * Hub Node Degree Cut-off
   */
  hubGeneEdgeCount: number;

  /**
   * Node Degree Cut-off Property
   */
  nodeDegreeProperty: string;
}
