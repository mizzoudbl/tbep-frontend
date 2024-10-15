export const nodeSize = [
  {
    label: 'None',
    tooltipContent: null,
  },
  {
    label: 'logFC',
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
    label: 'Druggability',
    tooltipContent: 'Druggability score from MantisML and Open Target',
  },
  {
    label: 'TE',
    tooltipContent: 'Tissue-specific expression from GTEX and HPA',
  },
] as const;

export type NodeSizeType = (typeof nodeSize)[number]['label'];
