import type { PROPERTY_LABEL_TYPE_MAPPING } from '.';

export const nodeColor = [
  {
    label: 'Differential Expression',
    tooltipContent: (
      <>
        Differential Expression in Log2 fold change <br /> <b>Disclaimer:</b> We have provided this data for very few
        diseases like ALS,PSP,FTD. Users are encouraged to upload their own data through upload files button at the
        bottom.
      </>
    ),
  },
  {
    label: 'Target Disease Association',
    tooltipContent: (
      <>
        Target-Disease Association from{' '}
        <a href='https://platform.opentargets.org/' className='underline'>
          Opentargets
        </a>{' '}
        Platform
      </>
    ),
  },
  {
    label: 'Target Prioritization Factors',
    tooltipContent: (
      <>
        Target prioritization factors from{' '}
        <a href='https://platform.opentargets.org/' className='underline'>
          Opentargets
        </a>{' '}
        Platform
      </>
    ),
  },
  {
    label: 'Pathways',
    tooltipContent: (
      <>
        Pathways from{' '}
        <a href='http://www.genome.jp/kegg' className='underline'>
          KEGG
        </a>{' '}
        and{' '}
        <a href='https://reactome.org/' className='underline'>
          Reactome
        </a>{' '}
        databases
      </>
    ),
  },
  {
    label: 'Druggability',
    tooltipContent: (
      <>
        Druggability scores from{' '}
        <a href='https://astrazeneca-cgr-publications.github.io/DrugnomeAI/index.html' className='underline'>
          DrugnomeAI
        </a>
        /
        <a href='https://public.cgr.astrazeneca.com/mantisml/v2/index.html' className='underline'>
          Mantis-ML
        </a>
      </>
    ),
  },
  {
    label: 'Tissue Specificity',
    tooltipContent: (
      <>
        Tissue-specific expression from{' '}
        <a href='https://gtexportal.org/' className='underline'>
          GTEX
        </a>
        ,{' '}
        <a href='https://www.brain-map.org/' className='underline'>
          ABA(Alan Brain Atlas)
        </a>{' '}
        and{' '}
        <a href='https://www.proteinatlas.org/' className='underline'>
          HPA (Human Protein Atlas)
        </a>
      </>
    ),
  },
  {
    label: 'Custom',
    tooltipContent: (
      <>
        Custom information <br />
        <b>Disclaimer:</b> This information should provided by the user through custom upload. <br />
        <b>Column Prefix:</b> <i>Custom_Color</i>
      </>
    ),
  },
] as const;

export type NodeColorType = {
  [K in keyof typeof PROPERTY_LABEL_TYPE_MAPPING]: K extends (typeof nodeColor)[number]['label']
    ? (typeof PROPERTY_LABEL_TYPE_MAPPING)[K]
    : never;
}[keyof typeof PROPERTY_LABEL_TYPE_MAPPING];
