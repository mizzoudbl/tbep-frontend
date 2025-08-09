export interface ScoredKeyValue {
  /**
   * Key of the scored value
   * Example: "score", "Europe PMC", etc.
   */
  key: string;
  /**
   * Score associated with the key
   */
  score: number;
}

export interface Target {
  /**
   * Unique identifier for the target (e.g. ENSG ID)
   */
  id: string;

  /**
   * Name of the target
   */
  name: string;

  /**
   * Prioritization scores for the target
   */
  prioritization?: ScoredKeyValue[];
}

export interface OpenTargetsTableData {
  /**
   * Reducer for the Open Targets table data
   */
  targetDiseaseAssociationTable: {
    rows: {
      /**
       * Target Gene information
       */
      target: Target;

      /**
       * Scores from various data sources
       */
      datasourceScores: ScoredKeyValue[];

      /**
       * Overall score for the target
       */
      overall_score: number;
    }[];

    totalCount: number;
  };
}

export enum OrderByEnum {
  SCORE = 'SCORE',
  EUROPE_PMC = 'EUROPE_PMC',
  CHEMBL = 'CHEMBL',
  GEL_PANEL_APP = 'GEL_PANEL_APP',
  GWAS_ASSOCIATIONS = 'GWAS_ASSOCIATIONS',
  IMPC = 'IMPC',
  CANCER_GENE_CENSUS = 'CANCER_GENE_CENSUS',
  CLINVAR = 'CLINVAR',
  INTOGEN = 'INTOGEN',
  UNIPROT_CURATED_VARIANTS = 'UNIPROT_CURATED_VARIANTS',
  ORPHANET = 'ORPHANET',
  UNIPROT_LITERATURE = 'UNIPROT_LITERATURE',
  GENE_BURDEN = 'GENE_BURDEN',
  CLINVAR_SOMATIC = 'CLINVAR_SOMATIC',
  GENE2PHENOTYPE = 'GENE2PHENOTYPE',
  CLINGEN = 'CLINGEN',
  REACTOME = 'REACTOME',
  EXPRESSION_ATLAS = 'EXPRESSION_ATLAS',
  CRISPR_SCREENS = 'CRISPR_SCREENS',
  GENE_SIGNATURES = 'GENE_SIGNATURES',
  CANCER_BIOMARKERS = 'CANCER_BIOMARKERS',
  PROJECT_SCORE = 'PROJECT_SCORE',
  SLAPENRICH = 'SLAPENRICH',
  PROGENY = 'PROGENY',
}

/**
 * Interface for getStats variables
 * @interface OpenTargetsTableVariables
 */
export interface OpenTargetsTableVariables {
  /**
   * Disease ID
   */
  diseaseId: string;
  /**
   * Gene IDs
   */
  geneIds: string[];
  /**
   * Order by
   */
  orderBy: OrderByEnum;
  /**
   * Pagination
   */
  page: {
    /**
     * Page number
     */
    page: number;
    /**
     * Limit of items per page
     */
    limit: number;
  };
}
