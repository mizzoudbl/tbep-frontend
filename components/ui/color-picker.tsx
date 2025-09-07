'use client';

import { PaintbrushIcon } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStore } from '@/lib/hooks';
import type { GraphStore } from '@/lib/interface';
import { cn } from '@/lib/utils';

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
          <div className='flex w-full items-center gap-2'>
            {color ? (
              <div className='size-4 rounded bg-center! bg-cover! transition-all' style={{ background: color }} />
            ) : (
              <PaintbrushIcon className='size-4' />
            )}
            <span className='flex-1 truncate'>{color ? color : 'Pick a color'}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-36 md:w-64' align='end'>
        <div className='flex flex-wrap'>
          {solids.map(s => (
            <button
              type='button'
              key={s}
              style={{ background: s }}
              onClick={_e => handleNodeColorChange(s, property)}
              className='size-6 cursor-pointer rounded-md border-0 hover:scale-105'
            />
          ))}
        </div>

        <Input
          value={inputValue}
          className='col-span-2 mt-4 h-8'
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => handleNodeColorChange(e, property)}
        />
      </PopoverContent>
    </Popover>
  );
}
