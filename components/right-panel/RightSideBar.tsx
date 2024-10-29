'use client';

import type { ForceSettings, GraphStore, RadialAnalysisSetting } from '@/lib/interface';
import { useStore } from '@/lib/store';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Legend, NetworkInfo, NetworkLayout, NetworkStyle, RadialAnalysis } from '.';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';

export function RightSideBar() {
  const { start, stop } = useStore(state => state.forceWorker);
  const forceSettings = useStore(state => state.forceSettings);
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultEdgeColor = useStore(state => state.defaultEdgeColor);
  const defaultlabelDensity = useStore(state => state.defaultlabelDensity);
  const showEdgeLabel = useStore(state => state.showEdgeLabel);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const radialAnalysis = useStore(state => state.radialAnalysis);

  const handleDefaultChange = (value: number | string, key: keyof GraphStore) => {
    useStore.setState({ [key]: value });
  };

  const handleGraphAnimation = (checked: boolean) => {
    checked ? start() : stop();
  };

  const updateForceSetting = (value: number[] | string, key: keyof ForceSettings) => {
    useStore.setState({
      forceSettings: { ...forceSettings, [key]: typeof value === 'string' ? Number.parseFloat(value) : value[0] },
    });
  };

  const updateRadialAnalysis = (value: number | string, key: keyof RadialAnalysisSetting) => {
    useStore.setState({ radialAnalysis: { ...radialAnalysis, [key]: value } });
  };

  const handleCheckBox = (checked: CheckedState, key: keyof GraphStore) => {
    if (checked === 'indeterminate') return;
    useStore.setState({ [key]: checked });
  };

  return (
    <ScrollArea className='border-l p-2 text-xs flex flex-col h-[98vh]'>
      <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow'>
        <CollapsibleTrigger asChild>
          <div className='flex items-center justify-between w-full'>
            <p className='font-bold cursor-pointer hover:underline'>Network Layout</p>
            <ChevronsUpDown size={20} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='network-animation-control' className='text-xs font-semibold'>
              Animation
            </Label>
            <Switch id='network-animation-control' onCheckedChange={handleGraphAnimation} />
          </div>
          <NetworkLayout forceSettings={forceSettings} updateForceSetting={updateForceSetting} />
        </CollapsibleContent>
      </Collapsible>
      <NetworkStyle
        defaultNodeSize={defaultNodeSize}
        defaultNodeColor={defaultNodeColor}
        defaultEdgeColor={defaultEdgeColor}
        defaultlabelDensity={defaultlabelDensity}
        showEdgeLabel={showEdgeLabel}
        showEdgeColor={showEdgeColor}
        handleDefaultChange={handleDefaultChange}
        handleCheckBox={handleCheckBox}
      />
      <RadialAnalysis value={radialAnalysis} onChange={updateRadialAnalysis} />
      <NetworkInfo />
      <Legend />
    </ScrollArea>
  );
}
