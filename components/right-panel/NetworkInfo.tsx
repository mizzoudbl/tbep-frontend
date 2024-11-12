'use client';

import { columnGseaResults, columnSelectedNodes } from '@/lib/data';
import type { Gsea } from '@/lib/interface';
import { useStore } from '@/lib/store';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import PopUpDataTable from '../PopUpDataTable';
import { Button } from '../ui/button';

export function NetworkInfo() {
  const totalNodes = useStore(state => state.totalNodes);
  const totalEdges = useStore(state => state.totalEdges);
  const selectedNodes = useStore(state => state.selectedNodes);
  const [showTable, setShowTable] = React.useState(false);
  const [gseaData, setGseaData] = React.useState<Array<Gsea>>([]);

  useEffect(() => {
    if (selectedNodes.length === 0) return;
    (async () => {
      const geneNames = selectedNodes.map(node => node.Gene_Name).join(',');
      setShowTable(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/gsea?gene_list=${encodeURIComponent(geneNames)}`,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          cache: 'force-cache',
        },
      );
      if (!response.ok) {
        toast.error('Failed to fetch GSEA data', {
          cancel: { label: 'Close', onClick() {} },
          position: 'top-center',
          richColors: true,
          description: 'Server not available,Please try again later',
        });
        return;
      }
      const data: Array<Gsea> = await response.json();
      setGseaData(data);
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
          setOpen={setShowTable}
          filterColumnNames={['Gene_Name', 'Gene_set']}
        />
      </div>
    </div>
  );
}
