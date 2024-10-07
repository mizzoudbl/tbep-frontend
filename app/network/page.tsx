'use client';

import React from 'react';
import '@react-sigma/core/lib/react-sigma.min.css';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EdgeArrowProgram, NodePointProgram } from 'sigma/rendering';
import { NodeAttributes, EdgeAttributes } from '@/lib/interface';
import { Attributes } from 'graphology-types';

const SigmaContainer = dynamic(() => import('@/components/graph').then(module => module.SigmaContainer), {
  loading: () => (
    <div className='w-full h-full grid place-items-center'>
      <div className='flex flex-col items-center'>
        <LoadingSpinner size={24} />
        Loading...
      </div>
    </div>
  ),
  ssr: false,
});

export default function NetworkPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <SigmaContainer
      className='w-full h-full'
      settings={{
        renderEdgeLabels: true,
        autoCenter: true,
        autoRescale: true,
        defaultNodeType: 'circle',
        zoomToSizeRatioFunction(ratio) {
          return ratio;
        },
        defaultNodeColor: '#999',
        defaultEdgeColor: '#ccc',
        nodeReducer(node, data) {
          return {
            size: 5,
            color: '#999',
            ...data,
          };
        },
        edgeReducer(edge, data) {
          return {
            color: '#ccc',
            size: (data.score ?? 0) * 0.75,
          };
        },
      }}
    />
  );
}
