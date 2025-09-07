'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none flex-col items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
      <SliderPrimitive.Range className='absolute h-full bg-primary' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='-top-1 -left-2 absolute block size-4 rounded-full border border-primary/50 bg-background shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' />
    <div className='mt-1 flex w-full justify-between'>
      <span>{props.min}</span>
      <span>{props.max}</span>
    </div>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
