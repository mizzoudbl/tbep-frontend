import type { PopUpTableProps } from '@/lib/interface';
import NotFound from '@/public/image/not-found.svg';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function PopUpTable({
  setTableOpen,
  tableOpen,
  data,
  geneIDs = [],
  handleGenerateGraph,
}: PopUpTableProps) {
  const handleDownload = (foundGenes: boolean) => {
    let json: string;
    if (foundGenes) {
      json = JSON.stringify(
        data?.getGenes.map(gene => ({ ENSG_ID: gene.ID, Gene_Name: gene.Gene_name, Description: gene.Description })),
        null,
        2,
      );
    } else {
      json = JSON.stringify(geneIDs.filter(gene => !data?.getGenes.find(g => g.Gene_name === gene || g.ID === gene)));
    }
    const element = document.createElement('a');
    const file = new Blob([json], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = foundGenes ? 'found_genes.json' : 'not_found_genes.json';
    document.body.appendChild(element);
    element.click();
    URL.revokeObjectURL(element.href);
    element.remove();
  };

  return (
    <Dialog open={tableOpen}>
      <DialogContent className='max-w-4xl w-11/12 max-h-[90vh] min-h-[60vh] flex flex-col'>
        <DialogTitle>Results Preview</DialogTitle>
        <div className='flex-grow overflow-y-scroll'>
          <Tabs defaultValue='found'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='found'>Found</TabsTrigger>
              <TabsTrigger
                value='not-found'
                className={`${data?.getGenes.length !== geneIDs.length && 'text-red-500 underline font-semibold'}`}
              >
                Not-Found
              </TabsTrigger>
            </TabsList>
            <TabsContent value='found'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='font-bold'>S. No.</TableHead>
                    <TableHead className='font-bold'>ENSG ID</TableHead>
                    <TableHead className='font-bold'>Gene Name</TableHead>
                    <TableHead className='font-bold'>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.getGenes.map((gene, index) => (
                    <TableRow key={gene.ID}>
                      <TableCell className=''>{index + 1}</TableCell>
                      <TableCell className='underline hover:text-teal-900 cursor-pointer'>
                        <a
                          className='flex gap-1'
                          target='_blank'
                          rel='noreferrer'
                          href={`https://www.ensembl.org/Human/Search/Results?q=${gene.ID}`}
                        >
                          {gene.ID}
                        </a>
                      </TableCell>
                      <TableCell className='underline hover:text-teal-900 cursor-pointer'>
                        <a
                          className='flex gap-1'
                          target='_blank'
                          rel='noreferrer'
                          href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${gene.hgnc_gene_id}`}
                        >
                          {gene.Gene_name}
                        </a>
                      </TableCell>
                      <TableCell className=''>{gene.Description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value='not-found'>
              {/* Write only those geneIDs which are not present in data.getGenes and present in geneIDs */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='font-bold'>S. No.</TableHead>
                    <TableHead className='font-bold'>ENSG ID/Gene Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geneIDs
                    .filter(gene => !data?.getGenes.find(g => g.Gene_name === gene || g.ID === gene))
                    .map((gene, index) => (
                      <TableRow key={gene}>
                        <TableCell className=''>{index + 1}</TableCell>
                        <TableCell>{gene}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className='gap-2 w-full'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} variant={'outline'}>
                <Download size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload(true)}>Found</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(false)}>Not-Found</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleGenerateGraph} className='bg-teal-600 hover:bg-teal-700'>
            Submit
          </Button>
          <DialogClose asChild>
            <Button type='button' variant={'secondary'} onClick={() => setTableOpen(false)}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
