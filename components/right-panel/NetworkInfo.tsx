'use client';

import { columnGseaResults, columnSelectedNodes } from '@/lib/data';
import { useStore } from '@/lib/hooks';
import type { Gsea } from '@/lib/interface';
import { envURL } from '@/lib/utils';
import React, { useEffect } from 'react';
import PopUpDataTable from '../PopUpDataTable';
import { Button } from '../ui/button';

export function NetworkInfo() {
  const totalNodes = useStore(state => state.totalNodes);
  const totalEdges = useStore(state => state.totalEdges);
  const selectedNodes = useStore(state => state.selectedNodes);
  const [showTable, setShowTable] = React.useState(false);
  const [gseaData, setGseaData] = React.useState<Array<Gsea>>([]);
  const [gseaLoading, setGseaLoading] = React.useState(false);

  useEffect(() => {
    if (selectedNodes.length === 0) return;
    (async () => {
      setGseaLoading(true);
      setShowTable(true);
      const response = await fetch(`${envURL(process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL)}/gsea`, {
        method: 'POST',
        body: JSON.stringify(selectedNodes.map(node => node.Gene_Name)),
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache',
      });
      const data: Array<Gsea> = await response.json();
      setGseaData(data);
      setGseaLoading(false);
    })();
  }, [selectedNodes]);

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
        <PopUpDataTable
          data={[selectedNodes, gseaData]}
          columns={[columnSelectedNodes, columnGseaResults]}
          dialogTitle={'Selected Genes'}
          tabsTitle={['Details', 'GSEA Analysis']}
          open={showTable}
          loading={[false, gseaLoading]}
          setOpen={setShowTable}
          filterColumnNames={['Gene_Name', 'Pathway']}
        />
      </div>
    </div>
  );
}
