import type { GraphStore } from '@/lib/interface';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ColorPicker } from '../ui/color-picker';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function NetworkStyle({
  defaultNodeSize,
  defaultLabelRenderedSizeThreshold,
  showEdgeLabel,
  defaultNodeColor,
  defaultEdgeColor,
  handleDefaultChange,
  handleCheckBox,
}: {
  defaultNodeSize: number;
  defaultLabelRenderedSizeThreshold: number;
  showEdgeLabel: boolean;
  defaultNodeColor: string;
  defaultEdgeColor: string;
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
          <Tooltip>
            <div className='flex flex-col space-y-2 w-full mt-2'>
              <TooltipTrigger asChild>
                <Label htmlFor='defaultNodeSize' className='text-xs font-semibold'>
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
            className='w-16 h-8'
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
                <Label htmlFor='defaultLabelRenderedSizeThreshold' className='text-xs font-semibold'>
                  Label Threshold
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
              <p>Change till how far label should be visible</p>
            </TooltipContent>
          </Tooltip>
          <Input
            type='number'
            className='w-16 h-8'
            min={1}
            max={50}
            step={1}
            value={defaultLabelRenderedSizeThreshold}
            onChange={e => handleDefaultChange(Number.parseFloat(e.target.value), 'defaultLabelRenderedSizeThreshold')}
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
            <Label htmlFor='showEdgeLabel' className='text-xs font-semibold'>
              Show Edge Label
            </Label>
          </div>
        </div>
        <hr />
        <div className='flex flex-col xl:flex-row gap-2'>
          <Tooltip>
            <div className='flex flex-col space-y-1 w-full'>
              <TooltipTrigger asChild>
                <Label htmlFor='defaultNodeColor' className='text-xs font-semibold'>
                  Node Color
                </Label>
              </TooltipTrigger>
              <ColorPicker color={defaultNodeColor} property='defaultNodeColor' className='w-full' />
            </div>
            <TooltipContent>
              <p>Change the color of the nodes in the network</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <div className='flex flex-col space-y-1 w-full'>
              <TooltipTrigger asChild>
                <Label htmlFor='defaultEdgeColor' className='text-xs font-semibold'>
                  Edge Color
                </Label>
              </TooltipTrigger>
              <ColorPicker color={defaultEdgeColor} property='defaultEdgeColor' className='w-full' />
            </div>
            <TooltipContent>
              <p>Change the color of the nodes in the network</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
