'use client';

import { nodeColor } from '@/lib/data';
import { useStore } from '@/lib/store';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import React from 'react';
import { Combobox } from '../ComboBox';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function NodeColor() {
  const [open, setOpen] = React.useState(true);
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);

  const handleSelectedRadioButton = (value: string) => {
    useStore.setState({ selectedRadioNodeColor: value });
  };

  return (
    <Collapsible className='my-2 border p-2 rounded shadow' open={open}>
      <Button variant={'link'} onClick={() => setOpen(!open)} className='flex items-center justify-between w-full'>
        <Label className='text-black font-semibold cursor-pointer'>Node Color</Label>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Button>
      <CollapsibleContent className='mt-2'>
        <RadioGroup value={selectedRadioNodeColor} onValueChange={handleSelectedRadioButton}>
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
        {selectedRadioNodeColor !== 'None' && (
          <div className='mt-2'>
            {/* Data fetching and input remaining */}
            <Combobox data={[]} className='w-full' />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
