import { algorithms } from '@/lib/data';
import { Events, eventEmitter } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import SliderWithInput from './SliderWithInput';

export function NetworkAnalysis({ children }: { children: React.ReactNode }) {
  const handleAlgoQuery = (name: string, formData?: FormData) => {
    if (formData) eventEmitter.emit(Events.ALGORITHM, { name, parameters: Object.fromEntries(formData.entries()) });
    else eventEmitter.emit(Events.ALGORITHM, { name });
  };

  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <div className='flex items-center justify-between w-full'>
        <p className='font-bold cursor-pointer hover:underline'>Network Analysis</p>
        <CollapsibleTrigger asChild>
          <Button type='button' variant='outline' size='icon' className='w-6 h-6'>
            <ChevronsUpDown size={15} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='mt-1'>
        <RadioGroup defaultValue='None' className='mb-2'>
          {algorithms.map(({ name, parameters }) => (
            <Popover key={name}>
              <PopoverTrigger asChild onClick={() => name === 'None' && handleAlgoQuery(name)}>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value={name} id={name} />
                  <Label htmlFor={name} className='text-xs'>
                    {name}
                  </Label>
                </div>
              </PopoverTrigger>
              {parameters.length > 0 && (
                <PopoverContent className='w-52'>
                  <form key={name} className='space-y-2 flex flex-col' action={f => handleAlgoQuery(name, f)}>
                    {parameters.map(({ name, displayName, type, defaultValue, min, max, step }) => {
                      if (type === 'slider') {
                        return (
                          <div key={name}>
                            <Label key={name} htmlFor={name} className='font-semibold text-xs'>
                              {displayName}
                            </Label>
                            <SliderWithInput
                              min={min}
                              max={max}
                              step={step}
                              name={name}
                              id={name}
                              defaultValue={defaultValue as number}
                            />
                          </div>
                        );
                      }
                      return (
                        <div
                          key={name}
                          style={{ gridTemplateColumns: '1fr 2fr' }}
                          className='grid grid-cols-2 w-full items-center gap-2'
                        >
                          <Label key={name} htmlFor={name} className='font-semibold text-xs'>
                            {displayName}
                          </Label>
                          <Checkbox name={name} id={name} defaultChecked={defaultValue as boolean} />
                        </div>
                      );
                    })}
                    <Button type='submit' size={'sm'} className=''>
                      Apply
                    </Button>
                  </form>
                </PopoverContent>
              )}
            </Popover>
          ))}
        </RadioGroup>
        <hr className='mb-1' />
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
