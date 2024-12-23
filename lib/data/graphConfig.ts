export const diseaseTooltip: Record<string, string> = {
  ALS: 'Amyotrophic Lateral Sclerosis',
  FTD: 'Frontotemporal Dementia',
  OI: 'Osteogenesis Imperfecta',
  PSP: 'Progressive Supranuclear Palsy',
};

export const DISEASE_DEPENDENT_PROPERTIES = ['DEG', 'GDA', 'Genetics', 'OpenTargets'] as const;
export type DiseaseDependentProperties = (typeof DISEASE_DEPENDENT_PROPERTIES)[number];

export const DISEASE_INDEPENDENT_PROPERTIES = [
  'Pathway',
  'Druggability',
  'TE',
  'Database',
  'Custom',
  'OT_Prioritization',
] as const;
export type DiseaseIndependentProperties = (typeof DISEASE_INDEPENDENT_PROPERTIES)[number];

export const graphConfig = [
  {
    name: 'Order',
    id: 'order',
    options: [
      {
        label: 'Zero',
        value: '0',
      },
      {
        label: 'First',
        value: '1',
      },
      {
        label: 'Second',
        value: '2',
      },
    ],
  },
  {
    name: 'Interaction Type',
    id: 'interactionType',
    options: [
      {
        value: 'PPI',
        label: 'PPI',
      },
      {
        value: 'FUN_PPI',
        label: 'FunPPI',
      },
    ],
  },
  {
    name: 'Min Interaction Score',
    id: 'minScore',
    options: [
      { label: 'Highest (0.9)', value: '0.9' },
      { label: 'High (0.7)', value: '0.7' },
      { label: 'Medium (0.4)', value: '0.4' },
      { label: 'Low (0.15)', value: '0.15' },
    ],
  },
] as const;

export type GeneInteractionType = (typeof graphConfig)[1]['options'][number]['value'];

export interface GraphConfig {
  geneIDs: string[];
  diseaseMap: string;
  order: string;
  interactionType: GeneInteractionType;
  minScore: string;
  graphName: string;
}
