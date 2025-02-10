import { SquareDashedMousePointer } from 'lucide-react';
import { Suspense, useState } from 'react';
import { Export, FileName } from '.';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function AppBar() {
  const [visible, setVisible] = useState(true);
  return (
    <div className='flex gap-2 items-center'>
      <Tooltip>
        <TooltipTrigger className='relative'>
          {visible && (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <span className='absolute -bottom-2 flex size-2.5' onClick={() => setVisible(false)}>
              <span className='absolute inline-flex h-[150%] w-[150%] z-50 animate-ping rounded-full -bottom-0.5 bg-sky-400 opacity-75' />
              <span className='relative inline-flex size-2.5 rounded-full bg-sky-500' />
            </span>
          )}
          <SquareDashedMousePointer className='h-4 w-4' />
        </TooltipTrigger>
        <TooltipContent align='start' className='max-w-96 text-sm'>
          <ol>
            <li>
              • To select multiple genes and export details or perform GSEA analysis, use the mouse to select the genes
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='border rounded-md px-1'> Shift(⇧) + Click</kbd> & Drag
            </li>
            <br />
            <li>
              • To highlight neighbors of a gene, either check Highlight Neighbor Genes on Network Style section and
              then hover/click the gene
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='border rounded-md px-1'>Cmd/Ctrl(⌘) + Hover</kbd>
            </li>
            <br />
            <li>
              • To highlight a gene via appending it to search textbox, click the gene while holding the Cmd/Ctrl(⌘) key
              <br />
              <b>
                <i>Shortcut: </i>
              </b>
              <kbd className='border rounded-md px-1'>Cmd/Ctrl(⌘) + Click</kbd>
            </li>
          </ol>
        </TooltipContent>
      </Tooltip>
      <Suspense fallback={<Input className='text-sm font-semibold max-w-fit' value={'Untitled'} />}>
        <FileName />
      </Suspense>
      <Export />
    </div>
  );
}
