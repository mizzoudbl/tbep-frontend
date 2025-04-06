import type { PROPERTY_LABEL_TYPE_MAPPING } from '.';

export const nodeSize = [
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
    label: 'Druggability',
    tooltipContent: (
      <>
        Druggability scores from{' '}
        <a href='https://astrazeneca-cgr-publications.github.io/DrugnomeAI/index.html' className='underline'>
          DrugnomeAI
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
] as const;

export type NodeSizeType = {
  [K in keyof typeof PROPERTY_LABEL_TYPE_MAPPING]: K extends (typeof nodeSize)[number]['label']
    ? (typeof PROPERTY_LABEL_TYPE_MAPPING)[K]
    : never;
}[keyof typeof PROPERTY_LABEL_TYPE_MAPPING];
