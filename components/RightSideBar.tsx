import type { RightSideBarProps } from '@/lib/interface';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function RightSideBar({
  sliderValue2,
  setSliderValue2,
  handleSliderChange,
  handleInputChange,
}: RightSideBarProps) {
  return (
    <ScrollArea className='border-l p-2'>
      <div className='mb-4 border p-2 rounded-md'>
        <p className='text-xs font-bold mb-2'>Network Layout</p>
        <div className='flex items-center space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex flex-col space-y-2'>
                <Label htmlFor='linkCharge' className='text-xs'>
                  Link Charge
                </Label>
                <Slider id='linkCharge' className='w-full' />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is Toggle 1</p>
            </TooltipContent>
          </Tooltip>
          <Input
            type='number'
            value={sliderValue2}
            onChange={e => handleInputChange(e, setSliderValue2)}
            className='w-16 h-8 text-xs'
            min={0}
            max={100}
          />
        </div>
        <div className='flex items-center space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex flex-col space-y-2'>
                <Label htmlFor='linkDistance' className='text-xs'>
                  Link Distance
                </Label>
                <Slider id='linkDistance' className='w-full' />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is Toggle 2</p>
            </TooltipContent>
          </Tooltip>
          <Input
            type='number'
            value={sliderValue2}
            onChange={e => handleInputChange(e, setSliderValue2)}
            className='w-16 h-8 text-xs'
            min={0}
            max={100}
          />
        </div>
        <div className='flex items-center space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Slider id='distance' className='w-full' />
            </TooltipTrigger>
            <TooltipContent>
              <p>This is Toggle 2</p>
            </TooltipContent>
          </Tooltip>
          <Input
            type='number'
            value={sliderValue2}
            onChange={e => handleInputChange(e, setSliderValue2)}
            className='w-16 h-8 text-xs'
            min={0}
            max={100}
          />
        </div>
      </div>
      <div>
        <Label className='text-xs font-bold mb-2'>Right Section 2</Label>
        <div className='flex items-center space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Slider
                value={[sliderValue2]}
                onValueChange={value => handleSliderChange(value, setSliderValue2)}
                max={100}
                step={1}
                className='w-full'
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust the slider value</p>
            </TooltipContent>
          </Tooltip>
          <Input
            type='number'
            value={sliderValue2}
            onChange={e => handleInputChange(e, setSliderValue2)}
            className='w-16 h-8 text-xs'
            min={0}
            max={100}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
