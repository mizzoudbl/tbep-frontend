import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { Table,TableHeader, TableRow, TableHead, TableBody, TableCell } from "./ui/table";
import Image from 'next/image';
import NotFound from '@/public/image/not-found.svg';
import { PopUpTableProps } from "@/lib/interface";

export default function PopUpTable({ setTableOpen,  tableOpen, data, geneIDs = [], handleGenerateGraph }: PopUpTableProps) {
    return (
        <Dialog open={tableOpen}>
              <DialogContent className='max-w-4xl w-11/12 max-h-[90vh] min-h-[60vh] flex flex-col' iconClose={false}>
                <DialogTitle>Results Preview</DialogTitle>
                <DialogDescription className='flex-grow overflow-y-scroll'>
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
                      {data?.getGenes.length === 0 && (
                        <center className='grid place-items-center h-[30vh]'>
                          <Image src={NotFound} alt='No data found' />
                        </center>
                      )}
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
                          {geneIDs.map(
                            (gene, index) =>
                              !data?.getGenes.find(g => g.Gene_name === gene || g.ID === gene) && (
                                <TableRow key={gene}>
                                  <TableCell className=''>{index + 1}</TableCell>
                                  <TableCell>{gene}</TableCell>
                                </TableRow>
                              ),
                          )}
                        </TableBody>
                      </Table>
                      {data?.getGenes.length === geneIDs.length && (
                        <center className='grid place-items-center h-[30vh]'>
                          <Image src={NotFound} alt='No data found' />
                        </center>
                      )}
                    </TabsContent>
                  </Tabs>
                </DialogDescription>
                <DialogFooter className='gap-2 w-full'>
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