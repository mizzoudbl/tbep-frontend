import type { Gene } from './Gene';

export interface GeneUniversalDataVariables {
  geneIDs: string[];
}

export interface GeneUniversalData {
  getGenes: Gene[];
}
