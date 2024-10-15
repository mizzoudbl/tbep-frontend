export const diseaseMap = ['PSP', 'ALS', 'FTD', 'OI'] as const;

export type DiseaseType = (typeof diseaseMap)[number];
