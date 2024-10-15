'use client';

import { generateColorTransition } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

export function HeatmapLegend({
  width = 200,
  height = 50,
  minValue = 0,
  maxValue = 1,
  title,
  startColor = '#00ff00',
  endColor = '#ff0000',
  divisions = 10,
  formatLabel = value => value.toFixed(1),
}: {
  width?: number;
  height?: number;
  minValue?: number;
  maxValue?: number;
  title?: string;
  formatLabel?: (value: number) => string;
  startColor?: string;
  endColor?: string;
  divisions?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  const colorScale = generateColorTransition(startColor, endColor, divisions);

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

    colorScale.forEach((color, index) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', `${(index / (colorScale.length - 1)) * 100}%`);
      stop.setAttribute('stop-color', color);
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
      const value = minValue + (i / divisions) * (maxValue - minValue);

      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', x.toString());
      tick.setAttribute('y1', (10 + legendHeight).toString());
      tick.setAttribute('x2', x.toString());
      tick.setAttribute('y2', (15 + legendHeight).toString());
      tick.setAttribute('stroke', 'black');
      svg.appendChild(tick);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x.toString());
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
  }, [width, height, minValue, maxValue, title, divisions, formatLabel, colorScale]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
