import { useStore } from '@/lib/hooks';
import { SquareDashedMousePointer } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Export } from '.';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const FileName = () => {
  const searchParams = useSearchParams();
  const projectTitle = useStore(state => state.projectTitle);

  useEffect(() => {
    const fileName = searchParams?.get('file') ?? 'Untitled';
    useStore.setState({ projectTitle: fileName });
  }, [searchParams]);

  return (
    <Input
      className='text-sm font-semibold max-w-fit'
      value={projectTitle}
      onChange={e => useStore.setState({ projectTitle: e.target.value })}
    />
  );
};

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
        <TooltipContent align='start' className='max-w-80'>
          <ol>
            <li>
              • To select multiple genes and export details or perform GSEA analysis, use the mouse to select the genes
              <br />
              <b>
                <i>Shortcut:</i>
              </b>{' '}
              <kbd className='border rounded-md px-1'> Shift(⇧) + Click</kbd> & Drag
            </li>
            <br />
            <li>
              • To highlight neighbors of a gene, either <kbd className='border rounded-md px-1'>Click</kbd> on the gene
              node, or use the <kbd className='border rounded-md px-1'>Ctrl(⌘) + Hover</kbd> on the gene node
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
