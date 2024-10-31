import { Button } from '@/components/ui/button';
import type { Gsea, SelectedNodeProperty } from '@/lib/interface';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

function headerHelper<TData>(columnName: string) {
  return ({ column }: { column: Column<TData> }) => {
    return (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {columnName}
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    );
  };
}
export const columnSelectedNodes: ColumnDef<SelectedNodeProperty>[] = [
  {
    accessorKey: 'Gene_Name',
    header: headerHelper('Gene Name'),
  },
  {
    accessorKey: 'ID',
    header: headerHelper('ENSG ID'),
  },
  {
    accessorKey: 'Description',
    header: headerHelper('Description'),
  },
];

export const columnGseaResults: ColumnDef<Gsea>[] = [
  {
    accessorKey: 'Gene_set',
    header: headerHelper('Term'),
  },
  {
    accessorKey: 'Overlap',
    header: headerHelper('Overlap'),
  },
  {
    accessorKey: 'P-value',
    header: headerHelper('P-Value'),
  },
  {
    accessorKey: 'Adjusted P-value',
    header: headerHelper('Adjusted P-Value'),
  },
  {
    accessorKey: 'Odds Ratio',
    header: headerHelper('Odds Ratio'),
  },
  {
    accessorKey: 'Combined Score',
    header: headerHelper('Combined Score'),
  },
  {
    accessorKey: 'Genes',
    header: headerHelper('Genes'),
  },
];
