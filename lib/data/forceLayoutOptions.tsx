export const forceLayoutOptions = [
  {
    key: 'linkDistance',
    label: 'Link Distance',
    tooltip: 'Distance between connected nodes',
    min: 1,
    max: 1000,
    step: 10,
  },
  {
    key: 'chargeStrength',
    label: 'Charge Strength',
    tooltip: (
      <>
        <b>Negative</b> is repulsion strength and <b>positive</b> is attraction strength between nodes
      </>
    ),
    min: -2000,
    max: 50,
    step: 10,
  },
] as const;
