export const diseaseMap = ['PSP', 'ALS', 'FTD', 'OI'] as const;
export const diseaseTooltip = {
  ALS: 'Amyotrophic Lateral Sclerosis',
  FTD: 'Frontotemporal Dementia',
  OI: 'Osteogenesis Imperfecta',
  PSP: 'Progressive Supranuclear Palsy',
};

export type DiseaseType = (typeof diseaseMap)[number];
