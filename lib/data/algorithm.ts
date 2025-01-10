export const algorithms = [
  {
    name: 'None',
    parameters: [],
  },
  {
    name: 'Leiden',
    parameters: [
      {
        type: 'slider',
        displayName: 'Resolution',
        name: 'resolution',
        defaultValue: 1.0,
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      {
        type: 'slider',
        displayName: 'Minimum Community Size',
        name: 'minCommunitySize',
        defaultValue: 4,
        min: 1,
        max: 50,
        step: 1,
      },
      {
        type: 'checkbox',
        displayName: 'Weighted',
        name: 'weighted',
        defaultValue: true,
      },
    ],
  },
];

export type AlgorithmType = (typeof algorithms)[number]['name'];
