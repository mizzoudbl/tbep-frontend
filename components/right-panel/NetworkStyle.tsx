'use client';

import { useStore } from '@/lib/hooks';
import type { GraphStore } from '@/lib/interface';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { ChevronsUpDownIcon, InfoIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ColorPicker } from '../ui/color-picker';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function NetworkStyle() {
  const defaultNodeSize = useStore(state => state.defaultNodeSize);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);
  const defaultLabelDensity = useStore(state => state.defaultLabelDensity);
  const defaultLabelSize = useStore(state => state.defaultLabelSize);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const edgeOpacity = useStore(state => state.edgeOpacity);
  const highlightNeighborNodes = useStore(state => state.highlightNeighborNodes);

  const handleCheckBox = (checked: CheckedState, key: keyof GraphStore) => {
    if (checked === 'indeterminate') return;
    useStore.setState({ [key]: checked });
  };

  const handleDefaultChange = (value: number | string, key: keyof GraphStore) => {
    useStore.setState({ [key]: value });
  };

  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <div className='flex items-center justify-between w-full'>
        <p className='font-bold'>Network Style</p>
        <CollapsibleTrigger asChild>
          <Button type='button' variant='outline' size='icon' className='w-6 h-6'>
            <ChevronsUpDownIcon size={15} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='flex flex-col gap-2'>
        <div className='flex space-x-2 items-center'>
          <div className='flex flex-col space-y-1 w-full'>
            <Label htmlFor='defaultNodeSize' className='text-xs font-semibold'>
              Node Size
            </Label>
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
          <Input
            type='number'
            className='w-16 h-8'
            min={1}
            max={50}
            step={1}
            value={defaultNodeSize}
            onChange={e => handleDefaultChange(Number.parseInt(e.target.value), 'defaultNodeSize')}
          />
        </div>
        <div className='flex space-x-2 items-center'>
          <div className='flex flex-col space-y-1 w-full'>
            <Label htmlFor='defaultLabelSize' className='text-xs font-semibold'>
              Node Label Size
            </Label>
            <Slider
              id='defaultLabelSize'
              className='w-full'
              min={1}
              max={25}
              step={1}
              value={[defaultLabelSize]}
              onValueChange={value => handleDefaultChange(value?.[0], 'defaultLabelSize')}
            />
          </div>
          <Input
            type='number'
            className='w-16 h-8'
            min={1}
            max={50}
            step={1}
            value={defaultLabelSize}
            onChange={e => handleDefaultChange(Number.parseInt(e.target.value), 'defaultLabelSize')}
          />
        </div>
        <div className='flex space-x-2 items-center'>
          <div className='flex flex-col space-y-1 w-full'>
            <Label htmlFor='defaultLabelDensity' className='text-xs font-semibold flex gap-1 items-center'>
              Label Density
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon size={12} />
                </TooltipTrigger>
                <TooltipContent className='max-w-60' align='end'>
                  Change the density of the node/edge labels in the network
                </TooltipContent>
              </Tooltip>
            </Label>
            <Slider
              id='defaultLabelDensity'
              className='w-full'
              min={0.1}
              max={10}
              step={0.1}
              value={[defaultLabelDensity]}
              onValueChange={value => handleDefaultChange(value?.[0], 'defaultLabelDensity')}
            />
          </div>
          <Input
            type='number'
            className='w-16 h-8'
            min={1}
            max={50}
            step={1}
            value={defaultLabelDensity}
            onChange={e => handleDefaultChange(Number.parseFloat(e.target.value), 'defaultLabelDensity')}
          />
        </div>
        <hr />
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='showEdgeColor'
              checked={showEdgeColor}
              onCheckedChange={checked => handleCheckBox(checked, 'showEdgeColor')}
            />
            <Label htmlFor='showEdgeColor' className='text-xs font-semibold'>
              Show Edge Color
            </Label>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='highlightNeighborNodes'
              checked={highlightNeighborNodes}
              onCheckedChange={checked => handleCheckBox(checked, 'highlightNeighborNodes')}
            />
            <Label htmlFor='highlightNeighborNodes' className='text-xs font-semibold flex gap-1 items-center'>
              Highlight Neighbor Genes
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon size={12} />
                </TooltipTrigger>
                <TooltipContent className='max-w-60' align='end'>
                  Upon checked, Highlights the neighbors of the hovered genes
                </TooltipContent>
              </Tooltip>
            </Label>
          </div>
        </div>
        <div>
          <Label htmlFor='edgeOpacity' className='text-xs font-semibold'>
            Edge Opacity
          </Label>
          <div className='flex items-center text-xs space-x-2'>
            <Slider
              min={0}
              max={1}
              step={0.1}
              id='edgeOpacity'
              value={[edgeOpacity]}
              onValueChange={e => handleDefaultChange(e[0], 'edgeOpacity')}
            />
            <Input
              type='number'
              min={0}
              max={1}
              step={10}
              value={edgeOpacity}
              onChange={e => handleDefaultChange(Number(e.target.value), 'edgeOpacity')}
              className='w-16'
            />
          </div>
        </div>
        <div>
          <Label htmlFor='defaultNodeColor' className='text-xs font-semibold'>
            Node Color
          </Label>
          <ColorPicker color={defaultNodeColor} property='defaultNodeColor' className='w-full' />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
