export const nodeColor = [
  {
    label: 'None',
    tooltipContent: null,
  },
  {
    label: 'DEG',
    tooltipContent: 'Differential Expression in Log2 fold change',
  },
  {
    label: 'GDA',
    tooltipContent: 'Gene Disease Association score',
  },
  {
    label: 'Genetics',
    tooltipContent: 'Odd ratio or Beta-values from population studies',
  },
  {
    label: 'Pathway',
    tooltipContent: 'Pathway membership from MSigDB',
  },
  {
    label: 'Druggability',
    tooltipContent: 'Druggability score from MantisML and Open Target',
  },
  {
    label: 'TE',
    tooltipContent: 'Tissue-specific expression from GTEX and HPA',
  },
  {
    label: 'Database',
    tooltipContent: 'Membership in various databases',
  },
  {
    label: 'Custom',
    tooltipContent: 'Custom informations',
  },
] as const;

export type NodeColorType = (typeof nodeColor)[number]['label'];
