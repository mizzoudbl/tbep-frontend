export const interactionType = [
  {
    value: 'PPI',
    label: 'PPI',
  },
  {
    value: 'FUN_PPI',
    label: 'FunPPI',
  },
  {
    value: 'BIKG',
    label: 'BIKG',
  },
  {
    value: 'ComPPLete',
    label: 'ComPPLete',
  },
] as const;

export type GeneInteractionType = (typeof interactionType)[number]['value'];
