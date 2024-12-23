export const nodeSize = [
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
    label: 'OpenTargets',
    tooltipContent: 'Target-Disease Association from Opentargets Platform',
  },
  {
    label: 'Genetics',
    tooltipContent: 'Associations between traits, variants, and genes from OpenTargets Genetics',
  },
  {
    label: 'OT_Prioritization',
    tooltipContent: 'Target prioritization factors from OpenTargets Platform',
  },
  {
    label: 'Druggability',
    tooltipContent: 'Druggability scores from DrugnomeAI/Mantis-ML',
  },
  {
    label: 'TE',
    tooltipContent: 'Tissue-specific expression from GTEX and HPA',
  },
] as const;

export type NodeSizeType = (typeof nodeSize)[number]['label'];
