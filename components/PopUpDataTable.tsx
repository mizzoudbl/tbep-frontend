import type { PopUpDataTableProps } from '@/lib/interface';
import { Download } from 'lucide-react';
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
  const columns = [
    {
      accessorKey: 'Gene_Name',
      header: 'Gene Name',
    },
    {
      accessorKey: 'ID',
      header: 'ENSG ID',
    },
    {
      accessorKey: 'Description',
      header: 'Description',
    },
  ];

  return (
    <Dialog open={open}>
      <DialogContent className='max-w-4xl w-11/12 max-h-[90vh] min-h-[60vh] flex flex-col'>
        <DialogTitle>Results Preview</DialogTitle>
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
