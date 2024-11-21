import type { GraphConfigForm } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { ExternalLink, Eye, Pin, PinOff, Trash2 } from 'lucide-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

export type HistoryItem = GraphConfigForm & { title: string; geneIDs: string[] };

export default function History({
  history,
  setHistory,
  setFormData,
}: {
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  setFormData: (graphConfig: GraphConfigForm) => void;
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

  return (
    <div className='h-[92%]'>
      <h3 className='text-2xl font-semibold mb-1'>History</h3>
      {history.length > 0 ? (
        <ScrollArea className='h-full'>
          <div className='space-y-4 pr-2 flex flex-col'>
            {history.map((item, index) => (
              <Card key={item.title}>
                <CardHeader className='p-2'>
                  <CardTitle>
                    <Input
                      type='text'
                      name='title'
                      className='h-fit w-fit border-none shadow-none p-1 underline'
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
                  <div className='pl-1 text-xs text-muted-foreground'>
                    <p>{item.seedGenes.slice(0, 30) + (item.seedGenes.length > 30 && '...')}</p>
                    <p>
                      {item.diseaseMap} : Order - {item.order} : {item.interactionType} : {item.minScore}
                    </p>
                  </div>
                </CardHeader>
                <CardFooter className='p-1 flex flex-row-reverse'>
                  <button
                    type='button'
                    className='hover:bg-zinc-300 hover:text-black p-1 rounded transition-colors'
                    onClick={() => {
                      const newHistory = history.filter(({ title }) => title !== item.title);
                      setHistory(newHistory);
                      localStorage.setItem('history', JSON.stringify(newHistory));
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    type='button'
                    className='hover:bg-zinc-300 hover:text-black p-1 rounded transition-colors'
                    onClick={() => handleGenerateGraph(index)}
                  >
                    <ExternalLink size={20} />
                  </button>
                  <button
                    type='button'
                    className='hover:bg-zinc-300 hover:text-black p-1 rounded transition-colors'
                    onClick={() =>
                      setFormData({
                        diseaseMap: item.diseaseMap,
                        seedGenes: item.seedGenes,
                        interactionType: item.interactionType,
                        minScore: item.minScore,
                        order: item.order,
                      })
                    }
                  >
                    <Eye size={20} />
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className='text-center h-full italic grid place-items-center text-lg'>No history available</p>
      )}
    </div>
  );
}
