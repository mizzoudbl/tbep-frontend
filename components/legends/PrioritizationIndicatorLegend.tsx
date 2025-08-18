import type React from 'react';

export const PrioritizationIndicatorLegend: React.FC<{ width?: number; height?: number }> = ({
  width = 320,
  height = 50,
}) => {
  const stops = [
    'rgb(160, 24, 19)',
    'rgb(188, 58, 25)',
    'rgb(214, 90, 31)',
    'rgb(224, 129, 69)',
    'rgb(227, 167, 114)',
    'rgb(230, 202, 156)',
    'rgb(236, 234, 218)',
    'rgb(197, 210, 193)',
    'rgb(158, 186, 168)',
    'rgb(120, 162, 144)',
    'rgb(82, 139, 120)',
    'rgb(47, 115, 95)',
    'rgb(46, 89, 67)',
  ];
  const rectWidths = [25, 24, 25, 24, 25, 25, 24, 25, 25, 24, 25, 24, 25];
  // x positions for each rect
  const rectXs = rectWidths.reduce((acc, _w, i) => {
    acc.push((acc[i - 1] ?? 0) + (i > 0 ? rectWidths[i - 1] : 0));
    return acc;
  }, [] as number[]);
  return (
    <svg width={width} height={height} viewBox='0 0 320 50' style={{ overflow: 'visible', display: 'block' }}>
      <title>Prioritisation indicator</title>
      {/* Color bar */}
      <g>
        {stops.map((color, i) => (
          <rect key={color} x={rectXs[i]} y={18} width={rectWidths[i]} height={10} fill={color} />
        ))}
      </g>
      {/* Ticks and labels */}
      <g
        transform='translate(0,28)'
        className='ticks'
        fill='none'
        fontSize={10}
        fontFamily='sans-serif'
        textAnchor='middle'
      >
        {/* Unfavourable label */}
        <g className='tick' opacity='1' transform={`translate(${rectXs[1] + rectWidths[1] / 2},0)`}>
          <text fill='currentColor' y={9} dy='0.71em' fontWeight='bold' fontSize='10px'>
            Unfavourable
          </text>
        </g>
        {/* Favourable label */}
        <g
          className='tick'
          opacity='1'
          transform={`translate(${rectXs[rectXs.length - 2] + rectWidths[rectWidths.length - 2] / 2},0)`}
        >
          <text fill='currentColor' y={9} dy='0.71em' fontWeight='bold' fontSize='10px'>
            Favourable
          </text>
        </g>
        {/* Title */}
        <text x={0} y={-16} fill='currentColor' textAnchor='start' fontWeight='bold' fontSize='10px'>
          Prioritisation indicator
        </text>
      </g>
    </svg>
  );
};
