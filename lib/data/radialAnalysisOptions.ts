export const radialAnalysisOptions = [
  {
    key: 'edgeWeightCutOff',
    label: 'Edge Weight Cut-off',
    tooltip: 'Removes edges with weight less than the cut-off value',
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: 'nodeDegreeCutOff',
    label: 'Node Degree Cut-off',
    tooltip: 'Highlights nodes with degree greater than the cut-off value',
    min: 0,
    max: 50,
    step: 1,
  },
  {
    key: 'hubGeneEdgeCount',
    label: 'Hub Genes',
    tooltip: 'Highlights nodes with degree greater than the cut-off value',
    min: 0,
    max: 50,
    step: 1,
  },
] as const;
