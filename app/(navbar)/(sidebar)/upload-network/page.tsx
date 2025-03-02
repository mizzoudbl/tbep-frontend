'use client';
import PopUpTable from '@/components/PopUpTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GENE_VERIFICATION_QUERY } from '@/lib/gql';
import type { GeneVerificationData, GeneVerificationVariables } from '@/lib/interface';
import { distinct, openDB } from '@/lib/utils';
import { useLazyQuery } from '@apollo/client';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';

export default function UploadFile() {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileType, setFileType] = React.useState<'csv' | 'json'>('csv');
  const [fetchData, { data, loading }] = useLazyQuery<GeneVerificationData, GeneVerificationVariables>(
    GENE_VERIFICATION_QUERY,
  );
  const [tableOpen, setTableOpen] = React.useState(false);
  const [geneIDs, setGeneIDs] = React.useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file?.name.split('.').pop() !== fileType) {
      toast.error('Invalid file type', {
        cancel: { label: 'Close', onClick() {} },
        description: `Please upload a ${fileType.toUpperCase()} file`,
      });
      return;
    }
    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please upload a file', {
        cancel: { label: 'Close', onClick() {} },
      });
      return;
    }
    let distinctSeedGenes: string[];
    if (fileType === 'json') {
      const data = JSON.parse(await file.text());
      distinctSeedGenes = distinct(
        data.flatMap((gene: Record<string, string | number>) => {
          return Object.values(gene).filter(val => Number.isNaN(Number(val)));
        }),
      );
    } else {
      const data = await file.text();
      distinctSeedGenes = distinct(
        data
          .split('\n')
          .slice(1)
          .flatMap(line => line.split(',').slice(0, 2)),
      );
    }
    if (distinctSeedGenes.length < 2) {
      toast.error('Please provide at least 2 valid genes', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Seed genes should be either ENSG IDs or gene names',
      });
      return;
    }
    const { error } = await fetchData({
      variables: { geneIDs: distinctSeedGenes },
    });
    if (error) {
      console.error(error);
      toast.error('Error fetching data', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Server not available,Please try again later',
      });
      return;
    }
    setGeneIDs(distinctSeedGenes);
    setTableOpen(true);
  };

  const handleGenerateGraph = async () => {
    const store = await openDB('network', 'readwrite');
    if (!store) {
      toast.error('Failed to open IndexedDB database', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Please make sure you have enabled IndexedDB in your browser',
      });
      return;
    }
    store.put(file, file?.name);
    toast.success('File uploaded successfully', {
      cancel: { label: 'Close', onClick() {} },
    });
    window.open(`/network?file=${encodeURIComponent(file?.name as string)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='mx-auto rounded-lg shadow-md p-4'>
      <h2 className='text-2xl font-semibold mb-6'>Upload your Network</h2>
      <form action={handleSubmit}>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='fileType'>Select File Type</Label>
            <Select value={fileType} onValueChange={val => setFileType(val as 'csv' | 'json')}>
              <SelectTrigger id='fileType'>
                <SelectValue placeholder='Select file type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='csv'>CSV</SelectItem>
                <SelectItem value='json'>JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className='flex justify-between items-center'>
              <Label htmlFor='fileUpload'>Upload {fileType.toUpperCase()}</Label>
              <p className='text-zinc-500'>
                (1st & 2nd columns need to be ENSG IDs or Gene name,
                <br />
                while 3rd column should be interaction score; examples:{' '}
                <a href={'/example1.csv'} download className='underline'>
                  #1
                </a>{' '}
                <a href={'/example2.csv'} download className='underline'>
                  #2
                </a>
                )
              </p>
            </div>
            <Input
              id='fileUpload'
              type='file'
              accept='.csv,.json'
              onChange={handleFileChange}
              required
              className='border-2 hover:border-dashed cursor-pointer h-9'
            />
          </div>
          <Button type='submit' className='w-full bg-teal-600 hover:bg-teal-700 text-white'>
            {loading && <LoaderIcon className='animate-spin mr-2' size={20} />} Submit
          </Button>
        </div>
      </form>
      <PopUpTable
        geneIDs={geneIDs}
        tableOpen={tableOpen}
        setTableOpen={setTableOpen}
        data={data}
        handleGenerateGraph={handleGenerateGraph}
      />
      <div className='mt-10'>
        <h3 className='text-lg font-semibold mb-2'>File Format</h3>
        <Image
          src={'/image/uploadFormat.png'}
          width={400}
          height={400}
          alt='CSV file format example'
          className='w-full max-w-3xl mx-auto mix-blend-multiply'
        />
      </div>
    </div>
  );
}
