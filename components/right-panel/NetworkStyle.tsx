'use client';

import type { CheckedState } from '@radix-ui/react-checkbox';
import { ChevronsUpDownIcon, InfoIcon } from 'lucide-react';
import { useId } from 'react';
import { useStore } from '@/lib/hooks';
import type { GraphStore } from '@/lib/interface';
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

  const defaultNodeSizeId = useId();
  const defaultLabelSizeId = useId();
  const defaultLabelDensityId = useId();
  const showEdgeColorId = useId();
  const edgeOpacityId = useId();
  const highlightNeighborNodesId = useId();

  return (
    <Collapsible defaultOpen className='mb-2 rounded border p-2 text-xs shadow-sm'>
      <div className='flex w-full items-center justify-between'>
        <p className='font-bold'>Network Style</p>
        <CollapsibleTrigger asChild>
          <Button type='button' variant='outline' size='icon' className='size-6'>
            <ChevronsUpDownIcon size={15} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='flex flex-col gap-2'>
        <div className='flex items-center space-x-2'>
          <div className='flex w-full flex-col space-y-1'>
            <Label htmlFor={defaultNodeSizeId} className='font-semibold text-xs'>
              Node Size
            </Label>
            <Slider
              id={defaultNodeSizeId}
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
            className='h-8 w-16'
            min={1}
            max={50}
            step={1}
            value={defaultNodeSize}
            onChange={e => handleDefaultChange(Number.parseInt(e.target.value, 10), 'defaultNodeSize')}
          />
        </div>
        <div className='flex items-center space-x-2'>
          <div className='flex w-full flex-col space-y-1'>
            <Label htmlFor={defaultLabelSizeId} className='font-semibold text-xs'>
              Node Label Size
            </Label>
            <Slider
              id={defaultLabelSizeId}
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
            className='h-8 w-16'
            min={1}
            max={50}
            step={1}
            value={defaultLabelSize}
            onChange={e => handleDefaultChange(Number.parseInt(e.target.value, 10), 'defaultLabelSize')}
          />
        </div>
        <div className='flex items-center space-x-2'>
          <div className='flex w-full flex-col space-y-1'>
            <Label htmlFor={defaultLabelDensityId} className='flex items-center gap-1 font-semibold text-xs'>
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
              id={defaultLabelDensityId}
              className='w-full'
              min={0}
              max={10}
              step={0.1}
              value={[defaultLabelDensity]}
              onValueChange={value => handleDefaultChange(value?.[0], 'defaultLabelDensity')}
            />
          </div>
          <Input
            type='number'
            className='h-8 w-16'
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
              id={showEdgeColorId}
              checked={showEdgeColor}
              onCheckedChange={checked => handleCheckBox(checked, 'showEdgeColor')}
            />
            <Label htmlFor={showEdgeColorId} className='font-semibold text-xs'>
              Show Edge Color
            </Label>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox
              id={highlightNeighborNodesId}
              checked={highlightNeighborNodes}
              onCheckedChange={checked => handleCheckBox(checked, 'highlightNeighborNodes')}
            />
            <Label htmlFor={highlightNeighborNodesId} className='flex items-center gap-1 font-semibold text-xs'>
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
          <Label htmlFor={edgeOpacityId} className='font-semibold text-xs'>
            Edge Opacity
          </Label>
          <div className='flex items-center space-x-2 text-xs'>
            <Slider
              min={0}
              max={1}
              step={0.1}
              id={edgeOpacityId}
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
          <Label htmlFor='defaultNodeColor' className='font-semibold text-xs'>
            Node Color
          </Label>
          <ColorPicker color={defaultNodeColor} property='defaultNodeColor' className='w-full' />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
