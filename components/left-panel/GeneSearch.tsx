'use client';

import { GENE_UNIVERSAL_QUERY } from '@/lib/gql';
import { useStore } from '@/lib/hooks';
import type { GeneUniversalData, GeneUniversalDataVariables } from '@/lib/interface';
import { useLazyQuery } from '@apollo/client';
import { unparse } from 'papaparse';
import React, { createRef, useEffect } from 'react';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';

export function GeneSearch() {
  const nodeSearchQuery = useStore(state => state.nodeSearchQuery);
  const setNodeSearchQuery = useStore(state => state.setNodeSearchQuery);
  const suggestions = useStore(state => state.nodeSuggestions);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const textareaRef = createRef<HTMLTextAreaElement>();
  const { geneIDs } = useStore(state => state.graphConfig) ?? { geneIDs: [] };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      appendSuggestion(suggestions[selectedIndex]);
    }
  };

  const appendSuggestion = (suggestion: string) => {
    const words = nodeSearchQuery.split(/[\n,]/);
    words.pop();
    words.push(suggestion);
    setNodeSearchQuery(`${words.join(', ')}, `);
    useStore.setState({ nodeSuggestions: [] });
    textareaRef.current?.focus();
    setSelectedIndex(-1);
  };

  const [fetchGenes, { loading }] = useLazyQuery<GeneUniversalData, GeneUniversalDataVariables>(
    GENE_UNIVERSAL_QUERY(true),
  );

  const handleExport = async () => {
    const { diseaseName, geneNameToID } = useStore.getState();
    const geneIDs = nodeSearchQuery
      .toUpperCase()
      .split(/[\n,]/)
      .reduce<string[]>((acc, s) => {
        const trimmed = s.trim();
        if (!trimmed) return acc;
        if (trimmed.startsWith('ENSG')) {
          acc.push(trimmed);
        } else {
          const id = geneNameToID.get(trimmed);
          if (id) acc.push(id);
        }
        return acc;
      }, []);

    const { data } = await fetchGenes({
      variables: {
        geneIDs,
        config: [{ disease: diseaseName, properties: ['*'] }],
      },
    });
    if (!data) return;

    const geneData = unparse(
      data.genes.map(gene => {
        return {
          ID: gene.ID,
          Gene_name: gene.Gene_name,
          Description: gene.Description,
          hgnc_gene_id: gene.hgnc_gene_id,
          Aliases: gene.Aliases?.replace(/,/g, '|'),
          ...gene.common,
          ...gene.disease?.[diseaseName],
        };
      }),
    );

    const blob = new Blob([geneData], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-genes.csv';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  useEffect(() => {
    if (!nodeSearchQuery || nodeSearchQuery.split(/[\n,]/).pop()?.trim().length === 0) {
      useStore.setState({ nodeSuggestions: [] });
    }
  }, [nodeSearchQuery]);

  return (
    <div>
      <div className='flex justify-between my-1'>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className='text-xs underline cursor-pointer text-zinc-500'
          onClick={() => setNodeSearchQuery(geneIDs.join('\n'))}
        >
          #Seed Genes
        </span>
        <button
          type='button'
          className='inline-flex text-xs underline cursor-pointer text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={nodeSearchQuery.length === 0}
          onClick={handleExport}
        >
          {loading && <Spinner className='w-4 h-4 mr-1' />}
          Export
        </button>
      </div>
      <div className='relative w-full'>
        {suggestions.length > 0 && (
          <ul className='absolute z-10 w-full mt-0.5 bg-white border border-gray-300 rounded-md shadow-sm max-h-32 overflow-auto text-xs'>
            {suggestions.map((suggestion, index) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              <li
                key={suggestion}
                className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                onClick={() => appendSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <Textarea
          ref={textareaRef}
          id='nodeSearchQuery'
          placeholder='Search Genes...'
          className='min-h-20 text-xs'
          value={nodeSearchQuery}
          onChange={e => setNodeSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
