import type { CheckedState } from '@radix-ui/react-checkbox';
import { ExternalLinkIcon, EyeIcon, Trash2Icon } from 'lucide-react';
import React, { useId } from 'react';
import type { GraphConfigForm } from '@/lib/interface';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

export type HistoryItem = GraphConfigForm & {
  title: string;
  geneIDs: string[];
  createdAt?: number;
};

export default function History({
  history,
  historyOpen = false,
  setHistory,
  setFormData,
  setHistoryOpen,
}: {
  history: HistoryItem[];
  historyOpen?: boolean;
  setHistory: (history: HistoryItem[]) => void;
  setFormData: (graphConfig: GraphConfigForm) => void;
  setHistoryOpen: (open: boolean) => void;
}) {
  const handleGenerateGraph = (index: number) => {
    const configFromHistory = history[index];
    localStorage.setItem(
      'graphConfig',
      JSON.stringify({
        geneIDs: configFromHistory.geneIDs,
        diseaseMap: configFromHistory.diseaseMap,
        order: +configFromHistory.order,
        interactionType: configFromHistory.interactionType,
        minScore: +configFromHistory.minScore,
      }),
    );
    window.open('/network', '_blank', 'noopener,noreferrer');
  };

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const handleConfirmDialogChange = (checked: CheckedState) => {
    sessionStorage.setItem('showConfirmDialog', JSON.stringify(!checked));
  };

  const removeHistory = (title?: string) => {
    if (title) {
      const newHistory = history.filter(item => item.title !== title);
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));
    } else {
      setHistory([]);
      localStorage.removeItem('history');
      setShowConfirmDialog(false);
    }
  };

  const doNotShowAgainId = useId();

  return (
    <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
      <SheetContent side='right' className='flex flex-col'>
        <SheetHeader className='flex flex-row justify-between'>
          <SheetTitle className='font-semibold text-2xl'>History</SheetTitle>
          {(history.length || null) && (
            <Button
              size='icon'
              className='mr-4 bg-red-700 hover:bg-red-800'
              onClick={() =>
                sessionStorage.getItem('showConfirmDialog') === 'false' ? removeHistory() : setShowConfirmDialog(true)
              }
            >
              <Trash2Icon size={20} />
            </Button>
          )}
        </SheetHeader>
        <AlertDialog open={showConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className='text-black'>
                This action cannot be undone. This will permanently delete all the files.
              </AlertDialogDescription>
              <div className='mt-4 flex items-center space-x-2'>
                <Checkbox id={doNotShowAgainId} onCheckedChange={handleConfirmDialogChange} />
                <Label
                  htmlFor={doNotShowAgainId}
                  className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Do not show again
                </Label>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeHistory()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {history.length > 0 ? (
          <ScrollArea>
            <div className='flex flex-col space-y-4 pr-2'>
              {history.map((item, index) => (
                <Card key={`${item.title}-${item.createdAt ?? index}`} className='gap-0 py-0'>
                  <CardHeader className='p-2'>
                    <CardTitle>
                      <Input
                        type='text'
                        name='title'
                        className='h-fit w-fit border-none p-1 underline shadow-none'
                        defaultValue={item.title}
                        onBlur={e => {
                          const newHistory = history.map(historyItem =>
                            item.title === historyItem.title ? { ...historyItem, title: e.target.value } : historyItem,
                          );
                          setHistory(newHistory);
                          localStorage.setItem('history', JSON.stringify(newHistory));
                        }}
                      />
                    </CardTitle>
                    <div className='pl-1 text-muted-foreground text-xs'>
                      <p>{item.seedGenes.length > 30 ? `${item.seedGenes.slice(0, 30)}...` : item.seedGenes}</p>
                      <p>
                        {item.diseaseMap} : Order - {item.order} : : {item.minScore}
                      </p>
                    </div>
                  </CardHeader>
                  <CardFooter className='flex flex-row-reverse p-1'>
                    <button
                      type='button'
                      className='rounded p-1 transition-colors hover:bg-zinc-300 hover:text-black'
                      onClick={() => removeHistory(item.title)}
                    >
                      <Trash2Icon size={20} />
                    </button>
                    <button
                      type='button'
                      className='rounded p-1 transition-colors hover:bg-zinc-300 hover:text-black'
                      onClick={() => handleGenerateGraph(index)}
                    >
                      <ExternalLinkIcon size={20} />
                    </button>
                    <button
                      type='button'
                      className='rounded p-1 transition-colors hover:bg-zinc-300 hover:text-black'
                      onClick={() => {
                        setFormData({
                          diseaseMap: item.diseaseMap,
                          seedGenes: item.seedGenes,
                          interactionType: item.interactionType,
                          minScore: item.minScore,
                          order: item.order,
                        });
                        setHistoryOpen(false);
                      }}
                    >
                      <EyeIcon size={20} />
                    </button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className='grid h-full place-items-center text-center text-lg italic'>No history available</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
