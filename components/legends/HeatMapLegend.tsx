'use client';

import { scaleLinear } from 'd3-scale';
import { createRef, useEffect } from 'react';

export function HeatmapLegend({
  height = 50,
  title,
  domain = [0, 1],
  range,
  startLabel,
  endLabel,
  divisions = 10,
  formatLabel = value => value.toFixed(1),
}: {
  height?: number;
  title?: string;
  formatLabel?: (value: number) => string;
  domain?: number[];
  range: string[];
  startLabel?: string;
  endLabel?: string;
  divisions?: number;
}) {
  const svgRef = createRef<SVGSVGElement>();
  const colorScale = scaleLinear(domain, range);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const gradientId = `${range.map(color => color.replace(/[#()]/g, '')).join('-')}-gradient`;
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
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', legendHeight.toString());
    rect.setAttribute('fill', `url(#${gradientId})`);
    svg.appendChild(rect);

    // Add tick marks and labels
    if (startLabel && endLabel) {
      const startLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      startLabelElement.setAttribute('x', '5');
      startLabelElement.setAttribute('y', '40');
      startLabelElement.setAttribute('font-size', '10');
      startLabelElement.textContent = startLabel;
      svg.appendChild(startLabelElement);

      const endLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      // endLabelElement.setAttribute('x', (width - 5).toString());
      endLabelElement.setAttribute('x', '100%');
      endLabelElement.setAttribute('y', '40');
      endLabelElement.setAttribute('font-size', '10');
      endLabelElement.setAttribute('text-anchor', 'end');
      endLabelElement.textContent = endLabel;
      svg.appendChild(endLabelElement);
    } else {
      for (let i = 0; i <= divisions; i++) {
        const x = i === 0 ? '2%' : i === divisions ? '98%' : `${(i / divisions) * 100}%`;
        const value = domain.at(0)! + (i / divisions) * (domain.at(-1)! - domain.at(0)!);

        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', x);
        tick.setAttribute('y1', (10 + legendHeight).toString());
        tick.setAttribute('x2', x);
        tick.setAttribute('y2', (15 + legendHeight).toString());
        tick.setAttribute('stroke', 'black');
        svg.appendChild(tick);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', (25 + legendHeight).toString());
        label.setAttribute('font-size', '10');
        label.setAttribute('text-anchor', 'middle');
        label.textContent = formatLabel(value);
        svg.appendChild(label);
      }
    }

    // Add title
    const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    // titleElement.setAttribute('x', (width / 2).toString());
    titleElement.setAttribute('x', '50%');
    titleElement.setAttribute('y', '9');
    titleElement.setAttribute('font-size', '12');
    titleElement.setAttribute('font-weight', 'bold');
    titleElement.setAttribute('text-anchor', 'middle');
    titleElement.textContent = title ?? null;
    svg.appendChild(titleElement);
  }, [height, range, title, domain, divisions, formatLabel, colorScale, svgRef, startLabel, endLabel]);

  return <svg key={title} ref={svgRef} width={'100%'} height={height} />;
}
