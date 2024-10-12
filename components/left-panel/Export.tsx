'use client';

import { useStore } from '@/lib/store';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { FolderUp } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const exportOptions: Array<'json' | 'jpeg' | 'png'> = ['json', 'jpeg', 'png'];

export function Export() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='text-xs'>
          <FolderUp className='h-3 w-3 mr-1' />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-36 bg-zinc-100 border shadow p-1 gap-1 rounded-md'>
        {exportOptions.map(val => (
          <DropdownMenuItem key={val} onClick={() => useStore.setState({ exportFormat: val })}>
            {val.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
