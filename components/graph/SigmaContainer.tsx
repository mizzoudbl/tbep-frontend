'use client';

import NodeGradientProgram from '@/lib/NodeGradientProgram';
import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { type SigmaContainerProps, SigmaContainer as _SigmaContainer } from '@react-sigma/core';
import { ControlsContainer, FullScreenControl, ZoomControl } from '@react-sigma/core';
import { createNodeBorderProgram } from '@sigma/node-border';
import type { Attributes } from 'graphology-types';
import { Focus, Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import React, { Suspense } from 'react';
import type { Sigma } from 'sigma';
import { EdgeLineProgram } from 'sigma/rendering';
import { drawDiscNodeHover } from 'sigma/rendering';
import { ColorAnalysis, ForceLayout, GraphAnalysis, GraphEvents, GraphSettings, LoadGraph, SizeAnalysis } from '.';

export const SigmaContainer = React.forwardRef<
  Sigma<NodeAttributes, EdgeAttributes, Attributes>,
  SigmaContainerProps<NodeAttributes, EdgeAttributes, Attributes>
>((props, ref) => {
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
                size: { attribute: 'borderSize', defaultValue: 0.5 },
                color: { attribute: 'borderColor' },
              },
              { size: { fill: true }, color: { attribute: 'color' } },
            ],
          }),
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
      <GraphEvents />
      <ForceLayout />
      <GraphSettings />
      <ColorAnalysis />
      <SizeAnalysis />
      <GraphAnalysis />
      <ControlsContainer position='bottom-right' style={{ zIndex: 0 }}>
        <ZoomControl labels={{ zoomIn: 'PLUS', zoomOut: 'MINUS', reset: 'RESET' }}>
          <ZoomIn />
          <ZoomOut />
          <Focus />
        </ZoomControl>
        <FullScreenControl labels={{ enter: 'ENTER', exit: 'EXIT' }}>
          <Maximize />
          <Minimize />
        </FullScreenControl>
      </ControlsContainer>
    </_SigmaContainer>
  );
});
