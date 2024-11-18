'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function Combobox<T>({
  data,
  value,
  onChange,
  className,
}: {
  data: readonly (string | { value?: string; label?: string })[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const handleFind = React.useCallback(
    (value: T) => {
      const item = data.find(item => (typeof item === 'string' ? item : item.value) === value);
      return item ? (typeof item === 'string' ? item : item.label) : 'Select...';
    },
    [data],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-[200px] justify-between text-wrap break-words h-8', className)}
        >
          <span className='truncate'>{value ? handleFind(value) : 'Select...'}</span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[200px] p-0', className)}>
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandList>
            <CommandEmpty>No Result Found.</CommandEmpty>
            <CommandGroup>
              {data?.map(item => (
                <CommandItem
                  key={typeof item === 'string' ? item : item.value}
                  value={typeof item === 'string' ? item : item.value}
                  onSelect={currentValue => {
                    onChange(currentValue as T);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === (typeof item === 'string' ? item : item.value) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {typeof item === 'string' ? item : item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
