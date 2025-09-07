'use client';
import { ScrollArea } from '../ui/scroll-area';
import { Legend, NetworkAnalysis, NetworkInfo, NetworkLayout, NetworkStyle, RadialAnalysis } from '.';

export function RightSideBar() {
  return (
    <ScrollArea className='flex h-[calc(96vh-1.5px)] flex-col border-l p-2 text-xs'>
      <NetworkAnalysis>
        <RadialAnalysis />
      </NetworkAnalysis>
      <NetworkInfo />
      <Legend />
      <NetworkLayout />
      <NetworkStyle />
    </ScrollArea>
  );
}
