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
    key: 'candidatePrioritizationCutOff',
    label: 'Candidate Prioritization Cut-off',
    tooltip: 'Hides nodes with degree less than the cut-off value',
    min: 0,
    max: 50,
    step: 1,
  },
  {
    key: 'seedGeneProximityCutOff',
    label: 'Seed Proximity Cut-off',
    tooltip: 'Highlights nodes with degree greater than the cut-off value calculated interactions among seed genes',
    min: 0,
    max: 50,
    step: 1,
  },
] as const;
