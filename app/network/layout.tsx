'use client';

import { ChevronLeft, ChevronRight, FileTextIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { FileName } from '@/components/app';
import { LeftSideBar } from '@/components/left-panel';
import { RightSideBar } from '@/components/right-panel';
import { OpenTargetsHeatmap, StatisticsTab } from '@/components/statistics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/lib/hooks';
import { cn } from '@/lib/utils';

export default function NetworkLayoutPage({ children }: { children: React.ReactNode }) {
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);
  const [leftSidebar, setLeftSidebar] = React.useState<boolean>(true);
  const [rightSidebar, setRightSidebar] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (activeTab === 'Network') {
      window.dispatchEvent(new Event('resize'));
    }
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='h-screen flex flex-col bg-gray-100'>
      <div className='flex justify-between bg-muted h-8 px-4'>
        <Button variant='hover' size='icon' className='h-full' onClick={() => setLeftSidebar(!leftSidebar)}>
          {leftSidebar ? <ChevronLeft className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
        </Button>
        <Suspense fallback={<Input className='text-sm font-semibold max-w-fit h-8' value={'Untitled'} />}>
          <FileName />
        </Suspense>
        <TabsList className='flex items-center gap-4 h-8 w-1/2'>
          <TabsTrigger className='w-full' value='Network'>
            Network Visualization
          </TabsTrigger>
          <TabsTrigger className='w-full' value='Statistics'>
            Graph Statistics
          </TabsTrigger>
          <TabsTrigger className='w-full' value='Heatmap'>
            OpenTargets Heatmap
          </TabsTrigger>
        </TabsList>
        <div className='flex items-center gap-4'>
          <Link
            href={'/'}
            className='hidden md:inline-flex p-2 items-center h-full transition-colors text-xs border-none rounded-sm hover:bg-opacity-20 hover:text-black hover:underline'
          >
            <HomeIcon className='h-3 w-3 mr-1 inline' /> Home
          </Link>
          <Link
            href={'/docs'}
            target='_blank'
            className='hidden md:inline-flex p-2 items-center h-full transition-colors text-xs border-none rounded-sm hover:bg-opacity-20 hover:text-black hover:underline'
          >
            <FileTextIcon className='h-3 w-3 mr-1 inline' /> Docs
          </Link>
        </div>
        <Button variant='hover' size='icon' className='h-full' onClick={() => setRightSidebar(!rightSidebar)}>
          {rightSidebar ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
        </Button>
      </div>
      <ResizablePanelGroup direction='horizontal' className='flex flex-1'>
        <ResizablePanel defaultSize={16} minSize={16} className={leftSidebar ? 'block' : 'hidden'}>
          <LeftSideBar />
        </ResizablePanel>
        <ResizableHandle withHandle className={leftSidebar ? 'flex' : 'hidden'} />
        <ResizablePanel defaultSize={68} className='h-full bg-white'>
          <TabsContent
            forceMount
            value='Network'
            className={cn('h-full mt-0', activeTab === 'Network' ? 'visible' : 'invisible fixed')}
          >
            {children}
          </TabsContent>
          <TabsContent value='Statistics' className='h-full mt-0'>
            <ScrollArea className='h-full'>
              <StatisticsTab />
            </ScrollArea>
          </TabsContent>
          <TabsContent value='Heatmap' className='h-full mt-0'>
            <ScrollArea className='h-full'>
              <OpenTargetsHeatmap />
            </ScrollArea>
          </TabsContent>
        </ResizablePanel>
        <ResizableHandle withHandle className={rightSidebar ? 'flex' : 'hidden'} />
        <ResizablePanel defaultSize={16} minSize={16} className={rightSidebar ? 'block' : 'hidden'}>
          <RightSideBar />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Tabs>
  );
}
