'use client';

import { diseaseMap } from '@/lib/data';
import type { LeftSideBarProps } from '@/lib/interface';
import React from 'react';
import { Combobox } from './ComboBox';
import FileSheet from './FileSheet';
import NodeColor from './NodeColor';
import NodeSize from './NodeSize';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { useStore } from '@/lib/store';

export default function LeftSideBar({
  selectedRadioColor,
  setSelectedRadioColor,
  selectedRadioSize,
  setSelectedRadioSize,
}: LeftSideBarProps) {
  const nodeSearchQuery = useStore(state => state.nodeSearchQuery);
  const setNodeSearchQuery = useStore(state => state.setNodeSearchQuery);

  return (
    <ScrollArea className='border-r px-2 flex flex-col'>
      <div>
        <div className='flex flex-col'>
          <Label className='font-bold mb-2'>Disease Map</Label>
          <Combobox data={diseaseMap} className='w-full' />
        </div>
        <NodeColor selectedRadioColor={selectedRadioColor} setSelectedRadioColor={setSelectedRadioColor} />
      </div>
      <NodeSize selectedRadioSize={selectedRadioSize} setSelectedRadioSize={setSelectedRadioSize} />
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
        </div>
      </div>
    </ScrollArea>
  );
}
