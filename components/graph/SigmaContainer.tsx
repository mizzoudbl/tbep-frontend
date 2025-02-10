'use client';

import NodeGradientProgram from '@/lib/NodeGradientProgram';
import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import {
  ControlsContainer,
  FullScreenControl,
  type SigmaContainerProps,
  SigmaContainer as _SigmaContainer,
} from '@react-sigma/core';
import { NodeBorderProgram, createNodeBorderProgram } from '@sigma/node-border';
import type { Attributes } from 'graphology-types';
import { Maximize, Minimize } from 'lucide-react';
import React, { Suspense, useEffect } from 'react';
import type { Sigma } from 'sigma';
import { EdgeLineProgram, drawDiscNodeHover } from 'sigma/rendering';
import {
  ColorAnalysis,
  ForceLayout,
  GraphAnalysis,
  GraphEvents,
  GraphExport,
  GraphSettings,
  LoadGraph,
  SizeAnalysis,
  ZoomControl,
} from '.';

export const SigmaContainer = React.forwardRef<
  Sigma<NodeAttributes, EdgeAttributes, Attributes>,
  SigmaContainerProps<NodeAttributes, EdgeAttributes, Attributes>
>((props, ref) => {
  const clickedNodesRef = React.useRef(new Set<string>());
  const highlightedNodesRef = React.useRef(new Set<string>());

  useEffect(() => {
    const sigmaContainer = document.querySelector('.sigma-container') as HTMLElement;
    sigmaContainer.addEventListener('contextmenu', e => e.preventDefault());
  }, []);

  return (
    <_SigmaContainer
      ref={ref}
      className={props.className}
      settings={{
        ...props.settings,
        nodeProgramClasses: {
          circle: NodeGradientProgram,
          border: createNodeBorderProgram({
            borders: [
              {
                size: { attribute: 'borderSize', defaultValue: 0.4 },
                color: { attribute: 'borderColor' },
              },
              { size: { fill: true }, color: { attribute: 'color' } },
            ],
          }),
          highlight: NodeBorderProgram,
        },
        edgeProgramClasses: {
          line: EdgeLineProgram,
        },
        defaultDrawNodeHover: drawDiscNodeHover,
      }}
    >
      <Suspense>
        <LoadGraph />
      </Suspense>
      <GraphExport highlightedNodesRef={highlightedNodesRef} />
      <GraphEvents highlightedNodesRef={highlightedNodesRef} clickedNodesRef={clickedNodesRef} />
      <ForceLayout />
      <GraphSettings clickedNodesRef={clickedNodesRef} />
      <ColorAnalysis />
      <SizeAnalysis />
      <GraphAnalysis highlightedNodesRef={highlightedNodesRef} />
      <ControlsContainer position='bottom-right' style={{ zIndex: 0 }}>
        <ZoomControl />
        <FullScreenControl labels={{ enter: 'ENTER', exit: 'EXIT' }}>
          <Maximize />
          <Minimize />
        </FullScreenControl>
      </ControlsContainer>
    </_SigmaContainer>
  );
});
