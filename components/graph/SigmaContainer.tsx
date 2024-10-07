'use client';

import type { EdgeAttributes, NodeAttributes } from '@/lib/interface';
import { SigmaContainer as _SigmaContainer, type SigmaContainerProps as _SigmaContainerProps } from '@react-sigma/core';
import type { Attributes } from 'graphology-types';
import type { Sigma } from 'sigma';
import { GraphEvents, LoadGraph } from './index';
import { ControlsContainer, FullScreenControl, ZoomControl, SearchControl } from '@react-sigma/core';
import { LayoutForceAtlas2Control } from '@react-sigma/layout-forceatlas2';
import { LayoutForceControl } from '@react-sigma/layout-force';

export type SigmaContainerProps = _SigmaContainerProps<NodeAttributes, EdgeAttributes, Attributes> &
  React.RefAttributes<Sigma<NodeAttributes, EdgeAttributes, Attributes> | null>;

export function SigmaContainer(props: SigmaContainerProps) {
  return (
    <_SigmaContainer ref={props.ref} {...props}>
      <LoadGraph />
      <GraphEvents />
      <ControlsContainer position='bottom-right'>
        <ZoomControl />
        <FullScreenControl />
        <LayoutForceAtlas2Control
          autoRunFor={1}
          settings={{
            settings: {
              adjustSizes: true,
              outboundAttractionDistribution: true,
              slowDown: 10,
              linLogMode: true,
            },
          }}
        />
        <LayoutForceControl settings={{ settings: { maxMove: 10 }}} />
      </ControlsContainer>
    </_SigmaContainer>
  );
}
