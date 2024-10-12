'use client';

import PopUpTable from '@/components/PopUpTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { diseaseMap } from '@/lib/data';
import { interactionType } from '@/lib/data/interactionType';
import { GENE_VERIFICATION_QUERY } from '@/lib/gql';
import type { GeneVerificationData, GeneVerificationVariables } from '@/lib/interface';
import { distinct } from '@/lib/utils';
import { useLazyQuery } from '@apollo/client';
import { Loader } from 'lucide-react';
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
    const geneIDs = distinct(seedGenes.split(/[,|\n]/).map(gene => gene.trim()));
    if (geneIDs.length < 2)
      toast.error('Please enter at least 2 genes', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
      });
    else {
      setGeneIDs(geneIDs);
      await fetchData({ variables: { geneIDs } });
      if (error) {
        console.error(error);
        toast.error('Error fetching data', {
          cancel: { label: 'Close', onClick() {} },
          position: 'top-center',
          richColors: true,
          description: 'Server not available,Please try again later',
        });
        return;
      }
      setTableOpen(true);
    }
  };

  const handleSelect = (val: string, key: string) => {
    setFormData({ ...formData, [key]: val });
  };

  const handleFileRead = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type !== 'text/plain') {
      toast.error('Invalid file type', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
      });
      return;
    }
    const text = await file?.text();
    if (text) {
      setFormData({ ...formData, seedGenes: text });
    } else {
      toast.error('Error reading file', {
        cancel: { label: 'Close', onClick() {} },
        position: 'top-center',
        richColors: true,
      });
    }
  };

  const handleSeedGenesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, seedGenes: event.target.value });
  };

  const handleGenerateGraph = () => {
    localStorage.setItem(
      'graphConfig',
      JSON.stringify({
        geneIDs: data?.getGenes.map(gene => gene.ID),
        diseaseMap: formData.diseaseMap,
        order: formData.order,
        interactionType: formData.interactionType,
        minScore: formData.minScore,
      }),
    );
    window.open('/network', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className='mx-auto rounded-lg shadow-md p-4 min-h-[70vh]'>
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
                accept='.txt'
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
                    {diseaseMap.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
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
                    {interactionType.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
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
            <PopUpTable
              setTableOpen={setTableOpen}
              tableOpen={tableOpen}
              handleGenerateGraph={handleGenerateGraph}
              data={data}
              geneIDs={geneIDs}
            />
          </div>
        </form>
      </div>
    </>
  );
}
