'use client';

import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { SigmaContainer as _SigmaContainer, type SigmaContainerProps as _SigmaContainerProps } from '@react-sigma/core';
import { ControlsContainer, FullScreenControl, ZoomControl } from '@react-sigma/core';
import { createNodeBorderProgram } from '@sigma/node-border';
import type { Attributes } from 'graphology-types';
import { Focus, Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import type { Sigma } from 'sigma';
import { NodeCircleProgram } from 'sigma/rendering';
import { ForceLayout, GraphAnalysis, GraphEvents, LoadGraph, NodeSearch } from '.';

export type SigmaContainerProps = _SigmaContainerProps<NodeAttributes, EdgeAttributes, Attributes> &
  React.RefAttributes<Sigma<NodeAttributes, EdgeAttributes, Attributes> | null> & { fileName?: string };

export function SigmaContainer(props: SigmaContainerProps) {
  return (
    <_SigmaContainer
      ref={props.ref}
      className={props.className}
      settings={{
        ...props.settings,
        nodeProgramClasses: {
          circle: NodeCircleProgram,
          border: createNodeBorderProgram({
            borders: [
              { size: { attribute: 'borderSize', defaultValue: 0.5 }, color: { attribute: 'borderColor' } },
              { size: { fill: true }, color: { attribute: 'color' } },
            ],
          }),
        },
      }}
    >
      <LoadGraph fileName={props.fileName} />
      <GraphEvents />
      <ForceLayout />
      <NodeSearch />
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
