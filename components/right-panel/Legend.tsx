'use client';

import { useStore } from '@/lib/store';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BinaryLegend, HeatmapLegend } from '../legends';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export function Legend() {
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const [minScore, setMinScore] = useState(0);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);

  useEffect(() => {
    setMinScore(Number(JSON.parse(localStorage.getItem('graphConfig') ?? '{}').minScore) ?? 0);
  }, []);

  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <CollapsibleTrigger asChild>
        <div className='flex items-center justify-between w-full'>
          <p className='font-bold cursor-pointer hover:underline'>Legends</p>
          <ChevronsUpDown size={20} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='flex flex-col gap-2 p-1 items-center'>
        {selectedRadioNodeColor && selectedRadioNodeColor !== 'None' ? (
          selectedRadioNodeColor === 'Pathway' || selectedRadioNodeColor === 'Database' ? (
            <BinaryLegend />
          ) : selectedRadioNodeColor === 'Genetics' || selectedRadioNodeColor === 'DEG' ? (
            <HeatmapLegend
              title={selectedRadioNodeColor}
              domain={[-1, 0, 1]}
              range={['green', defaultNodeColor, 'red']}
            />
          ) : selectedRadioNodeColor === 'Druggability' ||
            selectedRadioNodeColor === 'GDA' ||
            selectedRadioNodeColor === 'TE' ? (
            <HeatmapLegend
              title={selectedRadioNodeColor}
              domain={[0, 1]}
              range={[defaultNodeColor, 'red']}
              divisions={10}
            />
          ) : (
            <p className='text-center font-semibold'>No Legends Available</p>
          )
        ) : (
          <p className='text-center font-semibold'>Select Datapoints on left to view legends!</p>
        )}
        {showEdgeColor && (
          <HeatmapLegend
            title='Edge Color'
            range={['yellow', 'red']}
            domain={[minScore ?? 0, 1]}
            divisions={(1 - (minScore ?? 0)) * 10}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
