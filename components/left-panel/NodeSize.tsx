import { type NodeSizeType, PROPERTY_LABEL_TYPE_MAPPING, nodeSize } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import { ChevronsUpDown, Info, RefreshCcw } from 'lucide-react';
import React from 'react';
import { VirtualizedCombobox } from '../VirtualizedCombobox';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Combobox } from '../ui/combobox';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function NodeSize({ onPropChange }: { onPropChange: (prop: string | Set<string>) => void }) {
  const radioValue = useStore(state => state.selectedRadioNodeSize);
  const radioOptions = useStore(state => state.radioOptions);
  const selectedNodeSizeProperty = useStore(state => state.selectedNodeSizeProperty);

  return (
    <Collapsible defaultOpen className='border p-2 rounded shadow'>
      <div className='flex items-center justify-between w-full'>
        <Label className='font-bold cursor-pointer hover:underline'>Node Size</Label>
        <div className='space-x-1 flex items-center'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => useStore.setState({ selectedRadioNodeSize: undefined })}
                type='button'
                variant='outline'
                size='icon'
                className='w-6 h-6'
              >
                <RefreshCcw size={15} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset</p>
            </TooltipContent>
          </Tooltip>
          <CollapsibleTrigger asChild>
            <Button type='button' variant='outline' size='icon' className='w-6 h-6'>
              <ChevronsUpDown size={15} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className='mt-2'>
        <RadioGroup
          value={radioValue ?? ''}
          onValueChange={value =>
            useStore.setState({ selectedRadioNodeSize: value as NodeSizeType, selectedNodeSizeProperty: '' })
          }
        >
          {nodeSize.map(({ label, tooltipContent }) => {
            return (
              <Tooltip key={label}>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value={PROPERTY_LABEL_TYPE_MAPPING[label]} id={label} />
                  <Label htmlFor={label} className='text-xs'>
                    {label}
                  </Label>
                  <TooltipTrigger asChild>{tooltipContent && <Info size={12} className='shrink-0' />}</TooltipTrigger>
                </div>
                {tooltipContent && (
                  <TooltipContent align='start'>
                    <p className='max-w-80'>{tooltipContent}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </RadioGroup>
        {radioValue &&
          (radioValue === 'TE' ? (
            <VirtualizedCombobox
              key={radioValue}
              data={[...radioOptions.database[radioValue], ...radioOptions.user[radioValue]]}
              className='w-full mt-2'
              value={selectedNodeSizeProperty}
              onChange={onPropChange}
              width='550px'
              multiselect
            />
          ) : (
            <Combobox
              key={radioValue}
              data={[...radioOptions.database[radioValue], ...radioOptions.user[radioValue]]}
              className='w-full mt-2'
              value={selectedNodeSizeProperty}
              onChange={onPropChange}
            />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
