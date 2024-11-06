'use client';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';

export default function SliderWithInput({
  min,
  max,
  step,
  name,
  id,
  defaultValue,
}: { min?: number; max?: number; step?: number; name: string; id: string; defaultValue: number }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className='flex items-center space-x-2'>
      <Slider
        min={min}
        max={max}
        step={step}
        name={name}
        id={id}
        defaultValue={[defaultValue]}
        value={[value]}
        onValueChange={e => setValue(e[0])}
      />
      <Input
        type='number'
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className='w-16'
      />
    </div>
  );
}
