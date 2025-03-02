'use client';

import { algorithms, columnLeidenResults } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import { type EventMessage, Events, downloadFile, eventEmitter } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';
import { ChevronsUpDownIcon, DownloadIcon } from 'lucide-react';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { LeidenPieChart } from '../statistics';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { DataTable } from '../ui/data-table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SliderWithInput from './SliderWithInput';

export function NetworkAnalysis({ children }: { children: React.ReactNode }) {
  const handleAlgoQuery = (name: string, formData?: FormData) => {
    if (formData)
      eventEmitter.emit(Events.ALGORITHM, {
        name,
        parameters: Object.fromEntries(formData.entries()) as EventMessage[Events.ALGORITHM]['parameters'],
      } satisfies EventMessage[Events.ALGORITHM]);
    else {
      eventEmitter.emit(Events.ALGORITHM, { name } satisfies EventMessage[Events.ALGORITHM]);
      setAlgorithmResults(null);
    }
  };
  const [algorithmResults, setAlgorithmResults] = useState<EventMessage[Events.ALGORITHM_RESULTS] | null>(null);

  useEffect(() => {
    eventEmitter.on(Events.ALGORITHM_RESULTS, (data: EventMessage[Events.ALGORITHM_RESULTS]) => {
      setAlgorithmResults(data);
    });
    const escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowTable(false);
      }
    };
    document.addEventListener('keydown', escapeListener);
    return () => {
      document.removeEventListener('keydown', escapeListener);
    };
  }, []);

  const [showTable, setShowTable] = useState(false);

  const handleExport = (communities: EventMessage[Events.ALGORITHM_RESULTS]['communities']) => {
    const projectTitle = useStore.getState().projectTitle;
    const csv = Papa.unparse(
      communities.map(c => ({
        ...c,
        genes: c.genes.join(';'),
        numberOfGenes: c.genes.length,
      })),
    );
    downloadFile(csv, `${projectTitle === 'Untitled' ? '' : `${projectTitle}_`}leiden_communities.csv`);
  };

  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <div className='flex items-center justify-between w-full'>
        <p className='font-bold'>Network Analysis</p>
        <CollapsibleTrigger asChild>
          <Button type='button' variant='outline' size='icon' className='w-6 h-6'>
            <ChevronsUpDownIcon size={15} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='mt-1'>
        <RadioGroup defaultValue='None' className='mb-2'>
          {algorithms.map(({ name, parameters }) => (
            <Popover key={name}>
              <div className='flex items-center space-x-2'>
                <PopoverTrigger asChild>
                  <RadioGroupItem value={name} id={name} onClick={() => name === 'None' && handleAlgoQuery(name)} />
                </PopoverTrigger>
                <Label htmlFor={name} className='text-xs'>
                  {name}
                </Label>
              </div>
              {parameters.length > 0 && (
                <PopoverContent className='w-52'>
                  <form key={name} className='space-y-2 flex flex-col' action={f => handleAlgoQuery(name, f)}>
                    {parameters.map(({ name, displayName, type, defaultValue, min, max, step }) => {
                      if (type === 'slider') {
                        return (
                          <div key={name}>
                            <Label key={name} htmlFor={name} className='font-semibold text-xs'>
                              {displayName}
                            </Label>
                            <SliderWithInput
                              min={min}
                              max={max}
                              step={step}
                              id={name}
                              defaultValue={defaultValue as number}
                            />
                          </div>
                        );
                      }
                      return (
                        <div
                          key={name}
                          style={{ gridTemplateColumns: '1fr 2fr' }}
                          className='grid grid-cols-2 w-full items-center gap-2'
                        >
                          <Label key={name} htmlFor={name} className='font-semibold text-xs'>
                            {displayName}
                          </Label>
                          <Checkbox name={name} id={name} defaultChecked={defaultValue as boolean} />
                        </div>
                      );
                    })}
                    <Button type='submit' size={'sm'} className=''>
                      Apply
                    </Button>
                  </form>
                </PopoverContent>
              )}
            </Popover>
          ))}
        </RadioGroup>
        {algorithmResults && (
          <>
            <hr className='mb-1' />
            <p className='underline font-semibold text-sm'>Results:</p>
            <p>
              <b>Modularity:</b> {algorithmResults.modularity}
            </p>
            <p>
              <b>Resolution:</b> {algorithmResults.resolution}
            </p>
            <div className='flex justify-center my-1'>
              <Button size='sm' variant='outline' onClick={() => setShowTable(true)}>
                Show Details ({algorithmResults.communities.length})
              </Button>
              <Dialog open={showTable}>
                <DialogContent className='max-w-7xl max-h-[90vh] min-h-[60vh] flex flex-col'>
                  <DialogTitle>Leiden Communities</DialogTitle>
                  <Tabs defaultValue='table' className='w-full'>
                    <div className='flex justify-center'>
                      <TabsList className='w-1/2 gap-2'>
                        <TabsTrigger className='w-full' value='table'>
                          Table
                        </TabsTrigger>
                        <TabsTrigger className='w-full' value='chart'>
                          Chart
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value='table' className='flex flex-col max-h-[65vh]'>
                      <div className='overflow-y-scroll'>
                        <DataTable
                          data={algorithmResults.communities.map((c, i) => ({
                            ...c,
                            averageDegree: c.averageDegree.toString(),
                            percentage: c.percentage.toString(),
                            genes: c.genes.join(', '),
                            numberOfGenes: c.genes.length.toString(),
                          }))}
                          columns={columnLeidenResults}
                          filterColumnName={'genes'}
                          placeholder='Search by gene name'
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value='chart' className='flex'>
                      <span>
                        <p>
                          <b>Resolution:</b> {algorithmResults.resolution}
                        </p>
                        <p>
                          <b>Modularity:</b> {algorithmResults.modularity}
                        </p>
                        <p className='text-xs'>*Hover for more information</p>
                      </span>
                      <LeidenPieChart data={algorithmResults.communities} />
                    </TabsContent>
                  </Tabs>
                  <DialogFooter className='gap-2 w-full'>
                    <Button
                      size={'icon'}
                      variant={'outline'}
                      onClick={() => handleExport(algorithmResults.communities)}
                    >
                      <DownloadIcon size={20} />
                    </Button>
                    <DialogClose asChild>
                      <Button type='button' variant={'secondary'} onClick={() => setShowTable(false)}>
                        Close (Esc)
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
        <hr className='mb-1' />
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
