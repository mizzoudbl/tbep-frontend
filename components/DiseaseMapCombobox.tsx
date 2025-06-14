import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { GetDiseaseData } from '@/lib/interface';
import { OptimizedMedicalSearch, type SearchItem } from '@/lib/search';
import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CheckIcon, ChevronsUpDownIcon, InfoIcon } from 'lucide-react';
import * as React from 'react';
import { Spinner } from './ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface VirtualizedCommandProps {
  options: SearchItem[];
  selectedOption: string;
  onSelectOption?: (option: string) => void;
}

const VirtualizedCommand = ({ options, selectedOption, onSelectOption }: VirtualizedCommandProps) => {
  // Create a memoized search engine to avoid recreating on renders
  const searchEngine = React.useMemo(() => {
    return new OptimizedMedicalSearch(options);
  }, [options]); // Only recreate when options change

  const [filteredOptions, setFilteredOptions] = React.useState<SearchItem[]>(options);
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const handleSearch = React.useCallback(
    (search: string) => {
      if (!search || search.length < 2) {
        setFilteredOptions(options);
        return;
      }
      // Use the optimized search engine for searching with debouncing
      searchEngine.debouncedSearch(search, results => setFilteredOptions(results));
    },
    [options, searchEngine],
  );

  return (
    <Command style={{ width: '800px' }} shouldFilter={false}>
      <CommandInput onValueChange={handleSearch} placeholder={'Search Disease...'} />
      {options.length === 0 ? <Spinner variant={1} size={'small'} /> : <CommandEmpty>No Result Found.</CommandEmpty>}
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
              return (
                <CommandItem
                  className='absolute flex justify-between w-full overflow-visible'
                  style={{
                    transform: `translateY(${virtualOption.start}px)`,
                  }}
                  key={option.id}
                  value={option.id}
                  onSelect={onSelectOption}
                >
                  <div className='flex item-center'>
                    <CheckIcon
                      className={cn('mr-2 h-4 w-4', selectedOption === option.id ? 'opacity-100' : 'opacity-0')}
                    />
                    {`${option.label}`}
                  </div>
                  {option.description && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className='h-4 w-4 ml-2 cursor-pointer' />
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

interface DiseaseMapComboboxProps {
  className?: string;
  data?: GetDiseaseData;
  value: string;
  onChange: (value: string) => void;
  align?: 'start' | 'end' | 'center';
}

export function DiseaseMapCombobox({
  className,
  data = [],
  value,
  onChange,
  align = 'start',
}: DiseaseMapComboboxProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  // Use the search hook with initial data from props
  const searchItems: SearchItem[] = React.useMemo(
    () =>
      data.map(item => ({
        id: item.ID,
        label: `${item.name} (${item.ID})`,
        description: item.description,
      })),
    [data],
  );

  const optionsMap = React.useMemo(() => {
    const map = new Map<string, SearchItem>();
    for (const option of searchItems) {
      map.set(option.id, option);
    }
    return map;
  }, [searchItems]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-[200px] justify-between text-ellipsis text-wrap break-words h-9', className)}
        >
          <span className='truncate'>{optionsMap.get(value)?.label || 'Search Disease...'}</span>
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={cn('w-[800px] p-0', className)}>
        <VirtualizedCommand
          options={searchItems}
          selectedOption={value}
          onSelectOption={currentValue => {
            onChange(currentValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
