import { type NodeColorType, nodeColor } from '@/lib/data';
import { useStore } from '@/lib/store';
import { ChevronsUpDown, Info } from 'lucide-react';
import React from 'react';
import { Combobox } from '../ComboBox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function NodeColor({ onPropChange }: { onPropChange: (prop: string) => void }) {
  const radioValue = useStore(state => state.selectedRadioNodeColor);
  const radioOptions = useStore(state => state.radioOptions);
  const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);

  return (
    <Collapsible defaultOpen className='my-2 border p-2 rounded shadow'>
      <CollapsibleTrigger asChild>
        <div className='flex items-center justify-between w-full'>
          <Label className='font-bold cursor-pointer hover:underline'>Node Color</Label>
          <ChevronsUpDown size={20} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='mt-2'>
        <RadioGroup
          value={radioValue}
          onValueChange={value => useStore.setState({ selectedRadioNodeColor: value as NodeColorType })}
        >
          {nodeColor.map(({ label, tooltipContent }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value={label} id={label} />
                  <Label htmlFor={label} className='text-xs'>
                    {label}
                  </Label>
                  {tooltipContent && <Info size={12} />}
                </div>
              </TooltipTrigger>
              {tooltipContent && (
                <TooltipContent>
                  <p>{tooltipContent}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </RadioGroup>
        {radioValue !== 'None' && (
          <div className='mt-2'>
            {/* Data fetching and input remaining */}
            <Combobox
              key={radioValue}
              data={radioOptions.database[radioValue].concat(radioOptions.user[radioValue])}
              className='w-full'
              value={selectedNodeColorProperty}
              onChange={onPropChange}
            />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
