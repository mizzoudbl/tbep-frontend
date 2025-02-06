'use client';

import { PROPERTY_TYPE_LABEL_MAPPING } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import { P_VALUE_REGEX } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BinaryLegend, HeatmapLegend } from '../legends';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export function Legend() {
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);
  const selectedNodeColorProperty = useStore(state => state.selectedNodeColorProperty);
  const showEdgeColor = useStore(state => state.showEdgeColor);
  const [minScore, setMinScore] = useState(0);
  const defaultNodeColor = useStore(state => state.defaultNodeColor);

  useEffect(() => {
    setMinScore(Number(JSON.parse(localStorage.getItem('graphConfig') ?? '{}').minScore) ?? 0);
  }, []);

  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <div className='flex items-center justify-between w-full'>
        <p className='font-bold cursor-pointer hover:underline'>Legends</p>
        <CollapsibleTrigger asChild>
          <Button type='button' variant='outline' size='icon' className='w-6 h-6'>
            <ChevronsUpDown size={15} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='flex flex-col gap-2 p-1 items-center'>
        {selectedRadioNodeColor ? (
          selectedRadioNodeColor === 'Pathway' ? (
            <BinaryLegend />
          ) : selectedRadioNodeColor === 'DEG' ? (
            typeof selectedNodeColorProperty === 'string' && P_VALUE_REGEX.test(selectedNodeColorProperty) ? (
              <HeatmapLegend
                title='P-Value'
                range={[defaultNodeColor, 'red']}
                startLabel='Low Significance'
                endLabel='High Significance'
              />
            ) : (
              <HeatmapLegend
                title={PROPERTY_TYPE_LABEL_MAPPING[selectedRadioNodeColor]}
                domain={[-1, 0, 1]}
                range={['green', '#E2E2E2', 'red']}
                divisions={10}
              />
            )
          ) : selectedRadioNodeColor === 'Druggability' || selectedRadioNodeColor === 'OpenTargets' ? (
            <HeatmapLegend
              title={PROPERTY_TYPE_LABEL_MAPPING[selectedRadioNodeColor]}
              domain={[0, 1]}
              range={[defaultNodeColor, 'red']}
              divisions={10}
            />
          ) : selectedRadioNodeColor === 'TE' ? (
            <HeatmapLegend
              title={PROPERTY_TYPE_LABEL_MAPPING[selectedRadioNodeColor]}
              range={[defaultNodeColor, 'red']}
              startLabel='Low'
              endLabel='High'
            />
          ) : selectedRadioNodeColor === 'OT_Prioritization' ? (
            <HeatmapLegend
              title={PROPERTY_TYPE_LABEL_MAPPING[selectedRadioNodeColor]}
              domain={[-1, 0, 1]}
              range={['red', '#F0C584', 'green']}
              divisions={10}
            />
          ) : (
            <p className='text-center font-semibold'>No Legends Available</p>
          )
        ) : (
          <p className='text-center font-semibold'>Select Data-points on left to view legends!</p>
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
