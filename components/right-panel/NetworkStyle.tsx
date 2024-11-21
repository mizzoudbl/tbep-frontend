import type { GraphStore } from '@/lib/interface';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { ChevronsUpDown, Info } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ColorPicker } from '../ui/color-picker';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function NetworkStyle({
  defaultNodeSize,
  defaultLabelDensity,
  defaultLabelSize,
  showEdgeLabel,
  showEdgeColor,
  defaultNodeColor,
  handleDefaultChange,
  handleCheckBox,
}: {
  defaultNodeSize: number;
  defaultLabelDensity: number;
  defaultLabelSize: number;
  showEdgeLabel: boolean;
  showEdgeColor: boolean;
  defaultNodeColor: string;
  handleDefaultChange: (value: number | string, key: keyof GraphStore) => void;
  handleCheckBox: (value: CheckedState, key: keyof GraphStore) => void;
}) {
  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <CollapsibleTrigger asChild>
        <div className='flex items-center justify-between w-full'>
          <p className='font-bold cursor-pointer hover:underline'>Network Style</p>
          <ChevronsUpDown size={20} />
        </div>
      </CollapsibleTrigger>
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
          <Tooltip>
            <div className='flex flex-col space-y-1 w-full'>
              <TooltipTrigger asChild>
                <Label htmlFor='defaultLabelDensity' className='text-xs font-semibold'>
                  Label Density
                </Label>
              </TooltipTrigger>
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
            <TooltipContent className='max-w-60' align='end'>
              <p>Change the density of the node/edge labels in the network</p>
            </TooltipContent>
          </Tooltip>
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
              id='showEdgeLabel'
              checked={showEdgeLabel}
              onCheckedChange={checked => handleCheckBox(checked, 'showEdgeLabel')}
            />
            <Label htmlFor='showEdgeLabel' className='text-xs font-semibold flex gap-1'>
              Show Edge Label
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={16} />
                </TooltipTrigger>
                <TooltipContent className='max-w-52' align='end'>
                  For larger graphs, it is recommended to zoom before turn on edge labels to improve performance
                </TooltipContent>
              </Tooltip>
            </Label>
          </div>
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
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Label htmlFor='defaultNodeColor' className='text-xs font-semibold'>
              Node Color
            </Label>
          </TooltipTrigger>
          <ColorPicker color={defaultNodeColor} property='defaultNodeColor' className='w-full' />
          <TooltipContent>
            <p>Change the color of the nodes in the network</p>
          </TooltipContent>
        </Tooltip>
      </CollapsibleContent>
    </Collapsible>
  );
}
