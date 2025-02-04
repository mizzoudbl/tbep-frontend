'use client';

import { AppBar } from '@/components/app';
import { ChatWindow } from '@/components/chat';
import { LeftSideBar } from '@/components/left-panel';
import { RightSideBar } from '@/components/right-panel';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

export default function NetworkLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [leftSidebar, setLeftSidebar] = React.useState<boolean>(true);
  const [rightSidebar, setRightSidebar] = React.useState<boolean>(true);

  return (
    <div className='h-screen flex flex-col bg-gray-100'>
      <div className='bg-gray-200 h-8 flex items-center justify-between'>
        <Button variant='ghost' size='icon' onClick={() => setLeftSidebar(!leftSidebar)}>
          {leftSidebar ? <ChevronLeft className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
        </Button>
        <AppBar />
        <Button variant='ghost' size='icon' onClick={() => setRightSidebar(!rightSidebar)}>
          {rightSidebar ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
        </Button>
      </div>

      <ResizablePanelGroup direction='horizontal' className='flex flex-1'>
        <ResizablePanel defaultSize={16} minSize={16} className={leftSidebar ? 'block' : 'hidden'}>
          <LeftSideBar />
        </ResizablePanel>
        <ResizableHandle withHandle className={leftSidebar ? 'flex' : 'hidden'} />
        <ResizablePanel defaultSize={68} className='bg-white h-full'>
          <div className='bg-white h-[90%]'>{children}</div>
          <ChatWindow />
        </ResizablePanel>
        <ResizableHandle withHandle className={rightSidebar ? 'flex' : 'hidden'} />
        <ResizablePanel defaultSize={16} minSize={16} className={rightSidebar ? 'block' : 'hidden'}>
          <RightSideBar />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
