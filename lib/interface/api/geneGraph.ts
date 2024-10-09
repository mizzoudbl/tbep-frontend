import type { Gene } from '../Gene';

export interface GeneGraphVariables {
  geneIDs: string[];
  minScore: number;
  order: number;
  interactionType: string;
}

export interface GeneGraphData {
  getGeneInteractions: {
    genes: Gene[];
    links: {
      gene1: {
        index: number;
      };
      gene2: {
        index: number;
      };
      score: number;
    }[];
  };
}
