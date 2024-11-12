import { forceLayoutOptions } from '@/lib/data';
import type { ForceSettings } from '@/lib/interface';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function NetworkLayout({
  forceSettings,
  updateForceSetting,
}: {
  forceSettings: ForceSettings;
  updateForceSetting: (value: number[] | string, key: keyof ForceSettings) => void;
}) {
  return (
    <>
      {forceLayoutOptions.map(option => (
        <div key={option.key} className='flex space-x-2 items-center'>
          <Tooltip>
            <div className='flex flex-col space-y-2 w-full'>
              <TooltipTrigger asChild>
                <Label htmlFor={option.key} className='text-xs font-semibold'>
                  {option.label}
                </Label>
              </TooltipTrigger>
              <Slider
                id={option.key}
                className='w-full'
                min={option.min}
                max={option.max}
                step={option.step}
                value={[forceSettings[option.key]]}
                onValueChange={value => updateForceSetting(value, option.key)}
              />
            </div>
            <TooltipContent align='end'>{option.tooltip}</TooltipContent>
          </Tooltip>
          <Input
            type='number'
            className='w-16 h-8'
            min={option.min}
            max={option.max}
            step={option.step}
            value={forceSettings[option.key]}
            onChange={e => updateForceSetting(e.target.value, option.key)}
          />
        </div>
      ))}
    </>
  );
}
