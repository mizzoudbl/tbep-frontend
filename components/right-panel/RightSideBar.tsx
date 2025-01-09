'use client';

import { useStore } from '@/lib/hooks';
import type { GraphStore, RadialAnalysisSetting } from '@/lib/interface';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Legend, NetworkAnalysis, NetworkInfo, NetworkLayout, NetworkStyle, RadialAnalysis } from '.';
import { ScrollArea } from '../ui/scroll-area';

export function RightSideBar() {
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultLabelDensity = useStore(state => state.defaultLabelDensity);
  const defaultLabelSize = useStore(state => state.defaultLabelSize);
  const showEdgeLabel = useStore(state => state.showEdgeLabel);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const radialAnalysis = useStore(state => state.radialAnalysis);

  const handleDefaultChange = (value: number | string, key: keyof GraphStore) => {
    useStore.setState({ [key]: value });
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
      <NetworkAnalysis>
        <RadialAnalysis value={radialAnalysis} onChange={updateRadialAnalysis} />
      </NetworkAnalysis>
      <NetworkInfo />
      <Legend />
      <NetworkLayout />
      <NetworkStyle
        defaultNodeSize={defaultNodeSize}
        defaultNodeColor={defaultNodeColor}
        defaultLabelDensity={defaultLabelDensity}
        defaultLabelSize={defaultLabelSize}
        showEdgeLabel={showEdgeLabel}
        showEdgeColor={showEdgeColor}
        handleDefaultChange={handleDefaultChange}
        handleCheckBox={handleCheckBox}
      />
    </ScrollArea>
  );
}
