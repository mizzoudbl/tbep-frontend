import { ChevronsUpDownIcon, InfoIcon, RefreshCcwIcon } from 'lucide-react';
import { type NodeColorType, nodeColor, PROPERTY_LABEL_TYPE_MAPPING } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Combobox } from '../ui/combobox';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { VirtualizedCombobox } from '../VirtualizedCombobox';

export function NodeColor({ onPropChange }: { onPropChange: (prop: string | Set<string>) => void }) {
  const radioValue = useStore(state => state.selectedRadioNodeColor);
  const radioOptions = useStore(state => state.radioOptions);
  const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);

  return (
    <Collapsible defaultOpen className='my-2 border p-2 rounded shadow'>
      <div className='flex items-center justify-between w-full'>
        <Label className='font-bold'>Node Color</Label>
        <div className='space-x-1 flex items-center'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => useStore.setState({ selectedRadioNodeColor: undefined })}
                type='button'
                variant='outline'
                size='icon'
                className='w-6 h-6'
              >
                <RefreshCcwIcon size={15} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset</p>
            </TooltipContent>
          </Tooltip>
          <CollapsibleTrigger asChild>
            <Button type='button' variant='outline' size='icon' className='w-6 h-6'>
              <ChevronsUpDownIcon size={15} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className='mt-2'>
        <RadioGroup
          value={radioValue ?? ''}
          onValueChange={value =>
            useStore.setState({ selectedRadioNodeColor: value as NodeColorType, selectedNodeColorProperty: '' })
          }
        >
          {nodeColor.map(({ label, tooltipContent }) => (
            <Tooltip key={label}>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value={PROPERTY_LABEL_TYPE_MAPPING[label]} id={label} />
                <Label htmlFor={label} className='text-xs'>
                  {label}
                </Label>
                <TooltipTrigger asChild>{tooltipContent && <InfoIcon size={12} className='shrink-0' />}</TooltipTrigger>
              </div>
              {tooltipContent && (
                <TooltipContent align='start'>
                  <p className='max-w-80'>{tooltipContent}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </RadioGroup>
        {radioValue &&
          (radioValue === 'TE' || radioValue === 'Pathway' ? (
            <VirtualizedCombobox
              key={radioValue}
              data={[...radioOptions.database[radioValue], ...radioOptions.user[radioValue]]}
              className='w-full mt-2'
              value={selectedNodeColorProperty}
              onChange={onPropChange}
              width={radioValue === 'TE' ? '550px' : '800px'}
              multiselect
            />
          ) : (
            <Combobox
              key={radioValue}
              data={[...radioOptions.database[radioValue], ...radioOptions.user[radioValue]]}
              className='w-full mt-2'
              value={selectedNodeColorProperty}
              onChange={onPropChange}
            />
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
