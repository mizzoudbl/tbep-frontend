import { DownloadIcon } from 'lucide-react';
import { unparse } from 'papaparse';
import { useEffect } from 'react';
import { useStore } from '@/lib/hooks';
import type { PopUpTableProps } from '@/lib/interface';
import { downloadFile } from '@/lib/utils';
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
    let csv: string;
    if (foundGenes) {
      csv = unparse(
        data?.genes.map(gene => ({
          ENSG_ID: gene.ID,
          Input: gene.Input,
          Gene_Name: gene.Gene_name,
          Aliases: gene.Aliases,
          Description: gene.Description,
        })) ?? [],
      );
    } else {
      csv = unparse(
        geneIDs.filter(gene => !data?.genes.find(g => g.Input === gene || g.ID === gene)).map(gene => ({ Gene: gene })),
      );
    }
    const projectTitle = useStore.getState().projectTitle;
    downloadFile(
      csv,
      `${projectTitle === 'Untitled' ? '' : `${projectTitle}_`}${foundGenes ? 'found_genes' : 'not_found_genes'}.csv`,
    );
  };

  const notFoundFilteredGeneIDs = geneIDs.filter(gene => !data?.genes.find(g => g.Input === gene || g.ID === gene));

  useEffect(() => {
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        setTableOpen(false);
      }
    });
    return () => {
      window.removeEventListener('keydown', e => {
        if (e.key === 'Escape') {
          setTableOpen(false);
        }
      });
    };
  }, [setTableOpen]);

  return (
    <Dialog open={tableOpen}>
      <DialogContent className='flex max-h-[90vh] min-h-[60vh] w-11/12 max-w-5xl flex-col'>
        <DialogTitle>Results Preview</DialogTitle>
        <DialogDescription>
          Preview the results before submitting for network generation. You can also download the results as a CSV file.
        </DialogDescription>
        <div className='grow overflow-y-scroll'>
          <Tabs defaultValue='found'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='found'>Found</TabsTrigger>
              <TabsTrigger
                value='not-found'
                className={`${notFoundFilteredGeneIDs.length > 0 && 'font-semibold text-red-500 underline'}`}
              >
                Not-Found
              </TabsTrigger>
            </TabsList>
            <TabsContent value='found'>
              <Table>
                <TableHeader>
                  <TableRow className='font-bold'>
                    <TableHead>S. No.</TableHead>
                    <TableHead>Input</TableHead>
                    <TableHead>ENSG ID</TableHead>
                    <TableHead>Gene Name</TableHead>
                    <TableHead>Aliases</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.genes.map((gene, index) => (
                    <TableRow key={`${gene.ID}-${gene.Input}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{gene.Input}</TableCell>
                      <TableCell className='cursor-pointer underline hover:text-teal-900'>
                        <a
                          className='flex gap-1'
                          target='_blank'
                          rel='noreferrer'
                          href={`https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.ID}`}
                        >
                          {gene.ID}
                        </a>
                      </TableCell>
                      <TableCell className='cursor-pointer underline hover:text-teal-900'>
                        <a
                          className='flex gap-1'
                          target='_blank'
                          rel='noreferrer'
                          href={`https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${gene.hgnc_gene_id}`}
                        >
                          {gene.Gene_name}
                        </a>
                      </TableCell>
                      <TableCell>{gene.Aliases}</TableCell>
                      <TableCell>{gene.Description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value='not-found'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='font-bold'>S. No.</TableHead>
                    <TableHead className='font-bold'>ENSG ID/Gene Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notFoundFilteredGeneIDs.map((gene, index) => (
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
        <DialogFooter className='w-full gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} variant={'outline'}>
                <DownloadIcon size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload(true)}>Found</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(false)}>Not-Found</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => handleGenerateGraph()} className='bg-teal-600 hover:bg-teal-700'>
            Submit
          </Button>
          <DialogClose asChild>
            <Button type='button' variant={'secondary'} onClick={() => setTableOpen(false)}>
              Close (Esc)
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
