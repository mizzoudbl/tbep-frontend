'use client';

import { generateColorTransition } from '@/lib/utils';
import { scaleLinear } from 'd3-scale';
import React, { createRef, useEffect, useRef } from 'react';

export function HeatmapLegend({
  width = 200,
  height = 50,
  title,
  domain,
  range,
  divisions = 10,
  formatLabel = value => value.toFixed(1),
}: {
  width?: number;
  height?: number;
  title?: string;
  formatLabel?: (value: number) => string;
  domain: number[];
  range: string[];
  divisions?: number;
}) {
  const svgRef = createRef<SVGSVGElement>();
  const colorScale = scaleLinear(domain, range);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const gradientId = 'greenRedGradient';
    const legendHeight = height / 3;

    // Clear any existing content
    svg.innerHTML = '';

    // Create the SVG elements
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    linearGradient.setAttribute('id', gradientId);
    linearGradient.setAttribute('x1', '0%');
    linearGradient.setAttribute('y1', '0%');
    linearGradient.setAttribute('x2', '100%');
    linearGradient.setAttribute('y2', '0%');

    colorScale.ticks(divisions).forEach((num, index) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', `${(index / (divisions - 1)) * 100}%`);
      stop.setAttribute('stop-color', colorScale(num));
      linearGradient.appendChild(stop);
    });

    defs.appendChild(linearGradient);
    svg.appendChild(defs);

    // Create the gradient rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '10');
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', legendHeight.toString());
    rect.setAttribute('fill', `url(#${gradientId})`);
    svg.appendChild(rect);

    // Add tick marks and labels
    for (let i = 0; i <= divisions; i++) {
      const x = (i / divisions) * width;
      const value = domain.at(0)! + (i / divisions) * (domain.at(-1)! - domain.at(0)!);

      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', x.toString());
      tick.setAttribute('y1', (10 + legendHeight).toString());
      tick.setAttribute('x2', x.toString());
      tick.setAttribute('y2', (15 + legendHeight).toString());
      tick.setAttribute('stroke', 'black');
      svg.appendChild(tick);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', i ? x.toString() : '5');
      label.setAttribute('y', (25 + legendHeight).toString());
      label.setAttribute('font-size', '10');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = formatLabel(value);
      svg.appendChild(label);
    }

    // Add title
    const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleElement.setAttribute('x', (width / 2).toString());
    titleElement.setAttribute('y', '9');
    titleElement.setAttribute('font-size', '12');
    titleElement.setAttribute('font-weight', 'bold');
    titleElement.setAttribute('text-anchor', 'middle');
    titleElement.textContent = title ?? null;
    svg.appendChild(titleElement);
  }, [width, height, title, domain, divisions, formatLabel, colorScale, svgRef]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
