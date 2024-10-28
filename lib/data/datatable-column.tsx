import { Button } from '@/components/ui/button';
import type { SelectedNodeProperty } from '@/lib/interface';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columnSelectedNodes: ColumnDef<SelectedNodeProperty>[] = [
  {
    accessorKey: 'Gene_Name',
    header({ column }) {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Gene Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'ID',
    header(props) {
      return (
        <Button variant='ghost' onClick={() => props.column.toggleSorting(props.column.getIsSorted() === 'asc')}>
          ENSG ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'Description',
    header(props) {
      return (
        <Button variant='ghost' onClick={() => props.column.toggleSorting(props.column.getIsSorted() === 'asc')}>
          Description
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
];
