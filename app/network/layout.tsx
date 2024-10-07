'use client';

import LeftSideBar from '@/components/LeftSideBar';
import RightSideBar from '@/components/RightSideBar';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { type ChangeEvent, type KeyboardEvent } from 'react';

export default function NetworkLayout({ children }: { children: React.ReactNode }) {
  const [leftSidebar, setLeftSidebar] = React.useState<boolean>(true);
  const [rightSidebar, setRightSidebar] = React.useState<boolean>(true);
  const [selectedRadioColor, setSelectedRadioColor] = React.useState<string | undefined>(undefined);
  const [selectedRadioSize, setSelectedRadioSize] = React.useState<string | undefined>(undefined);
  const [sliderValue2, setSliderValue2] = React.useState(30);

  React.useEffect(() => {
    const event = async (event: globalThis.KeyboardEvent) => {
      if (event.altKey) {
        if (event.key === 'l') setLeftSidebar(!leftSidebar);
        if (event.key === 'r') setRightSidebar(!rightSidebar);
      }
    };
    window.addEventListener('keydown', event);
    return () => {
      window.removeEventListener('keydown', event);
    };
  }, [leftSidebar, rightSidebar]);

  const handleSliderChange = (value: number[], setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(value[0]);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    const value = Number.parseInt(event.target.value);
    if (!Number.isNaN(value) && value >= 0 && value <= 100) {
      setter(value);
    }
  };

  return (
    <>
      <div className='h-screen flex flex-col bg-gray-100'>
        <div className='bg-gray-200 h-8 flex items-center justify-between'>
          <Button variant='ghost' size='icon' onClick={() => setLeftSidebar(!leftSidebar)}>
            {leftSidebar ? <ChevronLeft className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
          </Button>
          <div className='text-xs font-semibold'>Drug Target Discovery</div>
          <Button variant='ghost' size='icon' onClick={() => setRightSidebar(!rightSidebar)}>
            {rightSidebar ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
          </Button>
        </div>

        <ResizablePanelGroup direction='horizontal' className='flex flex-1'>
          {leftSidebar && (
            <>
              <ResizablePanel defaultSize={16} minSize={16}>
                <LeftSideBar
                  selectedRadioColor={selectedRadioColor}
                  setSelectedRadioColor={setSelectedRadioColor}
                  selectedRadioSize={selectedRadioSize}
                  setSelectedRadioSize={setSelectedRadioSize}
                  handleInputChange={handleInputChange}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          <ResizablePanel defaultSize={75} className='flex-1 bg-white'>
            {children}
          </ResizablePanel>
          {rightSidebar && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={16} minSize={16}>
                <RightSideBar
                  sliderValue2={sliderValue2}
                  setSliderValue2={setSliderValue2}
                  handleSliderChange={handleSliderChange}
                  handleInputChange={handleInputChange}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </>
  );
}
