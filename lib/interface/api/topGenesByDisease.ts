export interface TopGeneData {
  topGenesByDisease: {
    gene_name: string;
  }[];
}

export interface TopGeneVariables {
  diseaseId: string;
  limit?: number;
}
