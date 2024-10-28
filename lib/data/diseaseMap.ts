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
