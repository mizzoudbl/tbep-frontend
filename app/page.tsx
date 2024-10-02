'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { GENE_VERIFICATION_QUERY } from '@/lib/gql';
import type { GeneVerificationData, GeneVerificationVariables } from '@/lib/interface';
import NotFound from '@/public/not-found.svg';
import { useLazyQuery } from '@apollo/client';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import React, { type ChangeEvent } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [fetchData, { data, loading, error }] = useLazyQuery<GeneVerificationData, GeneVerificationVariables>(
    GENE_VERIFICATION_QUERY,
  );
  const [formData, setFormData] = React.useState({
    seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2',
    diseaseMap: 'PSP',
    order: '0',
    interactionType: 'PPI',
    minScore: '0.7',
  });

  React.useEffect(() => {
    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTableOpen(false);
      }
    };
    const submitListener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (tableOpen) handleGenerateGraph();
        else document.querySelector('form')?.dispatchEvent(new Event('submit'));
      }
    };
    document.addEventListener('keydown', escapeListener);
    document.addEventListener('keydown', submitListener);
    return () => {
      document.removeEventListener('keydown', escapeListener);
      document.removeEventListener('keydown', submitListener);
    };
  }, []);

  const [tableOpen, setTableOpen] = React.useState(false);
  const [geneIDs, setGeneIDs] = React.useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { seedGenes } = formData;
    const geneIDs = Array.from(new Set(seedGenes.split(/,|\n/).map(gene => gene.trim())));
    if (geneIDs.length < 2)
      toast.error('Please enter at least 2 genes', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
      });
    else {
      setGeneIDs(geneIDs);
      await fetchData({ variables: { geneIDs } });
      setTableOpen(true);
    }
  };

  const handleSelect = (val: string, key: string) => {
    setFormData({ ...formData, [key]: val });
  };

  const handleFileRead = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          if (geneIDs.length < 2) {
            toast.error('Please enter at least 2 genes', {
              cancel: { label: 'Close', onClick() {} },
              position: 'top-center',
              richColors: true,
            });
          } else {
            setFormData({ ...formData, seedGenes: e.target.result as string });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSeedGenesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, seedGenes: event.target.value });
  };

  const handleGenerateGraph = () => {
    localStorage.setItem(
      'graphConfig',
      JSON.stringify({
        geneIDs,
        diseaseMap: formData.diseaseMap,
        order: formData.order,
        interactionType: formData.interactionType,
        minScore: formData.minScore,
      }),
    );
    window.open('/network', '_blank', 'noopener,noreferrer');
  };

  if (error) alert('Error fetching data');

  return (
    <>
      <div className='mx-auto rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-semibold mb-6'>Search by Multiple Proteins</h2>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <div className='flex justify-between'>
                <Label htmlFor='seedGenes'>Seed Genes</Label>
                <p className='text-zinc-500'>
                  (one-per-line or CSV; examples: {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <span
                    className='underline cursor-pointer'
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2',
                      });
                    }}
                  >
                    #1
                  </span>{' '}
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <span
                    className='underline cursor-pointer'
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seedGenes: `ENSG00000122359
ENSG00000100823
ENSG00000214944
ENSG00000172995
ENSG00000147894
ENSG00000162063`,
                      });
                    }}
                  >
                    #2
                  </span>{' '}
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <span
                    className='underline cursor-pointer'
                    onClick={() => {
                      setFormData({
                        ...formData,
                        seedGenes: `DCTN1
DNAJC7
ERBB4
ERLIN1
EWSR1
FIG4`,
                      });
                    }}
                  >
                    #3
                  </span>
                  )
                </p>
              </div>
              <Textarea
                rows={6}
                id='seedGenes'
                placeholder='Type seed genes in either , or new line separated format'
                className='mt-1'
                value={formData.seedGenes}
                onChange={handleSeedGenesChange}
              />
              <center>OR</center>
              <Label htmlFor='seedFile'>Picture</Label>
              <Input
                id='seedFile'
                type='file'
                className='border-2 hover:border-dashed cursor-pointer'
                onChange={handleFileRead}
              />
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div>
                <Label htmlFor='diseaseMap'>Disease Map</Label>
                <Select required value={formData.diseaseMap} onValueChange={val => handleSelect(val, 'diseaseMap')}>
                  <SelectTrigger id='diseaseMap'>
                    <SelectValue placeholder='Select disease map' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='PSP'>PSP</SelectItem>
                    <SelectItem value='ALS'>ALS</SelectItem>
                    <SelectItem value='FTD'>FTD</SelectItem>
                    <SelectItem value='OI'>OI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='order'>Order</Label>
                <Select required value={formData.order} onValueChange={val => handleSelect(val, 'order')}>
                  <SelectTrigger id='order'>
                    <SelectValue placeholder='Select order' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='0'>Zero</SelectItem>
                    <SelectItem value='1'>First</SelectItem>
                    <SelectItem value='2'>Second</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='interactionType'>Interaction Type</Label>
                <Select
                  required
                  value={formData.interactionType}
                  onValueChange={val => handleSelect(val, 'interactionType')}
                >
                  <SelectTrigger id='interactionType'>
                    <SelectValue placeholder='Select interaction type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='PPI'>PPI</SelectItem>
                    <SelectItem value='FUN_PPI'>FunPPI</SelectItem>
                    <SelectItem value='BIKG'>BIKG</SelectItem>
                    <SelectItem value='ComPPLete'>ComPPLete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='minScore'>Min interaction score</Label>
                <Select required value={formData.minScore} onValueChange={val => handleSelect(val, 'minScore')}>
                  <SelectTrigger id='minScore'>
                    <SelectValue placeholder='Select min score' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='0.9'>Highest (0.9)</SelectItem>
                    <SelectItem value='0.7'>High (0.7)</SelectItem>
                    <SelectItem value='0.4'>Medium (0.4)</SelectItem>
                    <SelectItem value='0.15'>Low (0.15)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <center>
              <Button type='submit' className='w-3/4 bg-teal-600 hover:bg-teal-700 text-white'>
                {loading && <Loader className='animate-spin mr-2' size={20} />} Submit
              </Button>
            </center>
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
                    <Button disabled={loading} type='button' variant={'secondary'} onClick={() => setTableOpen(false)}>
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </>
  );
}
