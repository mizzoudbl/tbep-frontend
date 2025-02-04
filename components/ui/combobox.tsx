'use client';

import { Check, ChevronsUpDown, Info } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { GenePropertyMetadata } from '@/lib/interface';
import { cn, getProperty } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export function Combobox({
  data,
  value,
  onChange,
  className,
  placeholder = 'Select...',
  align = 'start',
  multiselect = false,
}: {
  data: readonly (string | GenePropertyMetadata)[];
  value: string | Set<string>;
  onChange: (value: string | Set<string>) => void;
  className?: string;
  placeholder?: string;
  align?: 'start' | 'end' | 'center';
  multiselect?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-[200px] justify-between text-wrap break-words h-8', className)}
        >
          <span className='truncate'>
            {multiselect && value instanceof Set
              ? value.size
                ? `${value.size} selected`
                : placeholder
              : value || placeholder}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={cn('w-[200px] p-0', className)}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No Result Found.</CommandEmpty>
            <CommandGroup>
              {data?.map(item => {
                const propertyName = getProperty(item);
                return (
                  <CommandItem
                    key={propertyName}
                    value={propertyName}
                    onSelect={currentValue => {
                      if (multiselect) {
                        onChange(value instanceof Set ? new Set([...value, currentValue]) : new Set([currentValue]));
                      } else {
                        onChange(currentValue);
                        setOpen(false);
                      }
                    }}
                    className='flex justify-between w-full'
                  >
                    <div className='flex items-center'>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          (multiselect && value instanceof Set ? value.has(propertyName) : value === propertyName)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {propertyName}
                    </div>
                    {typeof item !== 'string' && item.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className='h-4 w-4 ml-4 cursor-pointer' />
                        </TooltipTrigger>
                        <TooltipContent side='right' align='start' className='max-w-80'>
                          {item.description}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
