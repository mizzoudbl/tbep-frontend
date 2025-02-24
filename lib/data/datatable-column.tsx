import { Button } from '@/components/ui/button';
import type { Gsea, SelectedNodeProperty } from '@/lib/interface';
import type { CellContext, Column, ColumnDef } from '@tanstack/react-table';
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

export const columnLeidenResults: ColumnDef<Record<string, string>>[] = [
  {
    accessorKey: 'name',
    header: headerHelper('Cluster'),
    cell: ({ cell }: CellContext<Record<string, string>, string>) => (
      <div className='inline-flex gap-2 items-center'>
        <span
          className='rounded-full w-4 h-4 border'
          style={{ backgroundColor: cell.row.original.color, borderColor: cell.row.original.color }}
        />
        {cell.getValue()}
      </div>
    ),
    meta: { width: '8rem' },
  },
  {
    accessorKey: 'numberOfGenes',
    header: headerHelper('Number of Genes'),
    sortingFn: (a, b) => Number(a.original.numberOfGenes) - Number(b.original.numberOfGenes),
    meta: { textAlign: 'center' },
  },
  {
    accessorKey: 'percentage',
    header: headerHelper('Percentage'),
    sortingFn: (a, b) => Number(a.original.percentage) - Number(b.original.percentage),
    meta: { textAlign: 'center' },
  },
  {
    accessorKey: 'averageDegree',
    header: headerHelper('Average Degree'),
    sortingFn: (a, b) => Number(a.original.averageDegree) - Number(b.original.averageDegree),
    meta: { textAlign: 'center' },
  },
  {
    accessorKey: 'degreeCentralGene',
    header: headerHelper('Degree Central Gene'),
    meta: { textAlign: 'center' },
  },
  {
    accessorKey: 'genes',
    header: headerHelper('Genes'),
    meta: { wordBreak: 'break-word' },
  },
];

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
    accessorKey: 'Pathway',
    header: headerHelper('Pathway'),
  },
  {
    accessorKey: 'Overlap',
    header: headerHelper('Overlap'),
  },
  {
    accessorKey: 'P-value',
    header: headerHelper('P-Value'),
    sortingFn: (a, b) => Number(a.original['P-value']) - Number(b.original['P-value']),
  },
  {
    accessorKey: 'Adjusted P-value',
    header: headerHelper('Adjusted P-Value'),
    sortingFn: (a, b) => Number(a.original['Adjusted P-value']) - Number(b.original['Adjusted P-value']),
  },
  {
    accessorKey: 'Odds Ratio',
    header: headerHelper('Odds Ratio'),
    sortingFn: (a, b) => Number(a.original['Odds Ratio']) - Number(b.original['Odds Ratio']),
  },
  {
    accessorKey: 'Combined Score',
    header: headerHelper('Combined Score'),
    sortingFn: (a, b) => Number(a.original['Combined Score']) - Number(b.original['Combined Score']),
  },
  {
    accessorKey: 'Genes',
    header: headerHelper('Genes'),
    meta: { wordBreak: 'break-word' },
  },
];
