import { type EventMessage, Events, eventEmitter } from '@/lib/utils';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { FolderUpIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const exportOptions: Array<'json' | 'csv' | 'png'> = ['json', 'csv', 'png'];

export function Export() {
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
        {exportOptions.map(val => (
          <DropdownMenuItem
            key={val}
            onClick={() =>
              eventEmitter.emit(Events.EXPORT, { format: val, all: true } satisfies EventMessage[Events.EXPORT])
            }
            className='cursor-pointer'
          >
            {val.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
