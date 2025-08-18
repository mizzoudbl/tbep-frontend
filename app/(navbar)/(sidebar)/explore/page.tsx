'use client';

import { useLazyQuery } from '@apollo/client';
import { AlertTriangleIcon, HistoryIcon, InfoIcon, LoaderIcon } from 'lucide-react';
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
import { MultiSelect } from '@/components/ui/multiselect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
    interactionType: ['PPI'],
    minScore: '0.9',
  });
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [tableOpen, setTableOpen] = React.useState(false);
  const [geneIDs, setGeneIDs] = React.useState<string[]>([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [autofill, setAutofill] = React.useState(false);
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
    if (!autofill) return;
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
      toast.error('Failed to autofill genes from API', { cancel: { label: 'Close', onClick() {} } });
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
  const handleMultiSelect = (vals: string[], key: string) => setFormData({ ...formData, [key]: vals });

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
          description: `Maximum ${maxGenes} genes allowed for ${orderNum === 0 ? 'zero' : 'first/second'} order networks`,
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
      toast.error('Please upload a file', { cancel: { label: 'Close', onClick() {} } });
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
      const { error } = await verifyGenes({ variables: { geneIDs: distinctSeedGenes } });
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
    toast.success('File uploaded successfully', { cancel: { label: 'Close', onClick() {} } });
    window.open(`/network?file=${encodeURIComponent(file?.name as string)}`, '_blank', 'noopener,noreferrer');
  };

  const autoFillToggleId = useId();
  const autoFillNumId = useId();
  const seedGenesId = useId();
  const uploadFileId = useId();
  const seedFileId = useId();

  return (
    <div className='relative mx-auto max-w-7xl min-h-[60vh]'>
      <Tabs defaultValue='search'>
        <TabsList className='w-full h-auto grid grid-cols-1 sm:grid-cols-2 bg-white border border-teal-100 shadow-sm gap-2 sm:gap-0 p-2 sm:p-0'>
          <TabsTrigger
            value='search'
            className='w-full justify-start text-left p-3 sm:p-4 rounded-md text-teal-900 data-[state=active]:bg-secondary data-[state=active]:text-white min-h-[70px] sm:min-h-[80px]'
          >
            <div className='flex flex-col items-start w-full'>
              <span className='text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight'>
                Search by Multiple Genes
              </span>
              <span className='text-xs text-wrap md:text-sm text-slate-600 mt-1 leading-tight'>
                Paste genes/ENSG IDs and verify before building a network
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value='upload'
            className='w-full justify-start text-left p-3 sm:p-4 rounded-md text-teal-900 data-[state=active]:bg-secondary data-[state=active]:text-white min-h-[70px] sm:min-h-[80px]'
          >
            <div className='flex flex-col items-start w-full'>
              <span className='text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight'>
                Build your own Network (ByoN)
              </span>
              <span className='text-xs md:text-sm text-wrap text-slate-600 mt-1 leading-tight'>
                Upload CSV/JSON to create a custom interaction network
              </span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='search' className='mt-4'>
          <div className='space-y-5 rounded-lg border border-teal-100 bg-white p-4 sm:p-6 shadow-sm'>
            <div className='flex justify-between'>
              <div className='flex flex-col h-2 sm:flex-row sm:items-center'>
                <div className='flex items-center gap-2'>
                  <Switch checked={autofill} onCheckedChange={setAutofill} id={autoFillToggleId} />
                  <Label htmlFor={autoFillToggleId} className='whitespace-nowrap'>
                    Autofill Seed Genes
                  </Label>
                  <span className='flex items-center'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon size={12} />
                      </TooltipTrigger>
                      <TooltipContent className='max-w-s'>
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
                  </span>
                </div>
                {autofill && (
                  <form onSubmit={handleAutofill} className='flex items-center gap-2 sm:ml-4'>
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
                      className='w-20 h-8'
                      placeholder='e.g. 25'
                      defaultValue={25}
                      disabled={autofillLoading || topGenesLoading}
                    />
                    <Button type='submit' disabled={autofillLoading || topGenesLoading} className='h-8 text-sm px-3'>
                      {autofillLoading || topGenesLoading ? (
                        <>
                          <LoaderIcon className='animate-spin mr-1' size={14} /> Auto-filling...
                        </>
                      ) : (
                        'Autofill'
                      )}
                    </Button>
                  </form>
                )}
              </div>
              <Button variant='outline' size='sm' className='h-8 text-sm px-3' onClick={() => setHistoryOpen(true)}>
                <HistoryIcon size={16} className='mr-1' />
                History
              </Button>
            </div>
            <div>
              <div className='flex justify-between'>
                <Label htmlFor={seedGenesId}>Seed Genes</Label>
                <p className='text-zinc-500'>
                  (one-per-line or CSV; examples:
                  <button
                    type='button'
                    className='underline cursor-pointer ml-1'
                    onClick={() => setFormData({ ...formData, seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2' })}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFormData({ ...formData, seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2' });
                      }
                    }}
                  >
                    #1
                  </button>
                  <button
                    type='button'
                    className='underline cursor-pointer ml-2'
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
                    className='underline cursor-pointer ml-2'
                    onClick={() => setFormData({ ...formData, seedGenes: 'NT5C1B\nNT5C2\nTK2\nDCK\nDGUOK\nNT5C1A' })}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setFormData({ ...formData, seedGenes: 'NT5C1B\nNT5C2\nTK2\nDCK\nDGUOK\nNT5C1A' });
                      }
                    }}
                  >
                    #3
                  </button>
                  )
                </p>
              </div>
              <Textarea
                rows={3}
                id={seedGenesId}
                placeholder='Type seed genes (comma or newline separated)'
                className='mt-2'
                value={formData.seedGenes}
                onChange={handleFileRead}
                disabled={autofillLoading}
                required
              />
              <div className='flex items-center gap-3 py-1'>
                <div className='h-px flex-1 bg-slate-800/70' />
                <span className='text-slate-400 text-xs'>OR</span>
                <div className='h-px flex-1 bg-slate-800/70' />
              </div>
              <Label htmlFor={seedFileId} className='text-teal-900'>
                Upload Text File
              </Label>
              <Input
                id={seedFileId}
                type='file'
                accept='.txt'
                className='h-10 cursor-pointer'
                onChange={async e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f?.type !== 'text/plain') {
                    toast.error('Invalid file type', { cancel: { label: 'Close', onClick() {} } });
                    return;
                  }
                  const text = await f.text();
                  setFormData({ ...formData, seedGenes: text });
                }}
                disabled={autofillLoading}
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='space-y-1'>
                <div className='flex items-end gap-1'>
                  <Label htmlFor='diseaseMap'>Disease Map</Label>
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
                  {config.id === 'interactionType' ? (
                    <MultiSelect
                      options={[...config.options]}
                      selectedValues={formData[config.id] || []}
                      onChange={values => handleMultiSelect(values, config.id)}
                      placeholder='Select...'
                    />
                  ) : (
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
                  )}
                </div>
              ))}
            </div>
            <center>
              <Button
                type='button'
                onClick={handleSubmit}
                className='relative overflow-hidden w-3/4 font-semibold hover:opacity-90'
              >
                {/* Animated background inside the button */}
                <AnimatedNetworkBackground
                  className='absolute inset-0 w-full h-full pointer-events-none opacity-40'
                  moving={loading}
                  speedMultiplier={10}
                />
                <span className='relative z-10 flex items-center justify-center'>
                  {loading ? (
                    <>
                      <LoaderIcon className='animate-spin mr-2' size={20} /> Checking {geneIDs.length} Genes...
                    </>
                  ) : (
                    'Submit'
                  )}
                </span>
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
          <AlertDialog open={showAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className='text-red-500 flex items-center'>
                  <AlertTriangleIcon size={24} className='mr-2' /> Warning!
                </AlertDialogTitle>
                <AlertDialogDescription className='text-black'>
                  You are about to generate a graph with a large number of nodes/edges. This may take a long time to
                  complete.
                </AlertDialogDescription>
                <p className='text-black font-semibold'>Are you sure you want to proceed?</p>
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
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetContent side='right' className='w-[380px] sm:w-[420px]'>
              <SheetHeader>
                <SheetTitle>History</SheetTitle>
              </SheetHeader>
              <div className='mt-4'>
                <History
                  history={history}
                  setHistoryOpen={setHistoryOpen}
                  setHistory={setHistory}
                  setFormData={setFormData}
                />
              </div>
            </SheetContent>
          </Sheet>
        </TabsContent>
        <TabsContent value='upload' className='mt-4'>
          <div className='mx-auto rounded-lg shadow-md p-4 border border-teal-100 bg-white'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 items-start'>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  void handleUploadSubmit();
                }}
                className='space-y-4'
              >
                <div>
                  <div className='flex justify-between items-center mb-2'>
                    <Label htmlFor={uploadFileId}>Upload CSV or JSON</Label>
                    <p className='text-zinc-500 text-sm'>
                      (CSV examples:{' '}
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
                    id={uploadFileId}
                    type='file'
                    accept='.csv,.json'
                    onChange={handleFileChange}
                    required
                    className='border-2 border-dashed cursor-pointer h-12'
                  />
                  <p className='text-xs text-zinc-500 mt-2'>
                    • CSV: first two columns are ENSG IDs or Gene names; third column is interaction score.
                    <br />• JSON: array of records; non-numeric string values are treated as gene identifiers.
                  </p>
                </div>
                <Button
                  type='submit'
                  className='relative overflow-hidden w-full bg-teal-600 hover:bg-teal-700 text-white'
                >
                  <AnimatedNetworkBackground
                    className='absolute inset-0 w-full h-full pointer-events-none opacity-35'
                    moving={uploadLoading}
                    speedMultiplier={2.2}
                  />
                  <span className='relative z-10 flex items-center justify-center'>
                    {uploadLoading && <LoaderIcon className='animate-spin mr-2' size={20} />} Submit
                  </span>
                </Button>
              </form>
              <div className='mt-2 lg:mt-0 border-l-2 pl-4'>
                <h3 className='text-lg font-semibold mb-3'>File Format Preview</h3>
                <Image
                  src={'/image/uploadFormat.svg'}
                  width={400}
                  height={400}
                  alt='CSV file format example'
                  className='w-full max-w-3xl mx-auto mix-blend-multiply'
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
