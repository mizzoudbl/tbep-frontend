'use client';

import { useStore } from '@/lib/hooks';
import type { GraphStore, RadialAnalysisSetting } from '@/lib/interface';
import { Legend, NetworkAnalysis, NetworkInfo, NetworkLayout, NetworkStyle, RadialAnalysis } from '.';
import { ScrollArea } from '../ui/scroll-area';

export function RightSideBar() {
  const radialAnalysis = useStore(state => state.radialAnalysis);

  const updateRadialAnalysis = (value: number | string, key: keyof RadialAnalysisSetting) => {
    useStore.setState({ radialAnalysis: { ...radialAnalysis, [key]: value } });
  };

  return (
    <ScrollArea className='border-l p-2 text-xs flex flex-col h-[98vh]'>
      <NetworkAnalysis>
        <RadialAnalysis value={radialAnalysis} onChange={updateRadialAnalysis} />
      </NetworkAnalysis>
      <NetworkInfo />
      <Legend />
      <NetworkLayout />
      <NetworkStyle />
    </ScrollArea>
  );
}
