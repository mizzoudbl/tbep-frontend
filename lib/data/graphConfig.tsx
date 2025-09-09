export const PROPERTY_LABEL_TYPE_MAPPING = {
  'Differential Expression': 'DEG',
  'Target Disease Association': 'OpenTargets',
  'Target Prioritization Factors': 'OT_Prioritization',
  Pathways: 'Pathway',
  Druggability: 'Druggability',
  'Tissue Specificity': 'TE',
  Custom: 'Custom_Color',
} as const;

export const PROPERTY_TYPE_LABEL_MAPPING = {
  DEG: 'Differential Expression',
  OpenTargets: 'Target Disease Association',
  OT_Prioritization: 'Target Prioritization Factors',
  Pathway: 'Pathways',
  Druggability: 'Druggability',
  TE: 'Tissue Specificity',
  Custom_Color: 'Custom',
} as const;

export const DISEASE_DEPENDENT_PROPERTIES = ['DEG', 'OpenTargets'] as const;
export const DISEASE_INDEPENDENT_PROPERTIES = [
  'Pathway',
  'Druggability',
  'TE',
  'Custom_Color',
  'OT_Prioritization',
] as const;

export type DiseaseDependentProperties = (typeof DISEASE_DEPENDENT_PROPERTIES)[number];
export type DiseaseIndependentProperties = (typeof DISEASE_INDEPENDENT_PROPERTIES)[number];
export type GeneProperties = DiseaseDependentProperties | DiseaseIndependentProperties;

export const graphConfig = [
  {
    name: 'Network Type',
    id: 'order',
    tooltipContent: (
      <>
        <u>Control how graph is created</u> <br />
        <b>Base Network:</b> only interconnections between seed genes
        <br />
        <b>Expanded Network:</b> interconnections between seed genes and their first neighbors
      </>
    ),
    options: [
      {
        label: 'Base Network',
        value: '0',
      },
      {
        label: 'Expanded Network',
        value: '2',
      },
    ],
  },
  {
    name: 'Min Interaction Score',
    id: 'minScore',
    tooltipContent: (
      <>
        <u>Minimum interaction score to consider an interaction</u>
        <br />
        Higher values may result in a smaller graph
        <br />
        Lower values may result in a larger graph
      </>
    ),
    options: [
      { label: 'High (0.9)', value: '0.9' },
      { label: 'Medium (0.7)', value: '0.7' },
      { label: 'Low (0.4)', value: '0.4' },
    ],
  },
] as const;

export interface GraphConfig {
  geneIDs: string[];
  diseaseMap: string;
  order: string;
  interactionType: GeneInteractionType[];
  minScore: string;
  graphName: string;
}

export const interactionTypeMap: Record<string, string> = {
  PPI: 'STRING',
  INT_ACT: 'IntAct',
  BIO_GRID: 'BioGrid',
} as const;
export type GeneInteractionType = 'PPI' | 'INT_ACT' | 'BIO_GRID';
