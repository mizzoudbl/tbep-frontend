'use client';

import { useStore } from '@/lib/hooks';
import React, { createRef } from 'react';

export function BinaryLegend({
  width = 200,
  height = 50,
}: {
  width?: number;
  height?: number;
}) {
  const svgRef = createRef<SVGSVGElement>();
  const defaultNodeColor = useStore(state => state.defaultNodeColor);

  React.useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    svg.innerHTML = '';
    const circlePresent = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circlePresent.setAttribute('cx', (width * 0.1).toString());
    circlePresent.setAttribute('cy', (height * 0.2).toString());
    circlePresent.setAttribute('r', (height * 0.1).toString());
    circlePresent.setAttribute('fill', 'red');

    const circleNotPresent = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleNotPresent.setAttribute('cx', (width * 0.1).toString());
    circleNotPresent.setAttribute('cy', (height * 0.6).toString());
    circleNotPresent.setAttribute('r', (height * 0.1).toString());
    circleNotPresent.setAttribute('fill', defaultNodeColor);

    const textPresent = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textPresent.setAttribute('x', (width * 0.2).toString());
    textPresent.setAttribute('y', (height * 0.27).toString());
    textPresent.setAttribute('fill', 'black');
    textPresent.setAttribute('font-size', (height * 0.3).toString());
    textPresent.textContent = 'Present';

    const textNotPresent = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textNotPresent.setAttribute('x', (width * 0.2).toString());
    textNotPresent.setAttribute('y', (height * 0.67).toString());
    textNotPresent.setAttribute('fill', 'black');
    textNotPresent.setAttribute('font-size', (height * 0.3).toString());
    textNotPresent.textContent = 'Not Present';

    svg.appendChild(circlePresent);
    svg.appendChild(circleNotPresent);
    svg.appendChild(textPresent);
    svg.appendChild(textNotPresent);
  }, [defaultNodeColor, width, height, svgRef]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
