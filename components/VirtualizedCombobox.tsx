import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { GenePropertyMetadata } from '@/lib/interface';
import { cn, getProperty } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, ChevronsUpDown, Info } from 'lucide-react';
import * as React from 'react';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface VirtualizedCommandProps {
  options: (string | GenePropertyMetadata)[];
  placeholder: string;
  selectedOption: string;
  onSelectOption?: (option: string) => void;
  loading?: boolean;
  width?: string;
}

const VirtualizedCommand = ({
  options,
  placeholder,
  selectedOption,
  onSelectOption,
  loading,
  width,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] = React.useState<(string | GenePropertyMetadata)[]>(options);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const handleSearch = (search: string) => {
    setFilteredOptions(
      options.filter(option => {
        if (typeof option === 'string') {
          return option.toLowerCase().includes(search.toLowerCase());
        }
        return option.name.toLowerCase().includes(search.toLowerCase());
      }),
    );
  };

  return (
    <Command style={{ width }} shouldFilter={false}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      {loading ? <Spinner variant={1} size={'small'} /> : <CommandEmpty>No Result Found.</CommandEmpty>}
      <CommandGroup>
        <CommandList ref={parentRef}>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualOptions.map(virtualOption => {
              const option = filteredOptions[virtualOption.index];
              const value = getProperty(option);
              return (
                <CommandItem
                  className='absolute flex justify-between w-full overflow-visible'
                  style={{
                    transform: `translateY(${virtualOption.start}px)`,
                  }}
                  key={value}
                  value={value}
                  onSelect={onSelectOption}
                >
                  <div className='flex item-center'>
                    <Check className={cn('mr-2 h-4 w-4', selectedOption === value ? 'opacity-100' : 'opacity-0')} />
                    {value}
                  </div>
                  {typeof option !== 'string' && option.description && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className='h-4 w-4 ml-2 cursor-pointer' />
                      </TooltipTrigger>
                      <TooltipContent side='left' align='start' className='max-w-48'>
                        {option.description}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CommandItem>
              );
            })}
          </div>
        </CommandList>
      </CommandGroup>
    </Command>
  );
};

interface VirtualizedComboboxProps {
  loading?: boolean;
  className?: string;
  data?: (string | GenePropertyMetadata)[];
  searchPlaceholder?: string;
  value: string;
  width?: string;
  setValue: (value: string) => void;
  align?: 'start' | 'end' | 'center';
}

export function VirtualizedCombobox({
  loading = false,
  className,
  data = [],
  searchPlaceholder = 'Search items...',
  value,
  width = '800px',
  setValue,
  align = 'start',
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-[200px] justify-between text-ellipsis text-wrap break-words h-9', className)}
        >
          <span className='truncate'>{value || searchPlaceholder}</span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={cn('w-[200px] p-0', className)}>
        <VirtualizedCommand
          options={data}
          placeholder={searchPlaceholder}
          selectedOption={value ?? ''}
          onSelectOption={currentValue => {
            setValue(currentValue);
            setOpen(false);
          }}
          loading={loading}
          width={width}
        />
      </PopoverContent>
    </Popover>
  );
}
