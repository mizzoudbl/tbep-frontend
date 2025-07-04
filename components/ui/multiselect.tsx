'use client';

import * as Popover from '@radix-ui/react-popover';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, selectedValues = [], onChange, placeholder = 'Select...', disabled = false, className }, ref) => {
    const [open, setOpen] = React.useState(false);
    const selected = selectedValues ?? [];

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const [width, setWidth] = React.useState<number>();

    React.useEffect(() => {
      if (open && triggerRef.current) {
        setWidth(triggerRef.current.offsetWidth);
      }
    }, [open]);

    const setRefs = (node: HTMLButtonElement | null) => {
      if (typeof ref === 'function') ref(node);
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      if (triggerRef && 'current' in triggerRef) {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }
    };

    const toggleValue = (val: string) => {
      if (selected.includes(val)) {
        onChange(selected.filter(v => v !== val));
      } else {
        onChange([...selected, val]);
      }
    };

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type='button'
            ref={setRefs}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
          >
            <span className='truncate'>
              {selected.length > 0
                ? options
                    .filter(o => selected.includes(o.value))
                    .map(o => o.label)
                    .join(', ')
                : placeholder}
            </span>
            <ChevronsUpDownIcon className='h-4 w-4 opacity-50' />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            style={width ? { width } : undefined}
            className={cn(
              'z-50 min-w-0 max-h-96 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
            )}
          >
            {options.map(option => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              <div
                key={option.value}
                onClick={() => toggleValue(option.value)}
                className={cn(
                  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
                  {selected.includes(option.value) && <CheckIcon className='h-4 w-4' />}
                </span>
                {option.label}
              </div>
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);
MultiSelect.displayName = 'MultiSelect';
