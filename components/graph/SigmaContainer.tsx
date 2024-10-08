'use client';

import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import {
  SigmaContainer as _SigmaContainer,
  SearchControl,
  type SigmaContainerProps as _SigmaContainerProps,
} from '@react-sigma/core';
import type { Attributes } from 'graphology-types';
import type { Sigma } from 'sigma';
import { GraphEvents, LoadGraph } from './index';
import { ControlsContainer, FullScreenControl, ZoomControl } from '@react-sigma/core';
import { Fa2 } from './Fa2';
import { Focus, Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';

export type SigmaContainerProps = _SigmaContainerProps<NodeAttributes, EdgeAttributes, Attributes> &
  React.RefAttributes<Sigma<NodeAttributes, EdgeAttributes, Attributes> | null>;

export function SigmaContainer(props: SigmaContainerProps) {
  return (
    <_SigmaContainer ref={props.ref} {...props}>
      <LoadGraph />
      <GraphEvents />
      <Fa2 />
      <ControlsContainer position='bottom-right'>
        <ZoomControl labels={{ zoomIn: "PLUS", zoomOut: "MINUS", reset: "RESET" }}>
          <ZoomIn />
          <ZoomOut />
          <Focus />
        </ZoomControl>
        <FullScreenControl labels={{ enter: "ENTER", exit: "EXIT" }}>
          <Maximize/>
          <Minimize/>
        </FullScreenControl>
      </ControlsContainer>
    </_SigmaContainer>
  );
}
