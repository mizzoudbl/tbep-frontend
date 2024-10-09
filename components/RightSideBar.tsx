'use client';

import type { GraphStore } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { ColorPicker } from './ui/color-picker';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function RightSideBar() {
  const { start, stop } = useStore(state => state.fa2Worker);
  const fa2Settings = useStore(state => state.fa2Settings);
  const setFa2Settings = useStore(state => state.setFa2Settings);
  const totalNodes = useStore(state => state.graph.nodes?.length ?? 0);
  const totalEdges = useStore(state => state.graph.edges?.length ?? 0);
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultEdgeColor = useStore(state => state.defaultEdgeColor);
  const defaultLabelRenderedSizeThreshold = useStore(state => state.defaultLabelRenderedSizeThreshold);

  const handleDefaultChange = (value: number | string, key: keyof GraphStore) => {
    if (typeof key !== 'string') return;
    useStore.setState({ [key]: value });
  };

  const handleGraphAnimation = (checked: boolean) => {
    if (checked) {
      start();
    } else {
      stop();
    }
  };

  const handleSliderChange = (value: number[], key: string) => {
    setFa2Settings({ ...fa2Settings, [key]: value[0] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setFa2Settings({ ...fa2Settings, [key]: Number.parseFloat(e.target.value) });
  };

  return (
    <ScrollArea className='border-l p-2'>
      <div className='mb-4 border p-2 rounded-md'>
        <p className='text-xs font-bold mb-2'>Network Layout</p>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='network-animation-control' className='text-xs'>
              Animation
            </Label>
            <Switch id='network-animation-control' defaultChecked onCheckedChange={handleGraphAnimation} />
          </div>
          <div className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='gravity' className='text-xs'>
                    Gravity (0.1-10)
                  </Label>
                </TooltipTrigger>
                <Slider
                  id='gravity'
                  className='w-full'
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[fa2Settings.gravity]}
                  onValueChange={value => handleSliderChange(value, 'gravity')}
                />
              </div>
              <TooltipContent>
                <p>Increases or decreases the pull towards the center of the graph</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-16 h-8 text-xs'
              min={0.1}
              max={10}
              step={0.1}
              value={fa2Settings.gravity}
              onChange={e => handleInputChange(e, 'gravity')}
            />
          </div>
          <div className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='scalingRatio' className='text-xs'>
                    Scaling Ratio (0-10)
                  </Label>
                </TooltipTrigger>
                <Slider
                  id='scalingRatio'
                  className='w-full'
                  min={0}
                  max={50}
                  step={1}
                  value={[fa2Settings.scalingRatio]}
                  onValueChange={value => handleSliderChange(value, 'scalingRatio')}
                />
              </div>
              <TooltipContent>
                <p>Increases or decreases the strength of repulsion between nodes</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-16 h-8 text-xs'
              min={1}
              max={50}
              step={1}
              value={fa2Settings.scalingRatio}
              onChange={e => handleInputChange(e, 'scalingRatio')}
            />
          </div>
          <div className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='edgeWeightInfluence' className='text-xs'>
                    Edge Weight Influence (0-2)
                  </Label>
                </TooltipTrigger>
                <Slider
                  id='edgeWeightInfluence'
                  className='w-full'
                  min={0}
                  max={2}
                  step={0.1}
                  value={[fa2Settings.edgeWeightInfluence]}
                  onValueChange={value => handleSliderChange(value, 'edgeWeightInfluence')}
                />
              </div>
              <TooltipContent>
                <p>Influence of the edge’s weights on the layout</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-16 h-8 text-xs'
              min={0}
              max={2}
              step={0.1}
              value={fa2Settings.edgeWeightInfluence}
              onChange={e => handleInputChange(e, 'edgeWeightInfluence')}
            />
          </div>
        </div>
      </div>
      <div className='mb-4 border p-2 rounded-md'>
        <p className='text-xs font-bold mb-2'>Network Style</p>
        <div className='flex flex-col gap-2 text-xs'>
          <div className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='defaultNodeSize' className='text-xs'>
                    Node Size
                  </Label>
                </TooltipTrigger>
                <Slider
                  id='defaultNodeSize'
                  className='w-full'
                  min={1}
                  max={50}
                  step={1}
                  value={[defaultNodeSize]}
                  onValueChange={value => handleDefaultChange(value?.[0], 'defaultNodeSize')}
                />
              </div>
              <TooltipContent>
                <p>Change the size of the nodes in the network</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-16 h-8 text-xs'
              min={1}
              max={50}
              step={1}
              value={defaultNodeSize}
              onChange={e => handleDefaultChange(Number.parseInt(e.target.value), 'defaultNodeSize')}
            />
          </div>
          <div className='flex space-x-2 items-center'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='defaultLabelRenderedSizeThreshold' className='text-xs'>
                    Node Label Threshold
                  </Label>
                </TooltipTrigger>
                <Slider
                  id='defaultLabelRenderedSizeThreshold'
                  className='w-full'
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[defaultLabelRenderedSizeThreshold]}
                  onValueChange={value => handleDefaultChange(value?.[0], 'defaultLabelRenderedSizeThreshold')}
                />
              </div>
              <TooltipContent>
                <p>Change till how far node label should be visible</p>
              </TooltipContent>
            </Tooltip>
            <Input
              type='number'
              className='w-14 h-8 text-xs'
              min={0.1}
              max={10}
              step={0.1}
              value={defaultLabelRenderedSizeThreshold}
              onChange={e =>
                handleDefaultChange(Number.parseFloat(e.target.value), 'defaultLabelRenderedSizeThreshold')
              }
            />
          </div>
          <div className='flex'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='defaultNodeColor' className='text-xs'>
                    Node Color
                  </Label>
                </TooltipTrigger>
                <ColorPicker color={defaultNodeColor} className='w-full' />
              </div>
              <TooltipContent>
                <p>Change the color of the nodes in the network</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className='flex'>
            <Tooltip>
              <div className='flex flex-col space-y-2 w-full'>
                <TooltipTrigger asChild>
                  <Label htmlFor='defaultEdgeColor' className='text-xs'>
                    Edge Color
                  </Label>
                </TooltipTrigger>
                <ColorPicker color={defaultEdgeColor} className='w-full' />
              </div>
              <TooltipContent>
                <p>Change the color of the nodes in the network</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className='mb-4 border p-2 rounded-md'>
        <p className='text-xs font-bold mb-2'>Network Info</p>
        <div className='flex flex-col gap-1 text-xs'>
          <span>Total Nodes: {totalNodes}</span>
          <span>Total Edges: {totalEdges}</span>
        </div>
      </div>
      <div className='mb-4 border p-2 rounded-md'>
        <p className='text-xs font-bold mb-2'>Legends</p>
      </div>
    </ScrollArea>
  );
}
