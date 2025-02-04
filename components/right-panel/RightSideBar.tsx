import { Legend, NetworkAnalysis, NetworkInfo, NetworkLayout, NetworkStyle, RadialAnalysis } from '.';
import { ScrollArea } from '../ui/scroll-area';

export function RightSideBar() {
  return (
    <ScrollArea className='border-l p-2 text-xs flex flex-col h-[98vh]'>
      <NetworkAnalysis>
        <RadialAnalysis />
      </NetworkAnalysis>
      <NetworkInfo />
      <Legend />
      <NetworkLayout />
      <NetworkStyle />
    </ScrollArea>
  );
}
