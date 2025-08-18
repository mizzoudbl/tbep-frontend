'use client';

import { SquareArrowOutUpRightIcon } from 'lucide-react';
import React, { createRef, useEffect } from 'react';
import { useStore } from '@/lib/hooks';
import { type EventMessage, Events, eventEmitter } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

export function GeneSearch() {
  const nodeSearchQuery = useStore(state => state.nodeSearchQuery);
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
    useStore.setState({ nodeSearchQuery: `${words.join(', ')}, ` });
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
      <div className='flex justify-between my-1'>
        <button
          type='button'
          className='text-xs underline cursor-pointer text-zinc-500'
          onClick={() => useStore.setState({ nodeSearchQuery: geneIDs.join('\n') })}
        >
          #Seed Genes
        </button>
        <button
          type='button'
          className='inline-flex text-xs underline cursor-pointer text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={nodeSearchQuery.length === 0}
          onClick={() =>
            eventEmitter.emit(Events.EXPORT, {
              format: 'csv',
              csvType: 'universal',
            } satisfies EventMessage[Events.EXPORT])
          }
        >
          Export <SquareArrowOutUpRightIcon size={10} className='mt-1 ml-0.5' />
        </button>
      </div>
      <div className='relative w-full'>
        {suggestions.length > 0 && (
          <ul className='absolute z-10 w-full mt-0.5 bg-white border border-gray-300 rounded-md shadow-sm max-h-32 overflow-auto text-xs'>
            {suggestions.map((suggestion, index) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: Not possible to use key events with click events
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
          placeholder='Search Genes...'
          className='min-h-20 text-xs'
          value={nodeSearchQuery}
          onChange={e => useStore.setState({ nodeSearchQuery: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
