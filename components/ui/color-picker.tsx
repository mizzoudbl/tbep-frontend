'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStore } from '@/lib/hooks';
import type { GraphStore } from '@/lib/interface';
import { cn } from '@/lib/utils';
import { Paintbrush } from 'lucide-react';
import React from 'react';

export function ColorPicker({
  color,
  property,
  className,
}: {
  color: string;
  property: keyof GraphStore;
  className?: string;
}) {
  const solids = ['black', 'hotpink', 'orange', 'yellow', 'limegreen', 'aquamarine', 'darkorchid', 'red', 'blue'];

  const handleNodeColorChange = (e: React.KeyboardEvent<HTMLInputElement> | string, key: keyof GraphStore) => {
    if (typeof e === 'string') {
      useStore.setState({ [key]: e });
    } else if (e.key === 'Enter') {
      useStore.setState({ [key]: e.currentTarget.value });
    }
  };

  const [inputValue, setInputValue] = React.useState<string>(color);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[220px] justify-start text-left font-normal', !color && 'text-muted-foreground', className)}
        >
          <div className='w-full flex items-center gap-2'>
            {color ? (
              <div className='h-4 w-4 rounded !bg-center !bg-cover transition-all' style={{ background: color }} />
            ) : (
              <Paintbrush className='h-4 w-4' />
            )}
            <span className='truncate flex-1'>{color ? color : 'Pick a color'}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-36 md:w-64' align='end'>
        <div className='flex flex-wrap'>
          {solids.map(s => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={s}
              style={{ background: s }}
              onClick={e => handleNodeColorChange(s, property)}
              className='rounded-md h-6 w-6 cursor-pointer hover:scale-105'
            />
          ))}
        </div>

        <Input
          id='custom'
          value={inputValue}
          className='col-span-2 h-8 mt-4'
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => handleNodeColorChange(e, property)}
        />
      </PopoverContent>
    </Popover>
  );
}
