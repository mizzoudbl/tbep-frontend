'use client';

import { Export } from '@/components/Export';
import { LeftSideBar } from '@/components/left-panel';
import { RightSideBar } from '@/components/right-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useStore } from '@/lib/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

const FileName = () => {
  const searchParams = useSearchParams();
  const projectTitle = useStore(state => state.projectTitle);

  useEffect(() => {
    const fileName = searchParams.get('file') ?? 'Untitled';
    useStore.setState({ projectTitle: fileName });
  }, [searchParams]);

  return (
    <Input
      className='text-sm font-semibold max-w-fit'
      value={projectTitle}
      onChange={e => useStore.setState({ projectTitle: e.target.value })}
    />
  );
};

export default function NetworkLayoutPage({ children }: { children: React.ReactNode }) {
  const [leftSidebar, setLeftSidebar] = React.useState<boolean>(true);
  const [rightSidebar, setRightSidebar] = React.useState<boolean>(true);
  const projectTitle = useStore(state => state.projectTitle);

  React.useEffect(() => {
    const event = async (event: globalThis.KeyboardEvent) => {
      if (event.altKey) {
        if (event.key === 'l') setLeftSidebar(!leftSidebar);
        if (event.key === 'r') setRightSidebar(!rightSidebar);
      }
    };
    window.addEventListener('keydown', event);
    return () => {
      window.removeEventListener('keydown', event);
    };
  }, [leftSidebar, rightSidebar]);

  return (
    <>
      <div className='h-screen flex flex-col bg-gray-100'>
        <div className='bg-gray-200 h-8 flex items-center justify-between'>
          <Button variant='ghost' size='icon' onClick={() => setLeftSidebar(!leftSidebar)}>
            {leftSidebar ? <ChevronLeft className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
          </Button>
          <div className='flex gap-2'>
            <Suspense
              fallback={
                <Input
                  className='text-sm font-semibold max-w-fit'
                  value={projectTitle}
                  onChange={e => useStore.setState({ projectTitle: e.target.value })}
                />
              }
            >
              <FileName />
            </Suspense>
            <Export />
          </div>
          <Button variant='ghost' size='icon' onClick={() => setRightSidebar(!rightSidebar)}>
            {rightSidebar ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
          </Button>
        </div>

        <ResizablePanelGroup direction='horizontal' className='flex flex-1'>
          {leftSidebar && (
            <>
              <ResizablePanel defaultSize={16} minSize={16}>
                <LeftSideBar />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          <ResizablePanel defaultSize={68} className='flex-1 bg-white'>
            {children}
          </ResizablePanel>
          {rightSidebar && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={16} minSize={16}>
                <RightSideBar />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </>
  );
}
