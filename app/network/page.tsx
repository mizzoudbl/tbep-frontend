'use client';

import React from 'react';
import '@react-sigma/core/lib/react-sigma.min.css';
import { Spinner } from '@/components/ui/spinner';
import dynamic from 'next/dynamic';

const SigmaContainer = dynamic(() => import('@/components/graph').then(module => module.SigmaContainer), {
  loading: () => (
    <div className='w-full h-full grid place-items-center'>
      <div className='flex flex-col items-center'>
        <Spinner size={'medium'} />
        Loading...
      </div>
    </div>
  ),
  ssr: false,
});

export default function NetworkPage() {
  return (
    <SigmaContainer
      settings={{
        enableEdgeEvents: true,
        defaultEdgeColor: 'gray',
        zIndex: true,
        defaultNodeType: 'circle',
        labelRenderedSizeThreshold: 0.75,
        labelDensity: 0.2,
      }}
    />
  );
}
