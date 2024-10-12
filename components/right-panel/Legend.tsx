import { ChevronsUpDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export function Legend() {
  return (
    <Collapsible defaultOpen className='mb-2 border p-2 rounded shadow text-xs'>
      <CollapsibleTrigger asChild>
        <div className='flex items-center justify-between w-full'>
          <p className='font-bold cursor-pointer hover:underline'>Legends</p>
          <ChevronsUpDown size={20} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='flex flex-col gap-2'></CollapsibleContent>
    </Collapsible>
  );
}
