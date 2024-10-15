import type { GraphConfigForm } from '@/lib/interface';
import { useStore } from '@/lib/store';
import { ExternalLink, Eye, Pin, Trash2 } from 'lucide-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

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
    useStore.setState({ diseaseName: configFromHistory.diseaseMap });
    localStorage.setItem(
      'graphConfig',
      JSON.stringify({
        geneIDs: configFromHistory.geneIDs,
        diseaseMap: configFromHistory.diseaseMap,
        order: configFromHistory.order,
        interactionType: configFromHistory.interactionType,
        minScore: configFromHistory.minScore,
      }),
    );
    window.open('/network', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <h3 className='text-2xl font-semibold'>History</h3>
      {history.length > 0 ? (
        <div className='space-y-4'>
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
                      const newHistory = history.map((historyItem, idx) =>
                        idx === index ? { ...historyItem, title: e.target.value } : historyItem,
                      );
                      setHistory(newHistory);
                      localStorage.setItem('history', JSON.stringify(newHistory));
                    }}
                  />
                </CardTitle>
                <CardDescription className='pl-1 text-xs'>
                  <p>{item.seedGenes.slice(0, 30) + (item.seedGenes.length > 30 && '...')}</p>
                  <p>
                    {item.diseaseMap} : {item.order} : {item.interactionType} : {item.minScore}
                  </p>
                </CardDescription>
              </CardHeader>
              <CardFooter className='p-1 flex flex-row-reverse'>
                <button type='button' className='hover:bg-zinc-300 hover:text-black p-1 rounded transition-colors'>
                  <Pin size={20} />
                </button>
                <button
                  type='button'
                  className='hover:bg-zinc-300 hover:text-black p-1 rounded transition-colors'
                  onClick={() => {
                    const newHistory = history.filter((_, idx) => idx !== index);
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
                  onClick={() => setFormData({ ...item })}
                >
                  <Eye size={20} />
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className='text-center h-full italic grid place-items-center text-lg'>No history available</p>
      )}
    </>
  );
}
