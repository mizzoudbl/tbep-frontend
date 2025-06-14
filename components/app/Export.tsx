'use client';

import { type EventMessage, Events, eventEmitter } from '@/lib/utils';
import { FolderUpIcon } from 'lucide-react';
import { useState } from 'react';
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='w-[calc(100%-1.5rem)] mb-2 mr-2 text-xs hover:bg-zinc-300 border-none bg-zinc-200 hover:text-black rounded-sm '
        >
          <FolderUpIcon className='h-3 w-3 mr-1' />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='z-10 w-36 bg-zinc-100 border shadow p-1 gap-1 rounded-md'>
        {exportOptions.map(opt =>
          opt.hasSubmenu ? (
            <DropdownMenuSub key={opt.label}>
              <DropdownMenuSubTrigger className='cursor-pointer'>{opt.label.toUpperCase()}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className='z-20 w-48 bg-zinc-100 border shadow p-2 gap-2 rounded-md flex flex-col'>
                <div className='flex items-center gap-2 px-2 py-1 cursor-pointer'>
                  <Checkbox
                    id='universal-checkbox'
                    checked={csvSelections.universal}
                    onCheckedChange={() => handleCheckboxChange('universal')}
                  />
                  <label htmlFor='universal-checkbox'>Universal</label>
                </div>
                <div className='flex items-center gap-2 px-2 py-1 cursor-pointer'>
                  <Checkbox
                    id='interaction-checkbox'
                    checked={csvSelections.interaction}
                    onCheckedChange={() => handleCheckboxChange('interaction')}
                  />
                  <label htmlFor='interaction-checkbox'>Interaction</label>
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
