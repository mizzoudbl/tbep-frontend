'use client';

import NodeGradientProgram from '@/lib/NodeGradientProgram';
import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { SigmaContainer as _SigmaContainer, type SigmaContainerProps as _SigmaContainerProps } from '@react-sigma/core';
import { ControlsContainer, FullScreenControl, ZoomControl } from '@react-sigma/core';
import { createNodeBorderProgram } from '@sigma/node-border';
import type { Attributes } from 'graphology-types';
import { Focus, Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import { Suspense } from 'react';
import type { Sigma } from 'sigma';
import { EdgeLineProgram, NodeCircleProgram } from 'sigma/rendering';
import { drawDiscNodeHover, drawDiscNodeLabel } from 'sigma/rendering';
import { ColorAnalysis, ForceLayout, GraphAnalysis, GraphEvents, LoadGraph, NodeSearch, SizeAnalysis } from '.';
import { drawHover } from './canvas-hover';

export type SigmaContainerProps = _SigmaContainerProps<NodeAttributes, EdgeAttributes, Attributes> &
  React.RefAttributes<Sigma<NodeAttributes, EdgeAttributes, Attributes> | null>;

export function SigmaContainer(props: SigmaContainerProps) {
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  // const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);
  // const selectedNodeSizeProperty = useStore(state => state.selectedNodeSizeProperty);

  return (
    <_SigmaContainer
      ref={props.ref}
      className={props.className}
      settings={{
        ...props.settings,
        nodeProgramClasses: {
          circle: NodeGradientProgram,
          border: createNodeBorderProgram({
            borders: [
              { size: { attribute: 'borderSize', defaultValue: 0.5 }, color: { attribute: 'borderColor' } },
              { size: { fill: true }, color: { attribute: 'color' } },
            ],
          }),
        },
        edgeProgramClasses: {
          line: EdgeLineProgram,
        },
        defaultNodeColor,
        labelSize: 10,
        defaultDrawNodeHover: drawDiscNodeHover,
      }}
    >
      <Suspense>
        <LoadGraph />
      </Suspense>
      <GraphEvents />
      <ForceLayout />
      <NodeSearch />
      <ColorAnalysis />
      <SizeAnalysis />
      <GraphAnalysis />
      <ControlsContainer position='bottom-right'>
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
}
