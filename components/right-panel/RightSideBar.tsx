'use client';

import type { ForceSettings, GraphStore, RadialAnalysisSetting } from '@/lib/interface';
import { useStore } from '@/lib/store';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Legend, NetworkInfo, NetworkStyle, RadialAnalysis } from '.';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function RightSideBar() {
  const { start, stop } = useStore(state => state.forceWorker);
  const forceSettings = useStore(state => state.forceSettings);
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultEdgeColor = useStore(state => state.defaultEdgeColor);
  const defaultLabelRenderedSizeThreshold = useStore(state => state.defaultLabelRenderedSizeThreshold);
  const showEdgeLabel = useStore(state => state.showEdgeLabel);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const radialAnalysis = useStore(state => state.radialAnalysis);
  const minScore: number = useStore.getInitialState().radialAnalysis.edgeWeightCutOff;
  // const minScore: number = JSON.parse(localStorage.getItem('graphConfig') || '{}').minScore || 0;

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

  const updateRadialAnalysis = (value: number, key: keyof RadialAnalysisSetting) => {
    useStore.setState({ radialAnalysis: { ...radialAnalysis, [key]: value } });
  };

  const handleCheckBox = (checked: CheckedState, key: keyof GraphStore) => {
    if (checked === 'indeterminate') return;
    useStore.setState({ [key]: checked });
  };

  return (
    <ScrollArea className='border-l p-2 text-xs flex flex-col h-[98vh]'>
      <div className='mb-2 border p-2 rounded shadow'>
        <p className='font-bold mb-2'>Network Layout</p>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='network-animation-control' className='text-xs font-semibold'>
              Animation
            </Label>
            <Switch id='network-animation-control' onCheckedChange={handleGraphAnimation} />
          </div>
          <div className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='gravity' className='text-xs font-semibold'>
                    Gravity (0.1-10)
                  </Label>
                </TooltipTrigger>
                <Slider
                  id='gravity'
                  className='w-full'
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[forceSettings.gravity]}
                  onValueChange={value => updateForceSetting(value, 'gravity')}
                />
              </div>
              <TooltipContent>
                <p>Increases or decreases the pull towards the center of the graph</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-16 h-8'
              min={1}
              max={50}
              step={1}
              value={forceSettings.gravity}
              onChange={e => updateForceSetting(e.target.value, 'gravity')}
            />
          </div>
          <div className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='repulsion' className='text-xs font-semibold'>
                    Repulsion (0-10)
                  </Label>
                </TooltipTrigger>
                <Slider
                  id='repulsion'
                  className='w-full'
                  min={0}
                  max={50}
                  step={1}
                  value={[forceSettings.repulsion]}
                  onValueChange={value => updateForceSetting(value, 'repulsion')}
                />
              </div>
              <TooltipContent>
                <p>Increases or decreases the strength of repulsion between nodes</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-16 h-8'
              min={1}
              max={50}
              step={1}
              value={forceSettings.repulsion}
              onChange={e => updateForceSetting(e.target.value, 'repulsion')}
            />
          </div>
          <div className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='attraction' className='text-xs font-semibold'>
                    Attraction (0-10)
                  </Label>
                </TooltipTrigger>
                <Slider
                  id='attraction'
                  className='w-full'
                  min={0}
                  max={10}
                  step={0.1}
                  value={[forceSettings.attraction]}
                  onValueChange={value => updateForceSetting(value, 'attraction')}
                />
              </div>
              <TooltipContent>
                <p>Attraction of Edges on the layout</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-16 h-8'
              min={1}
              max={50}
              step={1}
              value={forceSettings.attraction}
              onChange={e => updateForceSetting(e.target.value, 'attraction')}
            />
          </div>
        </div>
      </div>
      <NetworkStyle
        defaultNodeSize={defaultNodeSize}
        defaultNodeColor={defaultNodeColor}
        defaultEdgeColor={defaultEdgeColor}
        defaultLabelRenderedSizeThreshold={defaultLabelRenderedSizeThreshold}
        showEdgeLabel={showEdgeLabel}
        showEdgeColor={showEdgeColor}
        handleDefaultChange={handleDefaultChange}
        handleCheckBox={handleCheckBox}
      />
      <RadialAnalysis value={radialAnalysis} onChange={updateRadialAnalysis} minScore={minScore} />
      <NetworkInfo />
      <Legend />
    </ScrollArea>
  );
}
