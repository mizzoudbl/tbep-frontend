'use client';

import React from 'react';
import '@react-sigma/core/lib/react-sigma.min.css';
import ChatWindow from '@/components/ChatWindow';
import { drawHover } from '@/components/graph/canvas-hover';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useStore } from '@/lib/store';
import dynamic from 'next/dynamic';

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
    <>
      <SigmaContainer
        className='w-full h-screen'
        settings={{
          enableEdgeEvents: true,
          defaultEdgeColor: 'gray',
          zIndex: true,
          labelRenderedSizeThreshold: 0.75,
          labelDensity: 0.2,
          renderEdgeLabels: true,
          defaultDrawNodeHover: drawHover,
        }}
      />
      <ChatWindow />
    </>
  );
}
