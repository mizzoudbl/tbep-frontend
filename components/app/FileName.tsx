'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/hooks';
import { Input } from '../ui/input';

export const FileName = () => {
  const searchParams = useSearchParams();
  const projectTitle = useStore(state => state.projectTitle);

  useEffect(() => {
    const fileName = searchParams?.get('file') ?? 'Untitled';
    useStore.setState({ projectTitle: fileName });
  }, [searchParams]);

  return (
    <Input
      className='text-sm font-semibold max-w-fit h-8'
      value={projectTitle}
      onChange={e => useStore.setState({ projectTitle: e.target.value })}
    />
  );
};

export const MouseControlMessage = () => {
  const [visible, setVisible] = React.useState(true);

  return (
    <>
      {visible && (
        // biome-ignore lint/a11y/noStaticElementInteractions: hydration error (button inside button)
        <span
          className='absolute bottom-0.5 flex size-2.5'
          onClick={() => setVisible(false)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setVisible(false)}
        >
          <span className='absolute inline-flex h-[150%] w-[150%] z-50 animate-ping rounded-full -left-1 -bottom-3 bg-sky-400 opacity-75' />
          <span className='absolute inline-flex size-2.5 rounded-full -bottom-2 bg-sky-500' />
        </span>
      )}
    </>
  );
};
