'use client';

import History, { type HistoryItem } from '@/components/History';
import PopUpTable from '@/components/PopUpTable';
import { VirtualizedCombobox } from '@/components/VirtualizedCombobox';
import { Chat } from '@/components/chat';
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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { graphConfig } from '@/lib/data';
import { GENE_VERIFICATION_QUERY } from '@/lib/gql';
import type { GeneVerificationData, GeneVerificationVariables, GetDiseaseData, GraphConfigForm } from '@/lib/interface';
import { distinct, envURL } from '@/lib/utils';
import { useLazyQuery } from '@apollo/client';
import { AlertTriangle, Info, Loader } from 'lucide-react';
import { Link } from 'next-view-transitions';
import React, { type ChangeEvent } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [verifyGenes, { data, loading }] = useLazyQuery<GeneVerificationData, GeneVerificationVariables>(
    GENE_VERIFICATION_QUERY,
  );
  const [diseaseData, setDiseaseData] = React.useState<GetDiseaseData | null>(null);

  React.useEffect(() => {
    (async () => {
      const response = await fetch(`${envURL(process.env.NEXT_PUBLIC_BACKEND_URL)}/diseases`);
      const data = await response.json();
      setDiseaseData(data);
    })();
  }, []);

  const [formData, setFormData] = React.useState<GraphConfigForm>({
    seedGenes: 'MAPT, STX6, EIF2AK3, MOBP, DCTN1, LRRK2',
    diseaseMap: 'amyotrophic lateral sclerosis (ALS)',
    order: '0',
    interactionType: 'PPI',
    minScore: '0.9',
  });
  const [history, setHistory] = React.useState<HistoryItem[]>([]);

  React.useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('history') ?? '[]'));

    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTableOpen(false);
      }
    };
    document.addEventListener('keydown', escapeListener);
    return () => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, []);

  const [tableOpen, setTableOpen] = React.useState(false);
  const [geneIDs, setGeneIDs] = React.useState<string[]>([]);
  const [showAlert, setShowAlert] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { seedGenes } = formData;
    const geneIDs = distinct(seedGenes.split(/[,|\n]/).map(gene => gene.trim().toUpperCase())).filter(Boolean);
    setGeneIDs(geneIDs);
    const { data, error } = await verifyGenes({
      variables: { geneIDs },
    });
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

  const handleSelect = (val: string, key: string) => {
    setFormData({ ...formData, [key]: val });
  };

  const handleFileRead = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type !== 'text/plain') {
      toast.error('Invalid file type', {
        cancel: { label: 'Close', onClick() {} },
      });
      return;
    }
    const text = await file?.text();
    if (text) {
      setFormData({ ...formData, seedGenes: text });
    } else {
      toast.error('Error reading file', {
        cancel: { label: 'Close', onClick() {} },
      });
    }
  };

  const handleSeedGenesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
    const seedGenes = data?.genes.map(gene => gene.ID);
    if (!seedGenes) {
      toast.error('There is no valid gene in the list', {
        cancel: { label: 'Close', onClick() {} },
        description: 'Please enter valid gene names',
      });
      return;
    }
    localStorage.setItem(
      'graphConfig',
      JSON.stringify({
        geneIDs: seedGenes,
        diseaseMap: formData.diseaseMap,
        order: +formData.order,
        interactionType: formData.interactionType,
        minScore: +formData.minScore,
        createdAt: Date.now(),
      }),
    );
    const newHistory = [
      {
        title: `Graph: ${history.length + 1}`,
        geneIDs: seedGenes,
        ...formData,
      },
      ...history,
    ];
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
    setTableOpen(false);
    window.open('/network', '_blank', 'noopener,noreferrer');
  };
  const [showSlowWarning, setShowSlowWarning] = React.useState(false);

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_SITE_URL === 'https://pdnet.saipuram.com') return;
    let timeout: NodeJS.Timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setShowSlowWarning(true);
      }, 15000);
    } else {
      setShowSlowWarning(false);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <>
      {showSlowWarning && (
        <div className='font-semibold absolute top-0 z-10 left-0 right-0 flex justify-center pb-1 bg-teal-600 text-gray-300'>
          If this page slows down, you can try our mirror site{' '}
          <Link className='ml-1 underline hover:text-white' target='_blank' href='https://pdnet.saipuram.com/'>
            here
          </Link>
        </div>
      )}
      <div className='mx-auto rounded-lg shadow-md p-4 min-h-[70vh]'>
        <h2 className='text-2xl font-semibold mb-6'>Search by Multiple Proteins</h2>
        <ResizablePanelGroup direction='horizontal' className='gap-4'>
          <ResizablePanel defaultSize={75} minSize={65}>
            <form onSubmit={handleSubmit}>
              <div className='space-y-4'>
                <div>
                  <div className='flex justify-between'>
                    <Label htmlFor='seedGenes'>Seed Genes</Label>
                    <p className='text-zinc-500'>
                      (one-per-line or CSV; examples: {/* biome-ignore lint/a11y/useKeyWithClickEvents: required */}
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
                    required
                  />
                  <center>OR</center>
                  <Label htmlFor='seedFile'>Upload Text File</Label>
                  <Input
                    id='seedFile'
                    type='file'
                    accept='.txt'
                    className='border-2 hover:border-dashed cursor-pointer h-9'
                    onChange={handleFileRead}
                  />
                </div>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='space-y-1' style={{ marginTop: 5.5 }}>
                    <div className='flex items items-end gap-1'>
                      <Label htmlFor='diseaseMap'>Disease Map</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={12} />
                        </TooltipTrigger>
                        <TooltipContent>To search disease with its ID, type disease ID in parentheses.</TooltipContent>
                      </Tooltip>
                    </div>
                    <VirtualizedCombobox
                      data={diseaseData?.map(val => `${val.name} (${val.ID})`)}
                      value={formData.diseaseMap}
                      onChange={val => typeof val === 'string' && handleSelect(val, 'diseaseMap')}
                      placeholder='Search Disease...'
                      loading={diseaseData === null}
                      className='w-full'
                    />
                  </div>
                  {graphConfig.map(config => (
                    <div key={config.id}>
                      <Label htmlFor={config.id}>{config.name}</Label>
                      <Select required value={formData[config.id]} onValueChange={val => handleSelect(val, config.id)}>
                        <SelectTrigger id={config.id}>
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
                <center>
                  <Button type='submit' className='w-3/4 bg-teal-600 hover:bg-teal-700 text-white'>
                    {loading ? (
                      <>
                        <Loader className='animate-spin mr-2' size={20} />
                        Verifying {geneIDs.length} genes...
                      </>
                    ) : (
                      'Submit'
                    )}
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
                      <AlertTriangle size={24} className='mr-2' />
                      Warning!
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
            </form>
          </ResizablePanel>
          <ResizableHandle withHandle className='hidden md:flex' />
          <ResizablePanel className='h-[60vh] hidden md:block' defaultSize={25} minSize={15}>
            <History history={history} setHistory={setHistory} setFormData={setFormData} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Chat />
    </>
  );
}
