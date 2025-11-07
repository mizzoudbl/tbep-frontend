'use client';

import { SquareArrowOutUpRightIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useStore } from '@/lib/hooks';
import { type EventMessage, Events, eventEmitter } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

export function GeneSearch() {
  const nodeSearchQuery = useStore(state => state.nodeSearchQuery);
  const suggestions = useStore(state => state.nodeSuggestions);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [cursorPosition, setCursorPosition] = React.useState({ top: 0, left: 0 });
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const measureSpanRef = React.useRef<HTMLSpanElement>(null);
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
    const words = nodeSearchQuery.split(/[\n,]/).filter(w => w.trim().length > 0);
    words.pop();
    words.push(suggestion);
    useStore.setState({
      nodeSearchQuery: `${words.join(', ')}, `,
      nodeSuggestions: [],
    });
    textareaRef.current?.focus();
    setSelectedIndex(-1);
  };

  const updateCursorPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const computedStyle = window.getComputedStyle(textarea);

    // Create reusable span once
    if (!measureSpanRef.current) {
      const span = document.createElement('span');
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'pre';
      span.style.pointerEvents = 'none';
      document.body.appendChild(span);
      measureSpanRef.current = span;
      span.style.font = computedStyle.font;
      span.style.fontSize = computedStyle.fontSize;
      span.style.fontFamily = computedStyle.fontFamily;
      span.style.fontWeight = computedStyle.fontWeight;
      span.style.letterSpacing = computedStyle.letterSpacing;
    }
    const span = measureSpanRef.current;

    // Calculate position
    const lineHeight = Number.parseFloat(computedStyle.lineHeight);
    const paddingTop = Number.parseFloat(computedStyle.paddingTop);
    const paddingLeft = Number.parseFloat(computedStyle.paddingLeft);

    const textBeforeCursor = nodeSearchQuery.substring(0, textarea.selectionStart);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines.length - 1;

    // Measure text width
    span.textContent = lines[lines.length - 1];
    const textWidth = span.getBoundingClientRect().width;

    setCursorPosition({
      top: paddingTop + currentLine * lineHeight - textarea.scrollTop,
      left: paddingLeft + textWidth,
    });
  };

  useEffect(() => {
    if (!nodeSearchQuery || nodeSearchQuery.split(/[\n,]/).pop()?.trim().length === 0) {
      useStore.setState({ nodeSuggestions: [] });
    }
  }, [nodeSearchQuery]);

  return (
    <div>
      <div className='my-1 flex justify-between'>
        <button
          type='button'
          className='cursor-pointer text-xs text-zinc-500 underline'
          onClick={() => useStore.setState({ nodeSearchQuery: geneIDs.join('\n') })}
        >
          #Seed Genes
        </button>
        <button
          type='button'
          className='inline-flex cursor-pointer text-xs text-zinc-500 underline disabled:cursor-not-allowed disabled:opacity-50'
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
        <Textarea
          ref={textareaRef}
          placeholder='Search Genes...'
          className='min-h-20 bg-white text-xs'
          value={nodeSearchQuery}
          onChange={e => {
            useStore.setState({ nodeSearchQuery: e.target.value });
            updateCursorPosition();
          }}
          onKeyDown={handleKeyDown}
          onClick={updateCursorPosition}
        />
        {suggestions.length > 0 && (
          <ul
            className='absolute z-50 max-h-32 w-48 overflow-auto rounded-md border border-gray-300 bg-white text-xs shadow-lg'
            style={{
              top: `${cursorPosition.top + 20}px`,
              left: `${cursorPosition.left}px`,
            }}
          >
            {suggestions.map((suggestion, index) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: Not possible to use key events with click events
              <li
                key={suggestion}
                className={`cursor-pointer px-2 py-1 hover:bg-gray-100 ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                onClick={() => appendSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
