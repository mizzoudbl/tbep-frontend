'use client';

import { useStore } from '@/lib/store';
import React from 'react';
import PopUpDataTable from '../PopUpDataTable';
import { Button } from '../ui/button';

export function NetworkInfo() {
  const totalNodes = useStore(state => state.totalNodes);
  const totalEdges = useStore(state => state.totalEdges);

  const selectedNodes = useStore(state => state.selectedNodes);
  const [showTable, setShowTable] = React.useState(false);

  return (
    <div className='mb-2 border p-2 rounded shadow text-xs'>
      <p className='font-bold mb-2'>Network Info</p>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <span>Total Nodes: {totalNodes}</span>
          <span>Total Edges: {totalEdges}</span>
        </div>
        <Button
          disabled={selectedNodes.length === 0}
          variant='outline'
          size='sm'
          className='font-semibold'
          onClick={() => setShowTable(true)}
        >
          Show Details
        </Button>
        <PopUpDataTable data={selectedNodes} open={showTable} setOpen={setShowTable} />
      </div>
    </div>
  );
}
