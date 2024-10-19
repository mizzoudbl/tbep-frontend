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
                linkDistance (0.1-10)
              </Label>
            </TooltipTrigger>
            <Slider
              id='linkDistance'
              className='w-full'
              min={1}
              max={100}
              step={1}
              value={[forceSettings.linkDistance]}
              onValueChange={value => updateForceSetting(value || '0', 'linkDistance')}
            />
          </div>
          <TooltipContent>
            <p>Increases or decreases the pull towards the center of the graph</p>
          </TooltipContent>
        </Tooltip>
        <Input
          type='number'
          className='w-16 h-8'
          min={1}
          max={50}
          step={1}
          value={forceSettings.linkDistance}
          onChange={e => updateForceSetting(e.target.value || '0', 'linkDistance')}
        />
      </div>
      <div className='flex space-x-2 items-center'>
        <Tooltip>
          <div className='flex flex-col space-y-2 w-full'>
            <TooltipTrigger asChild>
              <Label htmlFor='chargeStrength' className='text-xs font-semibold'>
                chargeStrength (0-10)
              </Label>
            </TooltipTrigger>
            <Slider
              id='chargeStrength'
              className='w-full'
              min={-500}
              max={100}
              step={1}
              value={[forceSettings.chargeStrength]}
              onValueChange={value => updateForceSetting(value || '-200', 'chargeStrength')}
            />
          </div>
          <TooltipContent>
            <p>Increases or decreases the strength of chargeStrength between nodes</p>
          </TooltipContent>
        </Tooltip>
        <Input
          type='number'
          className='w-16 h-8'
          min={-500}
          max={100}
          step={1}
          value={forceSettings.chargeStrength}
          onChange={e => updateForceSetting(e.target.value || '-200', 'chargeStrength')}
        />
      </div>
      <div className='flex space-x-2 items-center'>
        <Tooltip>
          <div className='flex flex-col space-y-2 w-full'>
            <TooltipTrigger asChild>
              <Label htmlFor='collideForce' className='text-xs font-semibold'>
                collideForce (0-1)
              </Label>
            </TooltipTrigger>
            <Slider
              id='collideForce'
              className='w-full'
              min={0}
              max={1}
              step={0.1}
              value={[forceSettings.collideForce]}
              onValueChange={value => updateForceSetting(value, 'collideForce')}
            />
          </div>
          <TooltipContent>
            <p>collideForce of the layout</p>
          </TooltipContent>
        </Tooltip>
        <Input
          type='number'
          className='w-16 h-8'
          min={0}
          max={1}
          step={0.1}
          value={forceSettings.collideForce}
          onChange={e => updateForceSetting(e.target.value, 'collideForce')}
        />
      </div>
      <div className='flex space-x-2 items-center'>
        <Tooltip>
          <div className='flex flex-col space-y-2 w-full'>
            <TooltipTrigger asChild>
              <Label htmlFor='collideRadius' className='text-xs font-semibold'>
                collideRadius (0-10)
              </Label>
            </TooltipTrigger>
            <Slider
              id='collideRadius'
              className='w-full'
              min={0.1}
              max={10}
              step={0.1}
              value={[forceSettings.collideRadius]}
              onValueChange={value => updateForceSetting(value, 'collideRadius')}
            />
          </div>
          <TooltipContent>
            <p>collideRadius of the layout</p>
          </TooltipContent>
        </Tooltip>
        <Input
          type='number'
          className='w-16 h-8'
          min={0.1}
          max={10}
          step={0.1}
          value={forceSettings.collideRadius}
          onChange={e => updateForceSetting(e.target.value, 'collideRadius')}
        />
      </div>
    </>
  );
}
