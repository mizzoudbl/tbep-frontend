'use client';

import { useLazyQuery } from '@apollo/client/react';
import { AlertTriangleIcon, CheckCircleIcon, HistoryIcon, InfoIcon, LoaderIcon, UploadIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import React, { type ChangeEvent, useId } from 'react';
import { toast } from 'sonner';
import AnimatedNetworkBackground from '@/components/AnimatedNetworkBackground';
import { Chat } from '@/components/chat';
import { DiseaseMapCombobox } from '@/components/DiseaseMapCombobox';
import History, { type HistoryItem } from '@/components/History';
import PopUpTable from '@/components/PopUpTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { graphConfig } from '@/lib/data';
import { GENE_VERIFICATION_QUERY, TOP_GENES_QUERY } from '@/lib/gql';
import type {
  GeneVerificationData,
  GeneVerificationVariables,
  GetDiseaseData,
  GraphConfigForm,
  TopGeneData,
  TopGeneVariables,
} from '@/lib/interface';
import { distinct, envURL, openDB } from '@/lib/utils';

export default function Explore() {
  // Shared state for Search tab
  const [verifyGenes, { data, loading }] = useLazyQuery<GeneVerificationData, GeneVerificationVariables>(
    GENE_VERIFICATION_QUERY,
  );
  const [fetchTopGenes, { loading: topGenesLoading }] = useLazyQuery<TopGeneData, TopGeneVariables>(TOP_GENES_QUERY);
  const [diseaseData, setDiseaseData] = React.useState<GetDiseaseData | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      const response = await fetch(`${envURL(process.env.NEXT_PUBLIC_BACKEND_URL)}/diseases`);
      const d = await response.json();
      setDiseaseData(d);
    })();
  }, []);

  const [formData, setFormData] = React.useState<GraphConfigForm>({
    seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2',
    diseaseMap: 'MONDO_0004976',
    order: '0',
    interactionType: ['PPI', 'INT_ACT', 'BIO_GRID'],
    minScore: '0.9',
  });
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [tableOpen, setTableOpen] = React.useState(false);
  const [geneIDs, setGeneIDs] = React.useState<string[]>([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [autofillLoading, setAutofillLoading] = React.useState(false);

  React.useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('history') ?? '[]'));
    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTableOpen(false);
      }
    };
    document.addEventListener('keydown', escapeListener);
    return () => document.removeEventListener('keydown', escapeListener);
  }, []);

  const handleAutofill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setAutofillLoading(true);
    try {
      const { data: tg } = await fetchTopGenes({
        variables: {
          diseaseId: formData.diseaseMap,
          page: {
            page: 1,
            limit: Number.parseInt(fd.get('autofill-num') as string, 10),
          },
        },
      });
      if (tg?.topGenesByDisease) {
        const genes: string[] = tg.topGenesByDisease.map((g: { gene_name: string }) => g.gene_name);
        setFormData(f => ({ ...f, seedGenes: genes.join(', ') }));
      }
    } catch {
      toast.error('Failed to autofill genes from API', {
        cancel: { label: 'Close', onClick() {} },
      });
    } finally {
      setAutofillLoading(false);
    }
  };

  const handleSubmit = async () => {
    const { seedGenes, interactionType } = formData;
    if (interactionType.length === 0) {
      toast.error('Please select at least one interaction type', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Interaction type is required to generate the graph',
      });
      return;
    }
    const ids = distinct(
      seedGenes.split(/[,|\n]/).map(gene =>
        gene
          .trim()
          .replace(/^['"]|['"]$/g, '') // remove surrounding single or double quotes
          .toUpperCase(),
      ),
    ).filter(Boolean);
    if (ids.length === 0) {
      toast.error('Please enter valid seed genes', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Seed genes cannot be empty',
      });
      return;
    }
    setGeneIDs(ids);
    const { error } = await verifyGenes({ variables: { geneIDs: ids } });
    if (error) {
      console.error(error);
      toast.error('Error fetching data', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Server not available,Please try again later',
      });
      return;
    }
    setTableOpen(true);
  };

  const handleSelect = (val: string, key: string) => setFormData({ ...formData, [key]: val });

  const handleFileRead = async (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, seedGenes: event.target.value });
  };

  const handleGenerateGraph = (skipWarning = false) => {
    if (!skipWarning) {
      const seedCount = data?.genes.length ?? 0;
      const orderNum = +formData.order;
      const maxGenes = orderNum === 0 ? 5000 : 50;
      const warningThreshold = orderNum === 0 ? 1000 : 25;
      if (seedCount > maxGenes) {
        toast.error('Too many seed genes', {
          description: `Maximum ${maxGenes} genes allowed for ${
            orderNum === 0 ? 'zero' : 'first/second'
          } order networks`,
          cancel: { label: 'Close', onClick() {} },
        });
        return;
      }
      if (seedCount > warningThreshold) {
        setShowAlert(true);
        return;
      }
    }
    const seed = data?.genes.map(gene => gene.ID);
    if (!seed) {
      toast.error('There is no valid gene in the list', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Please enter valid gene names',
      });
      return;
    }
    localStorage.setItem(
      'graphConfig',
      JSON.stringify({
        geneIDs: seed,
        diseaseMap: formData.diseaseMap,
        order: +formData.order,
        interactionType: formData.interactionType,
        minScore: +formData.minScore,
        createdAt: Date.now(),
      }),
    );
    const newHistory = [{ title: `Graph: ${history.length + 1}`, geneIDs: seed, ...formData }, ...history];
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
    setTableOpen(false);
    window.open('/network', '_blank', 'noopener,noreferrer');
  };

  // Upload tab state & handlers
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadTableOpen, setUploadTableOpen] = React.useState(false);
  const [uploadGeneIDs, setUploadGeneIDs] = React.useState<string[]>([]);
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!ext || !['csv', 'json'].includes(ext)) {
      toast.error('Invalid file type', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Please upload a CSV or JSON file',
      });
      e.currentTarget.value = '';
      return;
    }
    setFile(f);
  };

  const handleUploadSubmit = async () => {
    if (!file) {
      toast.error('Please upload a file', {
        cancel: { label: 'Close', onClick() {} },
      });
      return;
    }
    setUploadLoading(true);
    try {
      let distinctSeedGenes: string[] = [];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'json') {
        const jsonData = JSON.parse(await file.text());
        distinctSeedGenes = distinct(
          jsonData
            .flatMap(
              (gene: Record<string, string | number>) =>
                Object.values(gene).filter(val => Number.isNaN(Number(val))) as string[],
            )
            .map((gene: string) => gene.trim().toUpperCase()),
        );
      } else if (ext === 'csv') {
        const csvText = await file.text();
        distinctSeedGenes = distinct(
          csvText
            .split('\n')
            .slice(1)
            .flatMap(line => line.split(',').slice(0, 2))
            .map(gene => gene.trim().toUpperCase()),
        );
      } else {
        toast.error('Unsupported file type', {
          cancel: { label: 'Close', onClick() {} },
          description: 'Only CSV and JSON files are supported',
        });
        return;
      }
      if (distinctSeedGenes.length < 2) {
        toast.error('Please provide at least 2 valid genes', {
          cancel: { label: 'Close', onClick() {} },
          description: 'Seed genes should be either ENSG IDs or gene names',
        });
        return;
      }
      const { error } = await verifyGenes({
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
      setUploadGeneIDs(distinctSeedGenes);
      setUploadTableOpen(true);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUploadGenerateGraph = async () => {
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

  const autoFillNumId = useId();
  const seedGenesId = useId();
  const uploadFileId = useId();
  const seedFileId = useId();

  return (
    <div className='relative mx-auto min-h-[60vh] max-w-7xl'>
      <Tabs defaultValue='search'>
        <TabsList className='grid h-auto w-full grid-cols-1 gap-2 border border-teal-100 bg-white p-2 shadow-xs sm:grid-cols-2 sm:gap-0 sm:p-0'>
          <TabsTrigger
            value='search'
            className='min-h-[70px] w-full justify-start rounded-md p-3 text-left text-teal-900 data-[state=active]:bg-secondary data-[state=active]:text-white sm:min-h-[80px] sm:p-4'
          >
            <div className='flex w-full flex-col items-start'>
              <span className='bg-linear-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text font-semibold text-sm text-transparent leading-tight sm:text-base lg:text-lg'>
                Search by Multiple Genes
              </span>
              <span className='mt-1 text-wrap text-slate-600 text-xs leading-tight md:text-sm'>
                Paste genes/ENSG IDs and verify before building a network
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value='upload'
            className='min-h-[70px] w-full justify-start rounded-md p-3 text-left text-teal-900 data-[state=active]:bg-secondary data-[state=active]:text-white sm:min-h-[80px] sm:p-4'
          >
            <div className='flex w-full flex-col items-start'>
              <span className='bg-linear-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text font-semibold text-sm text-transparent leading-tight sm:text-base lg:text-lg'>
                Build your own Network (ByoN)
              </span>
              <span className='mt-1 text-wrap text-slate-600 text-xs leading-tight md:text-sm'>
                Upload CSV/JSON to create a custom interaction network
              </span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='search' className='mt-4'>
          <div className='space-y-4 rounded-lg border border-teal-100 bg-white p-4 shadow-xs sm:space-y-5 sm:p-6 sm:py-4'>
            <div className='flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between'>
              <div className='w-1/2 space-y-1'>
                <div className='flex items-end gap-1'>
                  <Label htmlFor='diseaseMap'>Disease</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon size={12} />
                    </TooltipTrigger>
                    <TooltipContent>
                      Contains the disease name to be mapped taken from OpenTargets Portal. <br />
                      <b>Note:</b> To search disease using its ID, type disease ID in parentheses.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <DiseaseMapCombobox
                  data={diseaseData}
                  value={formData.diseaseMap}
                  onChange={val => typeof val === 'string' && handleSelect(val, 'diseaseMap')}
                  className='w-full'
                />
              </div>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end xl:flex-row xl:items-center'>
                <div className='mr-4 flex flex-col gap-3 sm:flex-row sm:items-center'>
                  <div className='flex items-center gap-2'>
                    <Label className='whitespace-nowrap text-sm'>Autofill Seed Genes</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon size={12} />
                      </TooltipTrigger>
                      <TooltipContent className='max-w-xs'>
                        <div>
                          <div>
                            <b>Autofill</b> the seed genes box with the top <b>n</b> genes for the selected disease.
                          </div>
                          <div>Genes are ranked by overall association score from the OpenTargets platform.</div>
                          <div>
                            <b>Note:</b> Autofill uses only one type of gene identifier as returned by the API.
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <form onSubmit={handleAutofill} className='flex items-center gap-2'>
                    <Label htmlFor={autoFillNumId} className='text-sm'>
                      No. of genes
                    </Label>
                    <Input
                      id={autoFillNumId}
                      type='number'
                      inputMode='numeric'
                      required
                      name='autofill-num'
                      min={1}
                      className='h-8 w-16 sm:w-20'
                      placeholder='25'
                      defaultValue={25}
                      disabled={autofillLoading || topGenesLoading}
                    />
                    <Button
                      type='submit'
                      disabled={autofillLoading || topGenesLoading}
                      className='h-8 px-2 text-xs sm:px-3 sm:text-sm'
                    >
                      {autofillLoading || topGenesLoading ? (
                        <>
                          <LoaderIcon className='mr-1 animate-spin' size={14} />
                          <span className='hidden sm:inline'>Auto-filling...</span>
                          <span className='sm:hidden'>Loading...</span>
                        </>
                      ) : (
                        'Autofill'
                      )}
                    </Button>
                  </form>
                </div>

                <Button variant='outline' size='sm' className='h-8 px-3 text-sm' onClick={() => setHistoryOpen(true)}>
                  <HistoryIcon size={16} className='mr-1' />
                  History
                </Button>
              </div>
            </div>
            <div className='flex flex-col lg:flex-row'>
              <div className='flex-1'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                  <Label htmlFor={seedGenesId} className='font-medium'>
                    Seed Genes
                  </Label>
                  <p className='text-xs text-zinc-500 sm:text-sm'>
                    (one-per-line or CSV; examples:
                    <button
                      type='button'
                      className='ml-1 cursor-pointer underline hover:text-zinc-700'
                      onClick={() =>
                        setFormData({
                          ...formData,
                          seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2',
                        })
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2',
                          });
                        }
                      }}
                    >
                      #1
                    </button>
                    <button
                      type='button'
                      className='ml-2 cursor-pointer underline hover:text-zinc-700'
                      onClick={() =>
                        setFormData({
                          ...formData,
                          seedGenes:
                            'ENSG00000185013\nENSG00000076685\nENSG00000166548\nENSG00000156136\nENSG00000114956\nENSG00000116981',
                        })
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            seedGenes:
                              'ENSG00000185013\nENSG00000076685\nENSG00000166548\nENSG00000156136\nENSG00000114956\nENSG00000116981',
                          });
                        }
                      }}
                    >
                      #2
                    </button>
                    <button
                      type='button'
                      className='ml-2 cursor-pointer underline hover:text-zinc-700'
                      onClick={() =>
                        setFormData({
                          ...formData,
                          seedGenes: 'NT5C1B\nNT5C2\nTK2\nDCK\nDGUOK\nNT5C1A',
                        })
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            seedGenes: 'NT5C1B\nNT5C2\nTK2\nDCK\nDGUOK\nNT5C1A',
                          });
                        }
                      }}
                    >
                      #3
                    </button>
                    )
                  </p>
                </div>
                <Textarea
                  id={seedGenesId}
                  placeholder='Type seed genes (comma or newline separated)'
                  className='mt-2 h-33'
                  value={formData.seedGenes}
                  onChange={handleFileRead}
                  disabled={autofillLoading}
                  required
                />
              </div>

              <div className='flex flex-row items-center justify-center py-2 lg:flex-col lg:px-4'>
                <div className='h-px w-full bg-slate-800/70 lg:hidden' />
                <div className='hidden w-px flex-1 bg-slate-800/70 lg:block' />
                <span className='px-2 py-1 text-slate-400 text-xs lg:py-2'>OR</span>
                <div className='h-px w-full bg-slate-800/70 lg:hidden' />
                <div className='hidden w-px flex-1 bg-slate-800/70 lg:block' />
              </div>

              <div className='flex-1'>
                <Label htmlFor={seedFileId} className='mb-3 block font-medium text-sm text-teal-900'>
                  Upload Text File
                </Label>
                <div className='relative'>
                  <Input
                    id={seedFileId}
                    type='file'
                    accept='.txt'
                    className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
                    onChange={async e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f?.type !== 'text/plain') {
                        toast.error('Invalid file type', {
                          cancel: { label: 'Close', onClick() {} },
                        });
                        return;
                      }
                      const text = await f.text();
                      setFormData({ ...formData, seedGenes: text });
                      setUploadedFile(f);
                    }}
                    disabled={autofillLoading}
                  />
                  <div
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-3 text-center transition-all sm:p-4 ${
                      uploadedFile
                        ? 'border-green-300 bg-green-50 hover:bg-green-100'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {uploadedFile ? (
                      <div className='flex flex-col items-center justify-center gap-2 p-4 sm:flex-row sm:gap-3 sm:p-6'>
                        <CheckCircleIcon className='size-6 text-green-600 sm:size-8' />
                        <div className='text-center sm:text-left'>
                          <p className='font-medium text-green-800 text-sm'>{uploadedFile.name}</p>
                          <p className='text-green-600 text-xs'>File uploaded successfully</p>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='z-10 text-green-600 hover:bg-green-200 hover:text-green-800'
                          onClick={e => {
                            e.stopPropagation();
                            setUploadedFile(null);
                          }}
                        >
                          <XIcon className='size-4' />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <UploadIcon className='mx-auto mb-2 size-8 text-gray-400 sm:mb-3 sm:size-10' />
                        <p className='mb-1 text-gray-600 text-sm'>Browse... No file selected.</p>
                        <p className='text-gray-400 text-xs'>
                          Click to upload or drag and drop your gene list (.txt files only)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {graphConfig.map(config => (
                <div key={config.id} className='space-y-1'>
                  <div className='flex items-end gap-1'>
                    <Label htmlFor={config.id}>{config.name}</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon size={12} />
                      </TooltipTrigger>
                      <TooltipContent>{config.tooltipContent}</TooltipContent>
                    </Tooltip>
                  </div>
                  <Select required value={formData[config.id]} onValueChange={val => handleSelect(val, config.id)}>
                    <SelectTrigger
                      className='bg-accent-foreground hover:bg-accent hover:text-accent-foreground'
                      id={config.id}
                    >
                      <SelectValue placeholder='Select...' />
                    </SelectTrigger>
                    <SelectContent>
                      {config.options.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div className='flex justify-center'>
              <Button
                type='button'
                onClick={handleSubmit}
                className='relative w-full overflow-hidden font-semibold hover:opacity-90 sm:w-3/4 lg:w-1/2'
              >
                {/* Animated background inside the button */}
                <AnimatedNetworkBackground
                  className='pointer-events-none absolute inset-0 h-full w-full opacity-40'
                  moving={loading}
                  speedMultiplier={10}
                />
                <span className='relative z-10 flex items-center justify-center'>
                  {loading ? (
                    <>
                      <LoaderIcon className='mr-2 animate-spin' size={20} />
                      <span className='hidden sm:inline'>Checking {geneIDs.length} Genes...</span>
                      <span className='sm:hidden'>Checking Genes...</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </span>
              </Button>
            </div>
            <PopUpTable
              setTableOpen={setTableOpen}
              tableOpen={tableOpen}
              handleGenerateGraph={handleGenerateGraph}
              data={data}
              geneIDs={geneIDs}
            />
          </div>
          <AlertDialog open={showAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className='flex items-center text-red-500'>
                  <AlertTriangleIcon size={24} className='mr-2' /> Warning!
                </AlertDialogTitle>
                <AlertDialogDescription className='text-black'>
                  You are about to generate a graph with a large number of nodes/edges. This may take a long time to
                  complete.
                </AlertDialogDescription>
                <p className='font-semibold text-black'>Are you sure you want to proceed?</p>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowAlert(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setShowAlert(false);
                    handleGenerateGraph(true);
                    document.body.removeAttribute('style');
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <History
            history={history}
            historyOpen={historyOpen}
            setHistoryOpen={setHistoryOpen}
            setHistory={setHistory}
            setFormData={setFormData}
          />
        </TabsContent>
        <TabsContent value='upload' className='mt-4'>
          <div className='mx-auto rounded-lg border border-teal-100 bg-white p-4 shadow-md sm:p-6'>
            <div className='grid grid-cols-1 items-start gap-6 xl:grid-cols-2'>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  void handleUploadSubmit();
                }}
                className='space-y-4'
              >
                <div>
                  <div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <Label htmlFor={uploadFileId} className='font-medium'>
                      Upload CSV or JSON
                    </Label>
                    <p className='text-sm text-zinc-500'>
                      (CSV examples:{' '}
                      <a href={'/example1.csv'} download className='underline hover:text-zinc-700'>
                        #1
                      </a>{' '}
                      <a href={'/example2.csv'} download className='underline hover:text-zinc-700'>
                        #2
                      </a>
                      )
                    </p>
                  </div>
                  <Input
                    id={uploadFileId}
                    type='file'
                    accept='.csv,.json'
                    onChange={handleFileChange}
                    required
                    className='h-12 cursor-pointer border-2 border-dashed transition-colors hover:border-gray-400'
                  />
                  <p className='mt-2 text-xs text-zinc-500 leading-relaxed'>
                    • CSV: first two columns are ENSG IDs or Gene names; third column is interaction score.
                    <br />• JSON: array of records; non-numeric string values are treated as gene identifiers.
                  </p>
                </div>
                <Button
                  type='submit'
                  className='relative w-full overflow-hidden bg-teal-600 text-white hover:bg-teal-700'
                >
                  <AnimatedNetworkBackground
                    className='pointer-events-none absolute inset-0 h-full w-full opacity-35'
                    moving={uploadLoading}
                    speedMultiplier={2.2}
                  />
                  <span className='relative z-10 flex items-center justify-center'>
                    {uploadLoading && <LoaderIcon className='mr-2 animate-spin' size={20} />} Submit
                  </span>
                </Button>
              </form>
              <div className='border-t pt-4 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6'>
                <h3 className='mb-3 font-semibold text-lg'>File Format Preview</h3>
                <Image
                  src={'/image/uploadFormat.svg'}
                  width={400}
                  height={400}
                  alt='CSV file format example'
                  className='mx-auto w-full max-w-md mix-blend-multiply xl:max-w-full'
                />
              </div>
            </div>
            <PopUpTable
              geneIDs={uploadGeneIDs}
              tableOpen={uploadTableOpen}
              setTableOpen={setUploadTableOpen}
              data={data}
              handleGenerateGraph={handleUploadGenerateGraph}
            />
          </div>
        </TabsContent>
      </Tabs>
      <Chat />
    </div>
  );
}
