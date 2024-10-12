'use client';

import { diseaseMap } from '@/lib/data';
import type { GraphStore } from '@/lib/interface';
import { useStore } from '@/lib/store';
import React from 'react';
import { Export, NodeColor, NodeSize } from '.';
import { Combobox } from '../ComboBox';
import FileSheet from '../FileSheet';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';

export function LeftSideBar() {
  const nodeSearchQuery = useStore(state => state.nodeSearchQuery);
  const setNodeSearchQuery = useStore(state => state.setNodeSearchQuery);
  const selectedRadioNodeSize = useStore(state => state.selectedRadioNodeSize);
  const selectedRadioNodeColor = useStore(state => state.selectedRadioNodeColor);

  const handleSelectedRadioButton = (value: string, key: keyof GraphStore) => {
    useStore.setState({ [key]: value });
  };

  return (
    <ScrollArea className='border-r p-2 flex flex-col h-[98vh]'>
      <div>
        <div className='flex flex-col'>
          <Label className='font-bold mb-2'>Disease Map</Label>
          <Combobox data={diseaseMap} className='w-full' />
        </div>
        <NodeColor radioValue={selectedRadioNodeColor} onChange={handleSelectedRadioButton} />
      </div>
      <NodeSize radioValue={selectedRadioNodeSize} onChange={handleSelectedRadioButton} />
      <div className='mt-auto'>
        <div className='flex flex-col space-y-2 mb-2'>
          <div>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <span
              className='text-xs underline cursor-pointer text-zinc-500'
              onClick={() =>
                setNodeSearchQuery(
                  (
                    JSON.parse(localStorage.getItem('graphConfig') || '{ geneIDs: [] }') as { geneIDs: Array<string> }
                  ).geneIDs.join('\n'),
                )
              }
            >
              #Seed Genes
            </span>
            <div className='relative w-full'>
              <Textarea
                id='nodeSearchQuery'
                placeholder='Search nodes...'
                className='min-h-20 text-xs'
                value={nodeSearchQuery}
                onChange={e => setNodeSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <FileSheet />
          <Export />
        </div>
      </div>
    </ScrollArea>
  );
}
