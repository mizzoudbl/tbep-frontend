'use client';

import { nodeColor } from '@/lib/data';
import type { NodeColorProps } from '@/lib/interface';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import React from 'react';
import { Combobox } from './ComboBox';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent } from './ui/collapsible';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function NodeColor({ selectedRadioColor, setSelectedRadioColor }: NodeColorProps) {
  const [open, setOpen] = React.useState(true);

  return (
    <Collapsible className='my-2 border p-2 rounded shadow' open={open}>
      <Button variant={'link'} onClick={() => setOpen(!open)} className='flex items-center justify-between w-full'>
        <Label className='text-black font-semibold'>Node Size</Label>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Button>
      <CollapsibleContent className='mt-2'>
        <RadioGroup value={selectedRadioColor} onValueChange={value => setSelectedRadioColor(value)}>
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
        {selectedRadioColor && (
          <div className='mt-2'>
            {/* Data fetching and input remaining */}
            <Combobox data={[]} className='w-40' />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
