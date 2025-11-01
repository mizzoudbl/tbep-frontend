'use client';

import { FolderUpIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { type EventMessage, Events, eventEmitter } from '@/lib/utils';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const exportOptions = [
  { label: 'csv', hasSubmenu: true },
  { label: 'png', hasSubmenu: false },
] as const;

export function Export() {
  const [csvSelections, setCsvSelections] = useState<{ universal: boolean; interaction: boolean }>({
    universal: false,
    interaction: false,
  });

  const handleCheckboxChange = (type: 'universal' | 'interaction') => {
    setCsvSelections(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleCsvExport = () => {
    const { universal, interaction } = csvSelections;
    if (!universal && !interaction) return;

    const csvType = universal && interaction ? 'both' : universal ? 'universal' : 'interaction';
    eventEmitter.emit(Events.EXPORT, { format: 'csv', all: true, csvType } satisfies EventMessage[Events.EXPORT]);
  };

  const universalCheckBoxId = useId();
  const interactionCheckBoxId = useId();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='mr-2 mb-2 w-[calc(100%-1.5rem)] rounded-sm border-none bg-zinc-200 text-xs hover:bg-zinc-300 hover:text-black'
        >
          <FolderUpIcon className='size-3' />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='z-10 w-36 gap-1 rounded-md border bg-zinc-100 p-1 shadow-sm'>
        {exportOptions.map(opt =>
          opt.hasSubmenu ? (
            <DropdownMenuSub key={opt.label}>
              <DropdownMenuSubTrigger className='cursor-pointer'>{opt.label.toUpperCase()}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className='z-20 flex w-48 flex-col gap-2 rounded-md border bg-zinc-100 p-2 shadow-sm'>
                <div className='flex cursor-pointer items-center gap-2 px-2 py-1'>
                  <Checkbox
                    id={universalCheckBoxId}
                    checked={csvSelections.universal}
                    onCheckedChange={() => handleCheckboxChange('universal')}
                  />
                  <label htmlFor={universalCheckBoxId}>Universal</label>
                </div>
                <div className='flex cursor-pointer items-center gap-2 px-2 py-1'>
                  <Checkbox
                    id={interactionCheckBoxId}
                    checked={csvSelections.interaction}
                    onCheckedChange={() => handleCheckboxChange('interaction')}
                  />
                  <label htmlFor={interactionCheckBoxId}>Interaction</label>
                </div>
                <Button
                  size='sm'
                  className='mt-2'
                  onClick={handleCsvExport}
                  disabled={!csvSelections.universal && !csvSelections.interaction}
                >
                  Export
                </Button>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem
              key={opt.label}
              onClick={() => eventEmitter.emit(Events.EXPORT, { format: opt.label, all: true })}
              className='cursor-pointer'
            >
              {opt.label.toUpperCase()}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
