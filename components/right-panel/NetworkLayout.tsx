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
      <div className='flex space-x-2 items-center'>
        <Tooltip>
          <div className='flex flex-col space-y-2 w-full'>
            <TooltipTrigger asChild>
              <Label htmlFor='linkDistance' className='text-xs font-semibold'>
                Link Distance (1-1000)
              </Label>
            </TooltipTrigger>
            <Slider
              id='linkDistance'
              className='w-full'
              min={1}
              max={1000}
              step={10}
              value={[forceSettings.linkDistance]}
              onValueChange={value => updateForceSetting(value, 'linkDistance')}
            />
          </div>
          <TooltipContent align='end'>
            <p>Distance between connected nodes</p>
          </TooltipContent>
        </Tooltip>
        <Input
          type='number'
          className='w-16 h-8'
          min={1}
          max={100}
          step={1}
          value={forceSettings.linkDistance}
          onChange={e => updateForceSetting(e.target.value, 'linkDistance')}
        />
      </div>
      <div className='flex space-x-2 items-center'>
        <Tooltip>
          <div className='flex flex-col space-y-2 w-full'>
            <TooltipTrigger asChild>
              <Label htmlFor='chargeStrength' className='text-xs font-semibold'>
                Charge Strength (-500 - 50)
              </Label>
            </TooltipTrigger>
            <Slider
              id='chargeStrength'
              className='w-full'
              min={-500}
              max={50}
              step={1}
              value={[forceSettings.chargeStrength]}
              onValueChange={value => updateForceSetting(value, 'chargeStrength')}
            />
          </div>
          <TooltipContent className='max-w-60' align='end'>
            <b>Negative</b> is repulsion strength and <b>positive</b> is attraction strength between nodes
          </TooltipContent>
        </Tooltip>
        <Input
          type='number'
          className='w-16 h-8'
          min={-500}
          max={50}
          step={1}
          value={forceSettings.chargeStrength}
          onChange={e => updateForceSetting(e.target.value, 'chargeStrength')}
        />
      </div>
    </>
  );
}
