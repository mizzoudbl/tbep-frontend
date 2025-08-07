import type React from 'react';

export const AssociationScoreLegend: React.FC<{ width?: number; height?: number }> = ({ width = 400, height = 62 }) => {
  const stops = ['#e3f0fa', '#c6e0f5', '#a8d1f0', '#8bc1eb', '#6eb2e6', '#519fe0', '#3186c8', '#2066a2', '#1565c0'];
  const rectWidth = 40;
  const rectHeight = 10;
  const barY = 18;
  const tickLabels = ['0.1', '0.2', '0.3', '0.4', '0.6', '0.7', '0.8', '0.9'];
  return (
    <svg width={width} height={height} viewBox='0 0 400 62' style={{ overflow: 'visible', display: 'block' }}>
      <title>Association score</title>
      {/* Color bar */}
      <g>
        {stops.map((color, i) => (
          <rect key={color} x={i * rectWidth} y={barY} width={rectWidth} height={rectHeight} fill={color} />
        ))}
      </g>
      {/* Ticks and labels */}
      <g fontSize={12} fontFamily='sans-serif' textAnchor='middle'>
        <text x={0} y={10} fill='#444' textAnchor='start' fontWeight='bold' fontSize='14'>
          Association score
        </text>
        {tickLabels.map((label, i) => (
          <text
            key={label}
            x={(i + 1) * rectWidth}
            y={barY + rectHeight + 18}
            fill='#444'
            fontWeight='normal'
            fontSize='15'
          >
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
};
