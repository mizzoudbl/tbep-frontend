'use client';

import { Spinner } from '@/components/ui/spinner';
import '@react-sigma/core/lib/style.css';
import dynamic from 'next/dynamic';
import { ChatWindow } from '@/components/chat';

const SigmaContainer = dynamic(() => import('@/components/graph').then(module => module.SigmaContainer), {
  loading: () => (
    <div className='w-full h-full grid place-items-center'>
      <div className='flex flex-col items-center'>
        <Spinner />
        Loading...
      </div>
    </div>
  ),
  ssr: false,
});

export default function NetworkPage() {
  return (
    <>
      <div className='h-[90%]'>
        <SigmaContainer />
      </div>
      <ChatWindow />
    </>
  );
}
