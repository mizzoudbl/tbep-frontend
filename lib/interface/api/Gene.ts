export interface Gene {
  /**
   * Gene ID
   */
  ID: string;

  /**
   * Gene name
   */
  Gene_name?: string;

  /**
   * Gene description
   */
  Description?: string;

  /**
   * HGNC gene ID
   */
  hgnc_gene_id?: string;

  /**
   * Disease independent properties
   */
  common?: Record<string, string>;

  /**
   * Disease dependent properties
   */
  disease?: Record<string, Record<string, string>>;
}

export interface GeneBase {
  /**
   * Gene ID
   */
  ID: string;

  /**
   * Gene name
   */
  Gene_name?: string;

  /**
   * Gene description
   */
  Description?: string;

  /**
   * HGNC gene ID
   */
  hgnc_gene_id?: string;
}
