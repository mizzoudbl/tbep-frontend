import type { PROPERTY_LABEL_TYPE_MAPPING } from '.';

export const nodeColor = [
  {
    label: 'Differential Expression',
    tooltipContent: 'Differential Expression in Log2 fold change',
  },
  {
    label: 'Target Disease Association',
    tooltipContent: 'Target-Disease Association from Opentargets Platform',
  },
  {
    label: 'Target Prioritization Factors',
    tooltipContent: 'Target prioritization factors from Opentargets Platform',
  },
  {
    label: 'Pathways',
    tooltipContent: 'Pathways from KEGG and Reactome databases',
  },
  {
    label: 'Druggability',
    tooltipContent: 'Druggability scores from DrugnomeAI/Mantis-ML',
  },
  {
    label: 'Tissue Specificity',
    tooltipContent: 'Tissue-specific expression from GTEX and HPA',
  },
  {
    label: 'Custom',
    tooltipContent: 'Custom informations',
  },
] as const;

export type NodeColorType = {
  [K in keyof typeof PROPERTY_LABEL_TYPE_MAPPING]: K extends (typeof nodeColor)[number]['label']
    ? (typeof PROPERTY_LABEL_TYPE_MAPPING)[K]
    : never;
}[keyof typeof PROPERTY_LABEL_TYPE_MAPPING];
