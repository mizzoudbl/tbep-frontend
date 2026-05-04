'use client';

import { useLazyQuery } from '@apollo/client/react';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  HistoryIcon,
  InfoIcon,
  LoaderIcon,
  NetworkIcon,
  SearchIcon,
  Settings2Icon,
  UploadIcon,
  XIcon,
} from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
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
  const [verifyGenes, { data, loading }] = useLazyQuery<GeneVerificationData, GeneVerificationVariables>(
    GENE_VERIFICATION_QUERY,
  );
  const [fetchTopGenes, { loading: topGenesLoading }] = useLazyQuery<TopGeneData, TopGeneVariables>(TOP_GENES_QUERY);
  const [diseaseData, setDiseaseData] = React.useState<GetDiseaseData | undefined>(undefined);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [seedInputMode, setSeedInputMode] = React.useState<'type' | 'upload'>('type');
  const [interactionType, setInteractionType] = React.useState<string[]>(['PPI']);
  const [autoFillEnabled, setAutoFillEnabled] = React.useState(true);
  const [autoFillNum, setAutoFillNum] = React.useState(25);

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
    interactionType: ['PPI'],
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

  // Auto-fill seeds on load and when disease changes
  React.useEffect(() => {
    if (autoFillEnabled && formData.diseaseMap) {
      const runAutofill = async () => {
        setAutofillLoading(true);
        try {
          const { data: tg } = await fetchTopGenes({
            variables: {
              diseaseId: formData.diseaseMap,
              page: {
                page: 1,
                limit: autoFillNum,
              },
            },
          });
          if (tg?.topGenesByDisease) {
            const genes: string[] = tg.topGenesByDisease.map((g: { gene_name: string }) => g.gene_name);
            setFormData(f => ({ ...f, seedGenes: genes.join(', ') }));
          }
        } catch {
          // Silently fail on autofill
          console.error('Failed to autofill genes from API');
        } finally {
          setAutofillLoading(false);
        }
      };
      runAutofill();
    }
  }, [autoFillEnabled, formData.diseaseMap, autoFillNum, fetchTopGenes]);

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
          .replace(/^['"]|['"]$/g, '')
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
            .map(gene => gene.trim().toUpperCase())
            .filter(Boolean),
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
      <div className='flex flex-col gap-4 xl:grid xl:grid-cols-2'>
        {/* Left column — tabs + form */}
        <div className='flex flex-col'>
          <Tabs defaultValue='search' className='flex flex-1 flex-col'>
            <TabsList className='grid h-auto w-full grid-cols-1 gap-0 bg-teal-700/10 p-2 sm:grid-cols-2 sm:gap-2'>
              <TabsTrigger
                value='search'
                className='flex min-h-[70px] w-full items-center justify-start gap-3 rounded-lg p-3 text-left
                bg-transparent text-gray-700
                data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm
                transition-all sm:min-h-20 sm:p-4'
              >
                <div className='flex shrink-0 items-center justify-center size-8 rounded-md text-gray-400'>
                  <SearchIcon size={18} />
                </div>
                <div className='flex flex-col items-start'>
                  <span className='font-semibold text-gray-900 text-sm leading-tight sm:text-base'>
                    Search by Multiple Genes
                  </span>
                  <span className='mt-0.5 text-wrap text-gray-500 text-xs leading-tight'>
                    Paste genes/ENSG IDs and verify before building
                  </span>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value='upload'
                className='flex min-h-[70px] w-full items-center justify-start gap-3 rounded-lg p-3 text-left
                bg-transparent text-gray-700
                data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm
                transition-all sm:min-h-20 sm:p-4'
              >
                <div className='flex shrink-0 items-center justify-center size-8 rounded-md text-gray-400'>
                  <NetworkIcon size={18} />
                </div>
                <div className='flex flex-col items-start'>
                  <span className='font-semibold text-gray-900 text-sm leading-tight sm:text-base'>
                    Build Your Own Network
                  </span>
                  <span className='mt-0.5 text-wrap text-gray-500 text-xs leading-tight'>
                    Upload CSV/JSON to create a custom network
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='search' className='mt-4 flex-1'>
              <div className='flex h-full flex-col space-y-4 rounded-lg border border-teal-100 bg-white p-4  sm:space-y-5 sm:p-6 sm:py-4'>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-end justify-between gap-4'>
                    <div className='flex-1 space-y-1'>
                      <div className='flex items-center gap-1'>
                        <Label htmlFor='diseaseMap' className='font-bold text-base text-gray-900'>
                          Disease
                        </Label>
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
                        className='w-full mt-1'
                      />
                    </div>
                    <div className='flex items-center gap-2 pb-1'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='size-8 text-gray-500 hover:text-gray-800'
                            onClick={() => setAdvancedOpen(true)}
                          >
                            <Settings2Icon size={18} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Advanced Settings</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='size-8 text-gray-500 hover:text-gray-800'
                            onClick={() => setHistoryOpen(true)}
                          >
                            <HistoryIcon size={18} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>History</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <AlertDialog open={advancedOpen}>
                  <AlertDialogContent className='max-w-md rounded-2xl p-6'>
                    <AlertDialogHeader>
                      <div className='flex items-start justify-between'>
                        <div>
                          <AlertDialogTitle className='text-xl font-bold text-gray-900'>
                            Advanced Settings
                          </AlertDialogTitle>
                          <AlertDialogDescription className='mt-1 text-sm text-gray-500'>
                            Customize network generation parameters
                          </AlertDialogDescription>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-7 shrink-0 text-gray-400 hover:text-gray-600'
                          onClick={() => setAdvancedOpen(false)}
                        >
                          <XIcon size={16} />
                        </Button>
                      </div>
                    </AlertDialogHeader>
                    <div className='mt-4 space-y-4'>
                      <div className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4'>
                        <div className='flex-1'>
                          <p className='font-semibold text-gray-900 text-sm'>Autofill Seed Genes</p>
                          <p className='mt-0.5 text-gray-500 text-sm'>
                            Automatically populate genes on page load and disease change
                          </p>
                        </div>
                        <Switch checked={autoFillEnabled} onCheckedChange={setAutoFillEnabled} className='ml-4' />
                      </div>
                      {autoFillEnabled && (
                        <div className='flex items-center gap-3 rounded-lg bg-teal-50 p-4'>
                          <Label htmlFor={autoFillNumId} className='text-sm text-gray-700 whitespace-nowrap'>
                            No. of genes
                          </Label>
                          <Input
                            id={autoFillNumId}
                            type='number'
                            inputMode='numeric'
                            min={1}
                            className='h-9 w-24 rounded-lg border-teal-400 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100'
                            placeholder='25'
                            value={autoFillNum}
                            onChange={e => setAutoFillNum(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
                            disabled={autofillLoading || topGenesLoading}
                          />
                        </div>
                      )}
                    </div>

                    <div className='space-y-1'>
                      <Label>Interaction Type</Label>

                      <p className='text-gray-500 text-sm'>
                        Select the interaction dataset to use for network generation
                      </p>

                      <Select value={interactionType[0]} onValueChange={val => setInteractionType([val])}>
                        <SelectTrigger className='mt-2 border border-teal-600 bg-teal-50 hover:bg-teal-600 hover:text-white text-gray-800'>
                          <SelectValue placeholder='Select...' />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value='PPI'>PPI</SelectItem>
                          <SelectItem value='INT_ACT'>INT_ACT</SelectItem>
                          <SelectItem value='BIO_GRID'>BIO_GRID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>

                <div className='flex flex-col gap-3'>
                  <div>
                    <div className='flex items-center gap-1'>
                      <Label className='font-bold text-base text-gray-900'>Seed Genes</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon size={13} className='cursor-pointer text-gray-400 hover:text-gray-600' />
                        </TooltipTrigger>
                        <TooltipContent className='max-w-xs'>
                          Enter the genes you want to build your network around. You can input them one per line or
                          comma-separated.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className='mt-1 text-gray-500 text-sm'>
                      Try examples:{' '}
                      <button
                        type='button'
                        className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-800'
                        onClick={() =>
                          setFormData({ ...formData, seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2' })
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setFormData({ ...formData, seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2' });
                          }
                        }}
                      >
                        #1
                      </button>{' '}
                      <button
                        type='button'
                        className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-800'
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
                      </button>{' '}
                      <button
                        type='button'
                        className='cursor-pointer text-teal-600 underline underline-offset-2 hover:text-teal-800'
                        onClick={() =>
                          setFormData({ ...formData, seedGenes: 'NT5C1B\nNT5C2\nTK2\nDCK\nDGUOK\nNT5C1A' })
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setFormData({ ...formData, seedGenes: 'NT5C1B\nNT5C2\nTK2\nDCK\nDGUOK\nNT5C1A' });
                          }
                        }}
                      >
                        #3
                      </button>
                    </p>
                  </div>

                  <div className='flex w-fit overflow-hidden rounded-lg border border-gray-200 bg-teal-600/10 p-1'>
                    <button
                      type='button'
                      onClick={() => setSeedInputMode('type')}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${seedInputMode === 'type' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Type Genes
                    </button>
                    <button
                      type='button'
                      onClick={() => setSeedInputMode('upload')}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${seedInputMode === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Upload File
                    </button>
                  </div>

                  {seedInputMode === 'type' && (
                    <Textarea
                      id={seedGenesId}
                      placeholder='Type seed genes (comma or newline separated)'
                      className='h-40 resize-none rounded-lg border-gray-200 text-sm'
                      value={formData.seedGenes}
                      onChange={handleFileRead}
                      disabled={autofillLoading}
                      required
                    />
                  )}

                  {seedInputMode === 'upload' && (
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
                            toast.error('Invalid file type', { cancel: { label: 'Close', onClick() {} } });
                            return;
                          }
                          const text = await f.text();
                          setFormData({ ...formData, seedGenes: text });
                          setUploadedFile(f);
                        }}
                        disabled={autofillLoading}
                      />
                      <div
                        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all ${uploadedFile ? 'border-green-300 bg-green-50 hover:bg-green-100' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'}`}
                      >
                        {uploadedFile ? (
                          <div className='flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3'>
                            <CheckCircleIcon className='size-7 text-green-600' />
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
                            <UploadIcon className='mx-auto mb-2 size-9 text-gray-400' />
                            <p className='mb-1 text-gray-600 text-sm'>Browse... No file selected.</p>
                            <p className='text-gray-400 text-xs'>
                              Click to upload or drag and drop your gene list (.txt files only)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
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
                          className='bg-accent-foreground hover:bg-accent mt-2 hover:text-accent-foreground'
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

                <div className='mt-auto flex justify-center pt-2'>
                  <Button
                    type='button'
                    onClick={handleSubmit}
                    className='relative w-full overflow-hidden font-semibold hover:opacity-90'
                  >
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
            <TabsContent value='upload' className='mt-4 flex-1'>
              <div className='flex h-full flex-col rounded-lg border border-teal-100 bg-white p-4 sm:p-6'>
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
                        <a href='/example1.csv' download className='underline hover:text-zinc-700'>
                          #1
                        </a>{' '}
                        <a href='/example2.csv' download className='underline hover:text-zinc-700'>
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

                  {/* File Format Preview — now between the file input and submit */}
                  <div className='rounded-lg border border-teal-100 bg-teal-50/40 p-4'>
                    <h3 className='mb-3 text-center font-semibold text-sm text-teal-700 uppercase tracking-wide'>
                      File Format Preview
                    </h3>
                    <Image
                      src='/image/uploadFormat.svg'
                      width={600}
                      height={300}
                      alt='CSV file format example'
                      className='mx-auto w-full max-w-lg mix-blend-multiply'
                    />
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

          <div className='mt-4 xl:hidden'>
            <Chat />
          </div>
        </div>

        <div className='hidden xl:flex xl:flex-col' style={{ height: 'calc(107vh - 8rem)' }}>
          <div className='sticky top-4 h-full min-h-0'>
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}
