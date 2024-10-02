export interface Gene {
    ID: string;
    Gene_name: string;
    Description: string;
    hgnc_gene_id?: string;
    common?: Record<string, string>;
    ALS?: Record<string, string>;
    FTD?: Record<string, string>;
    OI?: Record<string, string>;
    PSP?: Record<string, string>;
}