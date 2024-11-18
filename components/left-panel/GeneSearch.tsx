'use client';

import { useStore } from '@/lib/store';
import React, { createRef, useEffect } from 'react';
import { Textarea } from '../ui/textarea';

export function GeneSearch() {
  const nodeSearchQuery = useStore(state => state.nodeSearchQuery);
  const setNodeSearchQuery = useStore(state => state.setNodeSearchQuery);
  const suggestions = useStore(state => state.nodeSuggestions);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
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

  useEffect(() => {
    if (!nodeSearchQuery || nodeSearchQuery.split(/[\n,]/).pop()?.trim().length === 0) {
      useStore.setState({ nodeSuggestions: [] });
    }
  }, [nodeSearchQuery]);

  return (
    <div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <span
        className='text-xs underline cursor-pointer text-zinc-500'
        onClick={() => setNodeSearchQuery(geneIDs.join('\n'))}
      >
        #Seed Genes
      </span>
      <div className='relative w-full'>
        {suggestions.length > 0 && (
          <ul
            style={{
              bottom: textareaRef.current?.clientHeight,
            }}
            className='absolute z-10 w-full mt-0.5 bg-white border border-gray-300 rounded-md shadow-sm max-h-32 overflow-auto text-xs'
          >
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
          placeholder='Search nodes...'
          className='min-h-20 text-xs'
          value={nodeSearchQuery}
          onChange={e => setNodeSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
