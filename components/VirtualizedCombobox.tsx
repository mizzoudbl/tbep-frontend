import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Spinner } from './ui/spinner';

interface VirtualizedCommandProps {
  options: string[];
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
  const [filteredOptions, setFilteredOptions] = React.useState<string[]>(options);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const handleSearch = (search: string) => {
    setFilteredOptions(options.filter(option => option.toLowerCase().includes(search.toLowerCase() ?? [])));
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
            {virtualOptions.map(virtualOption => (
              <CommandItem
                className={'absolute flex justify-between w-full'}
                style={{
                  transform: `translateY(${virtualOption.start}px)`,
                }}
                key={filteredOptions[virtualOption.index]}
                value={filteredOptions[virtualOption.index]}
                onSelect={onSelectOption}
              >
                {filteredOptions[virtualOption.index]}
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedOption === filteredOptions[virtualOption.index] ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </CommandItem>
            ))}
          </div>
        </CommandList>
      </CommandGroup>
    </Command>
  );
};

interface VirtualizedComboboxProps {
  loading?: boolean;
  className?: string;
  data?: string[];
  searchPlaceholder?: string;
  value: string;
  width?: string;
  setValue: (value: string) => void;
}

export function VirtualizedCombobox({
  loading = false,
  className,
  data = [],
  searchPlaceholder = 'Search items...',
  value,
  width = '800px',
  setValue,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('justify-between w-full', className)}
        >
          <span className='truncate'>{(!!value && data.find(option => option === value)) ?? searchPlaceholder}</span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className={cn('p-0 w-full', className)}>
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
