import type { Gene } from '.';

export interface DataRequired {
  disease?: string;
  properties: string[];
}

export interface GeneUniversalDataVariables {
  geneIDs: string[];
  config?: DataRequired[];
}

export interface GeneUniversalData {
  getGenes: Gene[];
}
