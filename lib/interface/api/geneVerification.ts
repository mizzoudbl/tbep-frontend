import type { Gene } from '../Gene';

export interface GeneVerificationData {
  getGenes: Gene[];
}

export interface GeneVerificationVariables {
  geneIDs: string[];
}