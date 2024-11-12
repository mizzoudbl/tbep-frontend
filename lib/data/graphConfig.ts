export const diseaseMap = ['PSP', 'ALS', 'FTD', 'OI'] as const;
export const diseaseTooltip = {
  ALS: 'Amyotrophic Lateral Sclerosis',
  FTD: 'Frontotemporal Dementia',
  OI: 'Osteogenesis Imperfecta',
  PSP: 'Progressive Supranuclear Palsy',
};

export const diseaseDependentProperties = ['logFC', 'GDA', 'Genetics'] as const;
export type DiseaseDependentProperties = (typeof diseaseDependentProperties)[number];

export const diseaseIndependentProperties = ['Pathways', 'Druggability', 'TE', 'Database', 'Custom'] as const;
export type DiseaseIndependentProperties = (typeof diseaseIndependentProperties)[number];

export type DiseaseType = (typeof diseaseMap)[number];

export const graphConfig = [
  {
    name: 'Disease Map',
    id: 'diseaseMap',
    options: diseaseMap.map(disease => ({ label: disease, value: disease })),
  },
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
      {
        value: 'BIKG',
        label: 'BIKG',
      },
      {
        value: 'ComPPLete',
        label: 'ComPPLete',
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

export type GeneInteractionType = (typeof graphConfig)[2]['options'][number]['value'];
