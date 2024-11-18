export interface GetStatsData {
  getHeaders: {
    common?: string[];
    disease?: string[];
  };
}

export interface GetStatsVariables {
  disease: string;
}
