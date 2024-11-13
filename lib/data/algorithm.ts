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
        name: 'resolution',
        defaultValue: 1.0,
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      {
        type: 'checkbox',
        name: 'weighted',
        defaultValue: true,
      },
    ],
  },
];

export type AlgorithmType = (typeof algorithms)[number]['name'];
