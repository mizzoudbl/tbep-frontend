'use client';

import React from 'react';
import '@react-sigma/core/lib/react-sigma.min.css';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ChatWindow from '@/components/ChatWindow';
import { useStore } from '@/lib/store';

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
  const defaultNodeColor = useStore(state => state.defaultNodeColor);

  return (
    <>
      <SigmaContainer
        className='w-full h-screen'
        settings={{
          autoCenter: true,
          autoRescale: true,
          defaultNodeType: 'circle',
          zoomToSizeRatioFunction(ratio) {
            return ratio * 2;
          },
          defaultNodeColor: defaultNodeColor,
          defaultEdgeColor: 'gray',
          zIndex: true,
          labelRenderedSizeThreshold: 7.5,
          labelDensity: 0.2
        }}
      />
      <ChatWindow/>
    </>
  );
}
