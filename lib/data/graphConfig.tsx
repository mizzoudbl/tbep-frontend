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
    name: 'Order',
    id: 'order',
    tooltipContent: (
      <>
        <u>Control how graph is created</u> <br />
        <b>0 order:</b> only interconnections between seed genes
        <br />
        <b>1st order:</b> connections between seed genes and their first neighbors
        <br />
        <b>2nd order:</b> interconnections between seed genes and their first neighbors
      </>
    ),
    options: [
      {
        label: 'Zero',
        value: '0',
      },
      {
        label: 'First',
        value: '1',
      },
      {
        label: 'Second',
        value: '2',
      },
    ],
  },
  {
    name: 'Interaction Type',
    id: 'interactionType',
    tooltipContent: (
      <>
        <u>Interaction Database to generate the graph</u>
        <br />
        <b>STRING:</b> Protein-Protein Interactions
        <br />
        <b>IntAct:</b> Molecular Interaction Database
        <br />
        <b>BioGrid:</b> Biological General Repository for Interaction Datasets
      </>
    ),
    options: [
      {
        value: 'PPI',
        label: 'STRING',
      },
      {
        value: 'INT_ACT',
        label: 'IntAct',
      },
      {
        value: 'BIO_GRID',
        label: 'BioGrid',
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
      { label: 'Highest (0.9)', value: '0.9' },
      { label: 'High (0.7)', value: '0.7' },
      { label: 'Medium (0.4)', value: '0.4' },
      { label: 'Low (0.15)', value: '0.15' },
    ],
  },
] as const;

export type GeneInteractionType = (typeof graphConfig)[1]['options'][number]['value'];
export interface GraphConfig {
  geneIDs: string[];
  diseaseMap: string;
  order: string;
  interactionType: GeneInteractionType;
  minScore: string;
  graphName: string;
}
