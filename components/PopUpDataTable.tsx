import type { PopUpDataTableProps, SelectedNodeProperty } from '@/lib/interface';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download } from 'lucide-react';
import { Button } from './ui/button';
import { DataTable } from './ui/data-table';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from './ui/dialog';

export default function PopUpDataTable({ data, open = false, setOpen }: PopUpDataTableProps) {
  /**
   * Function to download the selected genes data as a JSON file
   */
  const handleDownload = () => {
    const json = JSON.stringify(data, null, 2);
    const element = document.createElement('a');
    const file = new Blob([json], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'selected_genes.json';
    document.body.appendChild(element);
    element.click();
    URL.revokeObjectURL(element.href);
    element.remove();
  };

  /**
   * Columns for the data table
   */
  const columns: ColumnDef<SelectedNodeProperty>[] = [
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

  return (
    <Dialog open={open}>
      <DialogContent className='max-w-4xl w-11/12 max-h-[90vh] min-h-[60vh] flex flex-col'>
        <DialogTitle>Results Preview [Genes: {data.length}]</DialogTitle>
        <div className='flex-grow overflow-y-scroll'>
          {/* Data Table for viewing and filtering */}
          <DataTable data={data} columns={columns} filterColumnName='Gene_Name' />
        </div>
        <DialogFooter className='gap-2 w-full'>
          <Button size={'icon'} variant={'outline'} onClick={handleDownload}>
            <Download size={20} />
          </Button>
          <DialogClose asChild>
            <Button type='button' variant={'secondary'} onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
