'use client';

import { nodeSize } from '@/lib/data';
import { useStore } from '@/lib/store';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import React from 'react';
import { Combobox } from './ComboBox';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent } from './ui/collapsible';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function NodeSize() {
  const [open, setOpen] = React.useState(true);

  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);

  const handleSelectedRadioButton = (value: string) => {
    useStore.setState({ selectedRadioNodeSize: value });
  };

  return (
    <Collapsible className='border p-2 rounded shadow' open={open}>
      <Button variant={'link'} onClick={() => setOpen(!open)} className='flex items-center justify-between w-full'>
        <Label className='text-black font-semibold'>Node Size</Label>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Button>
      <CollapsibleContent className='mt-2'>
        <RadioGroup value={selectedRadioNodeSize} onValueChange={handleSelectedRadioButton}>
          {nodeSize.map(({ label, tooltipContent }) => (
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
        {selectedRadioNodeSize !== 'None' && (
          <div className='mt-2'>
            {/* Data fetching and input remaining */}
            <Combobox data={[]} className='w-full' />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
